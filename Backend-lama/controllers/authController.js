const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Helper untuk generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, nama: user.nama },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// REGISTER (Email/Password)
exports.register = async (req, res) => {
  try {
    const { nama, email, password } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'Nama, email, dan password wajib diisi' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Email sudah terdaftar' });
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      nama,
      email,
      password: hashedPassword
    });

    const token = generateToken(user);

    return res.status(201).json({
      status: 'success',
      message: 'Registrasi berhasil',
      data: {
        token,
        user: { id: user._id, nama: user.nama, email: user.email }
      }
    });
  } catch (err) {
    console.error('Register Error:', err.message);
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' });
  }
};

// LOGIN (Email/Password)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email dan password wajib diisi' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ status: 'error', message: 'Email atau password salah' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Email atau password salah' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      status: 'success',
      message: 'Login berhasil',
      data: {
        token,
        user: { id: user._id, nama: user.nama, email: user.email }
      }
    });
  } catch (err) {
    console.error('Login Error:', err.message);
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' });
  }
};

// GOOGLE OAUTH CALLBACK
exports.googleCallback = async (req, res) => {
  try {
    // req.user sudah berisi data user dari passport strategy
    const user = req.user;
    const token = generateToken(user);

    // Redirect ke frontend dengan menyisipkan token di query string
    const redirectUrl = `${process.env.CLIENT_URL}/auth/callback?token=${token}`;
    return res.redirect(redirectUrl);
  } catch (err) {
    console.error('Google Callback Error:', err.message);
    return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
  }
};

// GET PROFILE (contoh endpoint protected)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User tidak ditemukan' });
    }
    return res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    console.error('Get Profile Error:', err.message);
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' });
  }
};