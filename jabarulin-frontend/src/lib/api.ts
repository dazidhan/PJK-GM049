const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface DestinationItem {
  name: string;
  rating: number | null;
  category: string;
  address: string;
  total_reviews: number | null;
  google_maps_url: string | null;
  website: string | null;
  final_score: number;
  distance_info: {
    distance_km: string;
    duration_mins: number;
    traffic_condition: string;
  } | null;
}

export interface RecommendationResponse {
  status: string;
  reply: string;
  raw_data: DestinationItem[];
  rute_dan_lalu_lintas: {
    jarak_meter: number;
    durasi_detik: number;
    kondisi_kemacetan: string;
    polyline: string | null;
  } | null;
}

export const fetchRecommendations = async (
  prompt: string,
  kategori: string,
  top_n: number = 3,
  userLocation: { lat: number; lng: number } = { lat: -6.9175, lng: 107.6191 },
  token?: string
): Promise<RecommendationResponse> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/api/recommendations`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      prompt,
      kategori,
      user_location: userLocation,
    }),
  });

  const data = await response.json();

  if (data.status === 'error') {
    throw new Error(data.message);
  }

  const rute = data.rute_dan_lalu_lintas;
  const distance_info = rute ? {
    distance_km: (rute.jarak_meter / 1000).toFixed(1),
    duration_mins: Math.round(rute.durasi_detik / 60),
    traffic_condition: rute.kondisi_kemacetan,
  } : null;

  const destinasi = data.destinasi;
  const mappedDestination: DestinationItem = {
    name: destinasi?.nama_tempat || '',
    rating: destinasi?.rating || null,
    category: kategori,
    address: '',
    total_reviews: null,
    google_maps_url: destinasi?.lokasi
      ? `https://www.google.com/maps?q=${destinasi.lokasi.lat},${destinasi.lokasi.lng}`
      : null,
    website: null,
    final_score: 0,
    distance_info,
  };

  return {
    status: data.status,
    reply: data.pesan_ai,
    raw_data: [mappedDestination],
    rute_dan_lalu_lintas: rute,
  };
};
