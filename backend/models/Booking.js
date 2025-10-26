class Booking {
  constructor(bookingData) {
    this.bookingid = bookingData.bookingid;
    this.firstname = bookingData.firstname;
    this.lastname = bookingData.lastname;
    this.totalprice = bookingData.totalprice;
    this.depositpaid = bookingData.depositpaid;
    this.bookingdates = bookingData.bookingdates;
    this.additionalneeds = bookingData.additionalneeds;
    this.createdAt = bookingData.createdAt || new Date();
    this.updatedAt = bookingData.updatedAt;
  }

  validate() {
    const errors = [];
    
    if (!this.firstname || this.firstname.trim().length === 0) {
      errors.push('First name is required');
    }
    
    if (!this.lastname || this.lastname.trim().length === 0) {
      errors.push('Last name is required');
    }
    
    if (this.totalprice === undefined || this.totalprice === null || this.totalprice < 0) {
      errors.push('Valid total price is required');
    }
    
    if (this.depositpaid === undefined || this.depositpaid === null) {
      errors.push('Deposit paid status is required');
    }
    
    if (!this.bookingdates || !this.bookingdates.checkin || !this.bookingdates.checkout) {
      errors.push('Both checkin and checkout dates are required');
    }
    
    return errors;
  }
}

module.exports = Booking;