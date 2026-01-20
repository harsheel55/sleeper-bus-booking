const { Station } = require('../models');

exports.getStations = async (req, res) => {
    try {
        const stations = await Station.findAll({
            order: [['distanceFromSource', 'ASC']]
        });
        res.json(stations);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
