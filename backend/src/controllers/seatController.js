const { Seat, BookingSeat, Station, Booking, sequelize } = require('../models');

exports.getSeats = async (req, res) => {
    try {
        const { fromStation, toStation, date } = req.query;

        if (!fromStation || !toStation || !date) {
            return res.status(400).json({ error: 'fromStation, toStation, and date are required' });
        }

        // Get station distances to compare ranges
        const stations = await Station.findAll();
        const startStation = stations.find(s => s.id === fromStation);
        const endStation = stations.find(s => s.id === toStation);

        if (!startStation || !endStation) {
            return res.status(400).json({ error: 'Invalid stations' });
        }

        // Ensure valid direction
        const reqStart = startStation.distanceFromSource;
        const reqEnd = endStation.distanceFromSource;

        if (reqStart >= reqEnd) {
            return res.status(400).json({ error: 'Invalid route direction' });
        }

        // Fetch all seats and their active bookings for the date
        const seats = await Seat.findAll({
            include: [{
                model: BookingSeat,
                required: false,
                include: [{
                    model: Booking,
                    where: {
                        status: 'confirmed',
                        bookingDate: date
                    },
                    required: true
                }]
            }]
        });

        // Map stations for fast lookup of distances
        const distMap = {};
        stations.forEach(s => distMap[s.id] = s.distanceFromSource);

        const seatStatus = seats.map(seat => {
            let isAvailable = true;

            // Check overlaps
            if (seat.BookingSeats && seat.BookingSeats.length > 0) {
                for (const bookingItem of seat.BookingSeats) {
                    const bookedStart = distMap[bookingItem.fromStationId];
                    const bookedEnd = distMap[bookingItem.toStationId];

                    // Overlap logic: (StartA < EndB) && (EndA > StartB)
                    // A = Request, B = Existing
                    if (reqStart < bookedEnd && reqEnd > bookedStart) {
                        isAvailable = false;
                        break;
                    }
                }
            }

            return {
                seatNumber: seat.seatNumber,
                type: seat.type,
                isLadies: seat.isLadies,
                available: isAvailable,
                price: Math.round((reqEnd - reqStart) * 0.8) // Rs 0.8 per km
            };
        });

        res.json(seatStatus);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
