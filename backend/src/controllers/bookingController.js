const { Booking, BookingSeat, BookingMeal, Seat, Station, Meal, sequelize } = require('../models');
const { v4: uuidv4 } = require('uuid');

exports.createBooking = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const {
            passenger,
            seatIds, // Array of seatNumbers
            fromStation,
            toStation,
            journeyDate,
            meals
        } = req.body;

        // Validate inputs
        if (!passenger || !seatIds || !fromStation || !toStation || !journeyDate) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // 1. Availability Check (Strict Locking)
        const stations = await Station.findAll({ transaction });
        const distMap = {};
        stations.forEach(s => distMap[s.id] = s.distanceFromSource);

        const reqStart = distMap[fromStation];
        const reqEnd = distMap[toStation];

        if (reqStart === undefined || reqEnd === undefined || reqStart >= reqEnd) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid route' });
        }

        // Check each seat
        for (const seatNum of seatIds) {
            // Find overlapping bookings for this seat and date
            const existing = await BookingSeat.findAll({
                where: { seatNumber: seatNum },
                include: [{
                    model: Booking,
                    where: { bookingDate: journeyDate, status: 'confirmed' }
                }],
                transaction
            });

            for (const item of existing) {
                const bookedStart = distMap[item.fromStationId];
                const bookedEnd = distMap[item.toStationId];
                if (reqStart < bookedEnd && reqEnd > bookedStart) {
                    await transaction.rollback();
                    return res.status(409).json({ error: `Seat ${seatNum} is no longer available` });
                }
            }
        }

        // 2. Calculate Fare
        const distance = reqEnd - reqStart;
        const basePrice = Math.round(distance * 0.8);
        const seatTotal = basePrice * seatIds.length;
        let mealTotal = 0;

        // 3. Create Booking Record
        const booking = await Booking.create({
            pnr: 'PNR' + uuidv4().substr(0, 8).toUpperCase(),
            customerName: passenger.name,
            customerEmail: passenger.email,
            customerPhone: passenger.phone,
            bookingDate: journeyDate,
            status: 'confirmed',
            totalAmount: 0 // Update later
        }, { transaction });

        // 4. Create BookingSeats
        const bookingSeats = seatIds.map(seatNum => ({
            bookingId: booking.id,
            seatNumber: seatNum,
            fromStationId: fromStation,
            toStationId: toStation,
            price: basePrice,
            passengerName: passenger.name, // Simplified: assuming same passenger or one name for group
            passengerAge: passenger.age,
            passengerGender: passenger.gender
        }));
        await BookingSeat.bulkCreate(bookingSeats, { transaction });

        // 5. Create BookingMeals
        if (meals && meals.length > 0) {
            for (const m of meals) {
                const mealData = await Meal.findByPk(m.mealId, { transaction });
                if (mealData) {
                    const cost = mealData.price * m.quantity;
                    mealTotal += cost;
                    await BookingMeal.create({
                        bookingId: booking.id,
                        mealId: m.mealId,
                        quantity: m.quantity,
                        deliveryStationId: m.deliveryStation // e.g., 'ST002'
                    }, { transaction });
                }
            }
        }

        // Update total
        booking.totalAmount = seatTotal + mealTotal;
        await booking.save({ transaction });

        await transaction.commit();

        res.status(201).json({
            success: true,
            bookingId: booking.id,
            pnr: booking.pnr,
            totalAmount: booking.totalAmount
        });

    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).json({ error: 'Booking failed' });
    }
};

exports.getBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findByPk(id, {
            include: [BookingSeat, BookingMeal]
        });
        if (!booking) return res.status(404).json({ error: 'Not found' });
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findByPk(id);
        if (!booking) return res.status(404).json({ error: 'Not found' });

        booking.status = 'cancelled';
        await booking.save();
        res.json({ success: true, message: 'Cancelled' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
