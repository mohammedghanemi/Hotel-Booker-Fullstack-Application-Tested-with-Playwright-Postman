const validateBooking = (req, res, next) => {
  const { firstname, lastname, totalprice, depositpaid, bookingdates } = req.body;
  
  const errors = [];
  
  if (!firstname || firstname.trim().length === 0) {
    errors.push('First name is required');
  }
  
  if (!lastname || lastname.trim().length === 0) {
    errors.push('Last name is required');
  }
  
  if (totalprice === undefined || totalprice === null) {
    errors.push('Total price is required');
  } else if (isNaN(totalprice) || totalprice < 0) {
    errors.push('Total price must be a positive number');
  }
  
  if (depositpaid === undefined || depositpaid === null) {
    errors.push('Deposit paid status is required');
  }
  
  if (!bookingdates) {
    errors.push('Booking dates are required');
  } else {
    if (!bookingdates.checkin) {
      errors.push('Checkin date is required');
    }
    if (!bookingdates.checkout) {
      errors.push('Checkout date is required');
    }
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors 
    });
  }
  
  next();
};

module.exports = {
  validateBooking
};