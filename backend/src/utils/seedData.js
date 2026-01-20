const { sequelize, Station, Seat, Meal } = require('../models');

async function seedData() {
    await sequelize.sync({ force: true }); // Reset DB

    // Stations
    await Station.bulkCreate([
        { id: 'ST001', name: 'Ahmedabad', distance: 0, departureTime: '22:00' },
        { id: 'ST002', name: 'Vadodara', distance: 110, arrivalTime: '00:30', departureTime: '00:45' },
        { id: 'ST003', name: 'Surat', distance: 260, arrivalTime: '03:00', departureTime: '03:15' },
        { id: 'ST004', name: 'Mumbai', distance: 530, arrivalTime: '07:00' }
    ]);

    // Seats (40 seats)
    const seats = [];
    for (let i = 1; i <= 40; i++) {
        // 1-20 Lower, 21-40 Upper for simplicity or mixed.
        // Let's do mixed patterns often found: 1L, 2U, 3L...
        // Pattern: 1,2,3...
        // Type: Lower, Upper, Lower ?
        // Let's assume 1-20 Lower, 21-40 Upper.
        // Or per row.
        // Let's stick to the prompt's layout hint or just simple 1-40.
        const isLower = i <= 20;
        seats.push({
            seatNumber: i,
            type: isLower ? 'lower' : 'upper',
            isLadies: i % 10 === 0 // Example ladies seats
        });
    }
    await Seat.bulkCreate(seats);

    // Meals
    await Meal.bulkCreate([
        { id: 'M001', name: 'Veg Thali', type: 'veg', price: 150 },
        { id: 'M002', name: 'Paneer Combo', type: 'veg', price: 180 },
        { id: 'M003', name: 'Chicken Biryani', type: 'non-veg', price: 220 },
        { id: 'M004', name: 'Jain Thali', type: 'jain', price: 160 }
    ]);

    console.log('Database seeded successfully');
}

module.exports = seedData;
