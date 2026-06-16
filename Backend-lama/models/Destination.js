const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  nama_tempat: { type: String, required: true },
  kategori_tag: { type: [String], default: [] },
  deskripsi_aktivitas: { type: String },
  rating: { type: Number, default: 0 },
  lokasi: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  galeri_gambar: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Destination', destinationSchema);