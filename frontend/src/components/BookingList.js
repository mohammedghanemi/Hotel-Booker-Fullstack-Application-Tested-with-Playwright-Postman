import React from 'react';
import '../App.css';

const BookingList = ({ bookings, loading, onViewDetails, onEdit, onDelete, isAuthenticated, onLoginRequired }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading bookings...</p>
      </div>
    );
  }

  const handleEditClick = (booking, e) => {
    e.stopPropagation();
    if (isAuthenticated) {
      onEdit(booking);
    } else {
      onLoginRequired();
    }
  };

  const handleDeleteClick = (booking, e) => {
    e.stopPropagation();
    if (isAuthenticated) {
      onDelete(booking.bookingid);
    } else {
      onLoginRequired();
    }
  };

  return (
    <div className="booking-list-container">
      <div className="booking-list-header">
        <h2>All Bookings ({bookings.length})</h2>
        <div className="access-info">
          <p>✅ <strong>Public Access:</strong> View all bookings and create new bookings</p>
          <p>🔒 <strong>Admin Required:</strong> Edit or delete existing bookings</p>
          {!isAuthenticated && (
            <p className="auth-prompt">Login as admin to manage bookings</p>
          )}
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>No bookings found.</p>
          <p>Create your first booking to get started!</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div key={booking.bookingid} className="booking-card">
              <div className="booking-card-header">
                <h3>{booking.firstname} {booking.lastname}</h3>
                <span className="booking-id">ID: {booking.bookingid}</span>
              </div>
              
              <div className="booking-card-details">
                <div className="detail-row">
                  <span className="label">Total Price:</span>
                  <span className="value">${booking.totalprice}</span>
                </div>
                
                <div className="detail-row">
                  <span className="label">Deposit Paid:</span>
                  <span className="value">{booking.depositpaid ? 'Yes' : 'No'}</span>
                </div>
                
                <div className="detail-row">
                  <span className="label">Check-in:</span>
                  <span className="value">{booking.bookingdates?.checkin}</span>
                </div>
                
                <div className="detail-row">
                  <span className="label">Check-out:</span>
                  <span className="value">{booking.bookingdates?.checkout}</span>
                </div>
                
                {booking.additionalneeds && (
                  <div className="detail-row">
                    <span className="label">Additional Needs:</span>
                    <span className="value">{booking.additionalneeds}</span>
                  </div>
                )}
              </div>

              <div className="booking-card-actions">
                <button 
                  className="view-details-button"
                  onClick={() => onViewDetails(booking)}
                >
                  View Details
                </button>
                
                <div className="admin-actions">
                  <button 
                    className="edit-button"
                    onClick={(e) => handleEditClick(booking, e)}
                    title={isAuthenticated ? "Edit booking" : "Login to edit"}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-button"
                    onClick={(e) => handleDeleteClick(booking, e)}
                    title={isAuthenticated ? "Delete booking" : "Login to delete"}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingList;