const axios = require('axios');
const https = require('https');
axios.defaults.httpsAgent = new https.Agent({ family: 4 });
const { GoogleGenerativeAI } = require('@google/generative-ai');
const ChatHistory = require('../models/ChatHistory');

// Inisialisasi Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getRecommendation = async (req, res) => {
  try {
    // ====================================================
    // LANGKAH 1: Validasi (sudah ditangani express-validator di route)
    // ====================================================
    const { prompt, kategori, user_location, top_n } = req.body;

    // ====================================================
    // LANGKAH 2: Panggil AI Service (FastAPI) - Semantic Search
    // Response: array objek { name, category, rating, total_reviews, semantic_similarity, final_score }
    // ====================================================
    let aiResults;
    try {
      const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/api/recommend`, {
        category: kategori,
        query: prompt,
        top_n: top_n || 3
      }, { timeout: 60000 });

      aiResults = Array.isArray(aiResponse.data) ? aiResponse.data : aiResponse.data?.recommendations;
    } catch (err) {
      console.error('AI Service Error:', err.message);
      return res.status(502).json({
        status: 'error',
        message: 'Gagal terhubung ke AI Service, coba lagi nanti'
      });
    }

    // AI Service mengembalikan array langsung (bukan nested object)
    if (!Array.isArray(aiResults) || aiResults.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'AI Service tidak menemukan rekomendasi yang sesuai'
      });
    }

    // Ambil item dengan final_score tertinggi (seharusnya sudah urut, tapi amankan)
    const topResult = aiResults.reduce((best, item) =>
      item.final_score > best.final_score ? item : best, aiResults[0]
    );
    const destinationName = topResult.name;

    // ====================================================
    // LANGKAH 3: Google Geocoding API
    // Tambahkan konteks "Jawa Barat, Indonesia" karena nama wisata sering generik/ambigu
    // ====================================================
    const geocodeQuery = encodeURIComponent(`${destinationName}, Jawa Barat, Indonesia`);
    let geoLat = -6.9175; // Default Bandung
    let geoLng = 107.6191;
    let placeId = null;

    const hasValidKey = process.env.GOOGLE_MAPS_API_KEY && 
                        process.env.GOOGLE_MAPS_API_KEY !== 'your_google_maps_api_key' &&
                        process.env.GOOGLE_MAPS_API_KEY.trim() !== '';

    if (hasValidKey) {
      try {
        // Hit Google Geocoding API dengan region bias Indonesia dan komponen Jawa Barat
        const geocodeResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json` +
          `?address=${geocodeQuery}` +
          `&region=id` +
          `&components=administrative_area:Jawa Barat|country:ID` +
          `&key=${process.env.GOOGLE_MAPS_API_KEY}`,
          { timeout: 8000 }
        );

        const geoData = geocodeResponse.data;

        if (geoData.status === 'OK' && geoData.results && geoData.results.length > 0) {
          // Ekstrak lat, lng, dan place_id dari result pertama
          geoLat = geoData.results[0].geometry.location.lat;
          geoLng = geoData.results[0].geometry.location.lng;
          placeId = geoData.results[0].place_id;
        } else {
          console.warn(`Geocoding warning: Google Maps returned status ${geoData.status}. Using default coordinates.`);
        }
      } catch (err) {
        console.warn('Google Geocoding API Error (falling back to defaults):', err.message);
      }
    } else {
      console.log('Google Maps API Key is missing or using placeholder. Using fallback coordinates.');
    }

    // ====================================================
    // LANGKAH 4: Google Places API (Details, Legacy)
    // Gunakan place_id dari Geocoding untuk mendapatkan detail & foto
    // Non-fatal: jika gagal, photos = [] dan lanjut proses
    // ====================================================
    let placeRating = topResult.rating || null;
    let placePhone = null;
    let placePhotos = [];

    if (hasValidKey && placeId) {
      try {
        // Hit Google Places Details API (Legacy) dengan fields terbatas
        const placeResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/place/details/json` +
          `?place_id=${placeId}` +
          `&fields=name,rating,formatted_phone_number,photos` +
          `&key=${process.env.GOOGLE_MAPS_API_KEY}`,
          { timeout: 8000 }
        );

        const placeData = placeResponse.data?.result;

        if (placeData) {
          // Override rating dengan data Google Places jika tersedia
          if (placeData.rating) placeRating = placeData.rating;
          if (placeData.formatted_phone_number) placePhone = placeData.formatted_phone_number;

          // Ambil maksimal 5 photo_reference dan generate URL string (tidak fetch biner)
          if (placeData.photos && placeData.photos.length > 0) {
            placePhotos = placeData.photos.slice(0, 5).map(photo =>
              `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
            );
          }
        }
      } catch (err) {
        // Non-fatal: jika Places API gagal, lanjutkan dengan data kosong
        console.error('Google Places API Error:', err.response?.data || err.message);
        placePhotos = [];
      }
    }

    // ====================================================
    // LANGKAH 5: Google Routes API - Rute & Lalu Lintas Real-time
    // origin: user_location, destination: lat/lng dari Geocoding
    // Wajib: extraComputations untuk mendapatkan speedReadingIntervals
    // ====================================================
    let ruteDanLaluLintas = null;

    if (hasValidKey) {
      try {
        const routesPayload = {
          origin: {
            location: {
              latLng: {
                latitude: user_location.lat,
                longitude: user_location.lng
              }
            }
          },
          destination: {
            location: {
              latLng: {
                latitude: geoLat,
                longitude: geoLng
              }
            }
          },
          travelMode: 'DRIVE',
          routingPreference: 'TRAFFIC_AWARE',
          // Wajib ditambahkan agar speedReadingIntervals tidak kosong
          extraComputations: ['TRAFFIC_ON_POLYLINE']
        };

        // Hit Google Routes API v2 dengan field mask lengkap
        const routesResponse = await axios.post(
          'https://routes.googleapis.com/directions/v2:computeRoutes',
          routesPayload,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
              'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.travelAdvisory.speedReadingIntervals,routes.polyline.encodedPolyline'
            },
            timeout: 8000
          }
        );

        const route = routesResponse.data?.routes?.[0];

        if (route) {
          // Mapping kondisi_kemacetan dari speedReadingIntervals
          // Prioritas: TRAFFIC_JAM > SLOW > NORMAL
          const intervals = route.travelAdvisory?.speedReadingIntervals || [];
          let kondisiKemacetan = 'NORMAL';

          for (const interval of intervals) {
            if (interval.speed === 'TRAFFIC_JAM') {
              kondisiKemacetan = 'TRAFFIC_JAM';
              break; // Sudah kondisi terburuk, tidak perlu cek lagi
            }
            if (interval.speed === 'SLOW') {
              kondisiKemacetan = 'SLOW';
              // Jangan break, masih mungkin ada TRAFFIC_JAM di interval lain
            }
          }

          // Parse durasi dari format "123s" ke integer detik
          const durasiString = route.duration || '0s';
          const durasiDetik = parseInt(durasiString.replace('s', ''), 10) || 0;

          ruteDanLaluLintas = {
            jarak_meter: route.distanceMeters,
            durasi_detik: durasiDetik,
            kondisi_kemacetan: kondisiKemacetan,
            polyline: route.polyline?.encodedPolyline || null
          };
        }
      } catch (err) {
        // Non-fatal: jika Routes API error/limit → null, tidak membatalkan proses
        console.error('Google Routes API Error:', err.response?.data || err.message);
        ruteDanLaluLintas = null;
      }
    }

    // Fallback jika API Key kosong atau API request gagal
    if (!ruteDanLaluLintas) {
      ruteDanLaluLintas = {
        jarak_meter: 15000,
        durasi_detik: 1200,
        kondisi_kemacetan: 'NORMAL',
        polyline: null
      };
    }

    // ====================================================
    // LANGKAH 6: Google Gemini LLM - Rangkai Jawaban Natural
    // Instruksi: 1-2 paragraf bahasa Indonesia santai, tanpa markdown/bullet
    // ====================================================
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const geminiPrompt = `
Kamu adalah asisten rekomendasi wisata yang ramah dan santai berbahasa Indonesia.

Permintaan user: "${prompt}"

Berikut data destinasi yang paling cocok:
- Nama: ${destinationName}
- Kategori: ${kategori}
- Rating: ${placeRating || 'tidak tersedia'}
${placePhotos.length > 0 ? `- Tersedia ${placePhotos.length} foto dari Google Maps` : '- Foto tidak tersedia'}

${ruteDanLaluLintas
        ? `Info perjalanan dari lokasi user: jarak sekitar ${(ruteDanLaluLintas.jarak_meter / 1000).toFixed(1)} km, estimasi waktu tempuh ${Math.round(ruteDanLaluLintas.durasi_detik / 60)} menit. Kondisi lalu lintas saat ini: ${ruteDanLaluLintas.kondisi_kemacetan === 'TRAFFIC_JAM' ? 'macet' : ruteDanLaluLintas.kondisi_kemacetan === 'SLOW' ? 'agak padat' : 'lancar'}.`
        : 'Info lalu lintas tidak tersedia saat ini.'}

Tugas kamu: Buatkan jawaban 1-2 paragraf dengan bahasa santai dan ramah. Jelaskan kenapa tempat ini cocok untuk user berdasarkan permintaan mereka, sebutkan info rating dan perjalanan jika ada. Jangan gunakan format markdown, bullet point, atau tanda bintang.
`;

    let pesanAI;
    try {
      // Panggil Google Gemini API untuk generate teks natural
      const result = await model.generateContent(geminiPrompt);
      pesanAI = result.response.text();
    } catch (err) {
      // Fallback ke template statis jika Gemini error — jangan gagalkan response
      console.error('Gemini API Error:', err.message);
      pesanAI = `Rekomendasi kami untuk kamu adalah ${destinationName}, cocok untuk kategori ${kategori}. Tempat ini memiliki rating ${placeRating || '-'} dan layak untuk dikunjungi. Selamat berlibur!`;
    }

    // ====================================================
    // LANGKAH 7: Susun Response Akhir (format sesuai kontrak frontend)
    // ====================================================
    const finalResponse = {
      status: 'success',
      pesan_ai: pesanAI,
      destinasi: {
        nama_tempat: destinationName,
        rating: placeRating,
        lokasi: {
          lat: geoLat,
          lng: geoLng
        },
        photos: placePhotos
      },
      rute_dan_lalu_lintas: ruteDanLaluLintas
    };

    // ====================================================
    // LANGKAH 8: Simpan ke ChatHistory secara async (tidak blocking)
    // Hanya simpan jika user login (req.user ada). Guest → skip sepenuhnya.
    // ====================================================
    if (req.user) {
      ChatHistory.create({
        user_id: req.user.id,
        prompt,
        kategori,
        hasil_rekomendasi: finalResponse
      }).catch(err => console.error('Gagal simpan ChatHistory:', err.message));
    }

    return res.status(200).json(finalResponse);

  } catch (err) {
    console.error('Recommendation Controller Error:', err.message);
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' });
  }
};
