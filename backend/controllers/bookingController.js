// Get all bookings with optional filtering
const getAllBookings = async (req, res) => {
  try {
    const { firstname, lastname, checkin, checkout } = req.query;
    
    const filter = {};
    
    // Apply filters
    if (firstname) {
      filter.firstname = { $regex: firstname, $options: 'i' };
    }
    
    if (lastname) {
      filter.lastname = { $regex: lastname, $options: 'i' };
    }
    
    if (checkin) {
      filter['bookingdates.checkin'] = { $gte: checkin };
    }
    
    if (checkout) {
      filter['bookingdates.checkout'] = { $gte: checkout };
    }
    
    const bookings = await req.db.getCollection('bookings')
      .find(filter)
      .project({ bookingid: 1 })
      .toArray();
    
    res.json(bookings);
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// Get single booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await req.db.getCollection('bookings').findOne({
      bookingid: parseInt(req.params.id)
    });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

// Create new booking
const createBooking = async (req, res) => {
  try {
    const { firstname, lastname, totalprice, depositpaid, bookingdates, additionalneeds } = req.body;
    
    // Validation
    if (!firstname || !lastname || totalprice === undefined || depositpaid === undefined || !bookingdates) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (!bookingdates.checkin || !bookingdates.checkout) {
      return res.status(400).json({ error: 'Checkin and checkout dates are required' });
    }
    
    // Get next booking ID
    const lastBooking = await req.db.getCollection('bookings')
      .find()
      .sort({ bookingid: -1 })
      .limit(1)
      .toArray();
    
    const nextId = lastBooking.length > 0 ? lastBooking[0].bookingid + 1 : 1;
    
    const newBooking = {
      bookingid: nextId,
      firstname: firstname.toString(),
      lastname: lastname.toString(),
      totalprice: parseInt(totalprice),
      depositpaid: Boolean(depositpaid),
      bookingdates: {
        checkin: bookingdates.checkin,
        checkout: bookingdates.checkout
      },
      additionalneeds: additionalneeds?.toString() || '',
      createdAt: new Date()
    };
    
    // Save to MongoDB
    const result = await req.db.getCollection('bookings').insertOne(newBooking);
    
    res.json({
      bookingid: newBooking.bookingid,
      booking: newBooking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// Update booking (PUT - full update)
const updateBooking = async (req, res) => {
  try {
    const { firstname, lastname, totalprice, depositpaid, bookingdates, additionalneeds } = req.body;
    
    // Full update - all fields required
    if (!firstname || !lastname || totalprice === undefined || depositpaid === undefined || !bookingdates) {
      return res.status(400).json({ error: 'All fields are required for PUT' });
    }
    
    const updatedBooking = {
      firstname: firstname.toString(),
      lastname: lastname.toString(),
      totalprice: parseInt(totalprice),
      depositpaid: Boolean(depositpaid),
      bookingdates: {
        checkin: bookingdates.checkin,
        checkout: bookingdates.checkout
      },
      additionalneeds: additionalneeds?.toString() || '',
      updatedAt: new Date()
    };
    
    const result = await req.db.getCollection('bookings').findOneAndUpdate(
      { bookingid: parseInt(req.params.id) },
      { $set: updatedBooking },
      { returnDocument: 'after' }
    );
    
    if (!result.value) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(result.value);
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
};

// Partial update booking (PATCH)
const partialUpdateBooking = async (req, res) => {
  try {
    const updates = {
      ...req.body,
      updatedAt: new Date()
    };
    
    // Handle nested bookingdates updates
    if (req.body.bookingdates) {
      updates.$set = {
        'bookingdates.checkin': req.body.bookingdates.checkin,
        'bookingdates.checkout': req.body.bookingdates.checkout
      };
      delete updates.bookingdates;
    }
    
    const result = await req.db.getCollection('bookings').findOneAndUpdate(
      { bookingid: parseInt(req.params.id) },
      { $set: updates },
      { returnDocument: 'after' }
    );
    
    if (!result.value) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(result.value);
  } catch (error) {
    console.error('Partial update booking error:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
};

// Delete booking
const deleteBooking = async (req, res) => {
  try {
    const result = await req.db.getCollection('bookings').deleteOne({
      bookingid: parseInt(req.params.id)
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.status(201).send('Created');
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  partialUpdateBooking,
  deleteBooking
};