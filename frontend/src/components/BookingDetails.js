import React, { useState } from 'react';
import '../App.css';

const BookingDetails = ({ booking, onBack, onEdit, onDelete, isAuthenticated }) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  if (!booking) {
    return (
      <div className="booking-details-container">
        <div className="error-state">
          <p>No booking data available.</p>
          <button onClick={onBack} className="back-button">
            Back to List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-details-container">
      <div className="booking-details-header">
        <h2>Booking Details</h2>
        <div className="header-actions">
          <button 
            onClick={handleRefresh}
            className="refresh-button"
            disabled={refreshing}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button onClick={onBack} className="back-button">
            Back to List
          </button>
        </div>
      </div>

      <div className="booking-details-card">
        <div className="detail-section">
          <h3>Guest Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Booking ID:</span>
              <span className="detail-value">{booking.bookingid}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">First Name:</span>
              <span className="detail-value">{booking.firstname}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Last Name:</span>
              <span className="detail-value">{booking.lastname}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Booking Details</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Total Price:</span>
              <span className="detail-value">${booking.totalprice}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Deposit Paid:</span>
              <span className="detail-value">
                {booking.depositpaid ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Stay Dates</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Check-in:</span>
              <span className="detail-value">{booking.bookingdates?.checkin}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Check-out:</span>
              <span className="detail-value">{booking.bookingdates?.checkout}</span>
            </div>
          </div>
        </div>

        {booking.additionalneeds && (
          <div className="detail-section">
            <h3>Additional Information</h3>
            <div className="detail-item full-width">
              <span className="detail-label">Additional Needs:</span>
              <span className="detail-value">{booking.additionalneeds}</span>
            </div>
          </div>
        )}
      </div>

      <div className="booking-details-actions">
        {isAuthenticated ? (
          <>
            <button 
              onClick={onEdit}
              className="edit-button"
            >
              Edit Booking
            </button>
            <button 
              onClick={onDelete}
              className="delete-button"
            >
              Delete Booking
            </button>
          </>
        ) : (
          <div className="auth-required-note">
            <p>🔒 Admin login required to edit or delete this booking</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetails;