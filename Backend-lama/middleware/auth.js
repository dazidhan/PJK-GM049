const jwt = require('jsonwebtoken');

// Middleware protect: verifikasi JWT, tapi opsional (guest tetap bisa lewat)
const protect = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // Jika tidak ada token, lanjutkan sebagai guest (req.user = null)
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, ... }
  } catch (err) {
    // Token invalid/expired -> tetap anggap guest, jangan blokir
    req.user = null;
  }

  next();
};

// Middleware requireAuth: untuk endpoint yang wajib login
const requireAuth = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Token tidak ditemukan, akses ditolak' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'Token tidak valid atau sudah expired' });
  }
};

module.exports = { protect, requireAuth };