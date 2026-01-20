const { Meal } = require('../models');

exports.getMeals = async (req, res) => {
    try {
        const meals = await Meal.findAll();
        res.json(meals);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
