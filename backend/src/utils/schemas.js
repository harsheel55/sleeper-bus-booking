const Joi = require('joi');

const bookingSchema = Joi.object({
    fromStation: Joi.string().required(),
    toStation: Joi.string().required(),
    journeyDate: Joi.date().iso().required(),
    seatIds: Joi.array().items(Joi.number().integer().min(1).max(40)).min(1).required(),
    passenger: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().pattern(/^[0-9+]+$/).required(),
        age: Joi.number().integer().min(1).max(120),
        gender: Joi.string().valid('male', 'female', 'other')
    }).required(),
    meals: Joi.array().items(Joi.object({
        mealId: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        deliveryStation: Joi.string().required()
    })).optional()
});

const validateBody = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = {
    bookingSchema,
    validateBody
};
