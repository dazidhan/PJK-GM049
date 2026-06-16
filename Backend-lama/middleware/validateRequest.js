const { validationResult } = require('express-validator');

// Middleware untuk menangani hasil validasi express-validator
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: errors.array().map(e => e.msg).join(', ')
        });
    }

    next();
};

module.exports = validateRequest;