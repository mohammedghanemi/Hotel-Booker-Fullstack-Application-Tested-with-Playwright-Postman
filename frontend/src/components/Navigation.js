import React from 'react';
import '../App.css';

const Navigation = ({ currentView, onViewChange, isAuthenticated, onLogout, onCreateBooking, onLogin }) => {
  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h1>🏨 Hotel Booker</h1>
      </div>
      
      <div className="nav-links">
        <button 
          className={`nav-button ${currentView === 'bookings' ? 'active' : ''}`}
          onClick={() => onViewChange('bookings')}
        >
          All Bookings
        </button>
        
        <button 
          className={`nav-button ${currentView === 'create' ? 'active' : ''}`}
          onClick={onCreateBooking}
        >
          Create Booking
        </button>
        
        {isAuthenticated ? (
          <button 
            className="nav-button logout"
            onClick={onLogout}
          >
            Logout
          </button>
        ) : (
          <button 
            className="nav-button login"
            onClick={onLogin}
          >
            Admin Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;