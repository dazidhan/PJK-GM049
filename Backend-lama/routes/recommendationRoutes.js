const express = require('express');
const { body } = require('express-validator');
const { getRecommendation } = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post('/', protect, [
    body('prompt').notEmpty().withMessage('Prompt wajib diisi').isString(),
    body('kategori').notEmpty().withMessage('Kategori wajib diisi').isString(),
    body('user_location').notEmpty().withMessage('Lokasi user wajib diisi'),
    body('user_location.lat').isFloat().withMessage('Latitude tidak valid'),
    body('user_location.lng').isFloat().withMessage('Longitude tidak valid')
], validateRequest, getRecommendation);

module.exports = router;