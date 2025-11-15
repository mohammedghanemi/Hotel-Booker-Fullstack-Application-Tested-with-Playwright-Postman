import React, { useState, useEffect } from 'react';
import { createBooking, updateBooking } from '../services/api';
import '../App.css';

const BookingForm = ({ onBookingCreated, onCancel, booking, isEdit = false }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    totalprice: '',
    depositpaid: false,
    bookingdates: {
      checkin: '',
      checkout: ''
    },
    additionalneeds: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill form if in edit mode
  useEffect(() => {
    if (isEdit && booking) {
      setFormData({
        firstname: booking.firstname || '',
        lastname: booking.lastname || '',
        totalprice: booking.totalprice || '',
        depositpaid: booking.depositpaid || false,
        bookingdates: {
          checkin: booking.bookingdates?.checkin || '',
          checkout: booking.bookingdates?.checkout || ''
        },
        additionalneeds: booking.additionalneeds || ''
      });
    }
  }, [isEdit, booking]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.firstname || !formData.lastname || !formData.totalprice) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      const bookingData = {
        ...formData,
        totalprice: parseInt(formData.totalprice),
        depositpaid: Boolean(formData.depositpaid)
      };

      if (isEdit) {
        // Call parent's update function
        onBookingCreated(bookingData);
      } else {
        const result = await createBooking(bookingData);
        if (result.bookingid) {
          onBookingCreated();
        } else {
          setError('Failed to create booking');
        }
      }
    } catch (error) {
      setError(error.response?.data?.error || `Failed to ${isEdit ? 'update' : 'create'} booking`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('bookingdates.')) {
      const dateField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        bookingdates: {
          ...prev.bookingdates,
          [dateField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  return (
    <div className="booking-form-container">
      <h2>{isEdit ? 'Edit Booking' : 'Create New Booking'}</h2>
      
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstname">First Name *</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="lastname">Last Name *</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="totalprice">Total Price *</label>
          <input
            type="number"
            id="totalprice"
            name="totalprice"
            value={formData.totalprice}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="depositpaid"
              checked={formData.depositpaid}
              onChange={handleChange}
            />
            Deposit Paid
          </label>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="checkin">Check-in Date *</label>
            <input
              type="date"
              id="checkin"
              name="bookingdates.checkin"
              value={formData.bookingdates.checkin}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="checkout">Check-out Date *</label>
            <input
              type="date"
              id="checkout"
              name="bookingdates.checkout"
              value={formData.bookingdates.checkout}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="additionalneeds">Additional Needs</label>
          <input
            type="text"
            id="additionalneeds"
            name="additionalneeds"
            value={formData.additionalneeds}
            onChange={handleChange}
            placeholder="Any special requirements..."
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Booking' : 'Create Booking')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;