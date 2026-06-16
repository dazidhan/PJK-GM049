const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Cari user berdasarkan googleId
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            // Jika belum ada, cek juga berdasarkan email (akun lama yang daftar manual)
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                // Hubungkan akun lama dengan googleId
                user.googleId = profile.id;
                await user.save();
            } else {
                // Buat user baru
                user = await User.create({
                    nama: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id
                });
            }
        }

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

// Tidak menggunakan session, jadi serialize/deserialize tidak terlalu krusial
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

module.exports = passport;