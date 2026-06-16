# 🛠️ Panduan Instalasi & Setup JabarUlin AI

Dokumen ini menyediakan panduan langkah demi langkah untuk menginstal, mengonfigurasi, dan menjalankan seluruh ekosistem JabarUlin AI di komputer lokal Anda.

---

## 📋 Prasyarat Sistem

Sebelum memulai instalasi, pastikan sistem Anda telah memiliki perangkat lunak berikut:

* **Git**: Untuk mengkloning repositori proyek.
* **Node.js (v18.0.0 ke atas)** dan **npm**: Untuk menjalankan Backend (Express) dan Frontend (Next.js).
* **Python (v3.9 atau v3.10)**: Untuk menjalankan AI Engine (FastAPI).
* **Docker Desktop** *(Opsional but Recommended)*: Jika Anda ingin menjalankan seluruh service secara instan dalam container terisolasi.

---

## 🔑 Langkah 1: Persiapan Awal & Pengaturan `.env`

1. Kloning repositori proyek ini ke lokal:
   ```bash
   git clone https://github.com/anandanovianshaf/PJK-GM049.git
   cd PJK-GM049
   ```

2. Buat file `.env` di dalam folder `Backend/` dengan menyalin file template yang sudah disediakan:
   - Di terminal (atau via File Explorer):
     ```bash
     cp Backend/.env.example Backend/.env
     ```

3. Buka file `Backend/.env` dan konfigurasikan variabel lingkungan berikut:
   ```env
   # API Key wajib dari Google AI Studio (untuk Gemini LLM)
   GEMINI_API_KEY=AIzaSy...

   # Token opsional jika Hugging Face repository bersifat private
   HF_TOKEN=hf_...
   ```
   > 💡 Anda bisa mendapatkan API Key Gemini secara gratis melalui [Google AI Studio](https://aistudio.google.com/).

---

## 🐳 OPSI 1: Menjalankan via Docker Compose (Direkomendasikan)

Jika Anda memiliki Docker Desktop, Anda dapat mengaktifkan seluruh sistem (Frontend, Backend, dan AI FastAPI) hanya dengan satu perintah:

1. Di direktori utama (root directory), jalankan perintah:
   ```bash
   docker compose up --build
   ```
   *(atau `docker-compose up --build` untuk versi Docker lama).*

2. **Proses Awal:** 
   Docker akan mengunduh image yang diperlukan, mengompilasi dependensi, dan otomatis mengunduh weights model IndoBERT (~500MB) langsung dari Hugging Face Hub saat container `model_ai` menyala pertama kali.
   
3. Setelah proses selesai, ketiga layanan akan berjalan di:
   - **Frontend (Next.js):** [http://localhost:3000](http://localhost:3000)
   - **Backend API (Node.js):** [http://localhost:5000](http://localhost:5000)
   - **AI API (FastAPI):** [http://localhost:8000](http://localhost:8000)

---

## 💻 OPSI 2: Menjalankan Secara Manual (Lokal Tanpa Docker)

Jika Anda ingin menjalankan atau memodifikasi kode secara langsung di tingkat lokal, jalankan ketiga layanan di terminal terpisah sesuai langkah berikut:

### Terminal 1: AI Service (Python FastAPI)

1. Masuk ke direktori `Model_AI`:
   ```bash
   cd Model_AI
   ```

2. Buat dan aktifkan virtual environment (sangat direkomendasikan):
   - **Windows:**
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```
   - **macOS / Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Instal semua dependensi Python:
   ```bash
   pip install -r requirements.txt
   ```

4. Jalankan AI Service:
   ```bash
   python app.py
   ```
   AI Engine akan berjalan di port **8000** (`http://localhost:8000`). Pada eksekusi pertama, script akan otomatis mendownload file weights model IndoBERT secara dinamis dari Hugging Face Hub.

---

### Terminal 2: Backend Service (Node.js)

1. Buka terminal baru dan masuk ke direktori `Backend`:
   ```bash
   cd Backend
   ```

2. Instal dependensi Node.js:
   ```bash
   npm install
   ```

3. Jalankan server backend:
   ```bash
   npm start
   ```
   Layanan Backend akan berjalan di port **5000** (`http://localhost:5000`).

---

### Terminal 3: Frontend Service (Next.js & TypeScript)

1. Buka terminal ketiga dan masuk ke direktori `jabarulin-frontend`:
   ```bash
   cd jabarulin-frontend
   ```

2. Instal dependensi frontend:
   ```bash
   npm install
   ```

3. Jalankan server dev Next.js:
   ```bash
   npm run dev
   ```
   Aplikasi Frontend akan berjalan di port **3000** (`http://localhost:3000`).

---

## 🔍 Langkah 3: Verifikasi Sistem

Untuk memastikan seluruh layanan telah berjalan dan terhubung dengan benar, lakukan pemeriksaan berikut:
1. Buka web browser Anda dan akses **[http://localhost:3000](http://localhost:3000)**. Anda harusnya dapat melihat halaman Beranda JabarUlin AI beserta popup onboarding guide.
2. Cek status koneksi AI Service dengan membuka Swagger UI di **[http://localhost:8000/docs](http://localhost:8000/docs)**.
3. Lakukan pencarian rekomendasi pada menu Chat di UI Frontend untuk memastikan bahwa Next.js berhasil berkomunikasi dengan Node.js Backend (port 5000), yang kemudian diteruskan ke FastAPI AI Engine (port 8000) dan Gemini LLM.
