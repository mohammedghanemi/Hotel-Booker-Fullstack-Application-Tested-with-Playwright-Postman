import React, { useState, useEffect } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import Auth from './components/Auth';
import BookingForm from './components/BookingForm';
import BookingList from './components/BookingList';
import BookingDetails from './components/BookingDetails';
import { getBookings, deleteBooking, updateBooking } from './services/api';

function App() {
  const [currentView, setCurrentView] = useState('bookings');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authAction, setAuthAction] = useState('');
  const [pageTransition, setPageTransition] = useState('');
  const [pendingAction, setPendingAction] = useState(null); // Store action to execute after login

  // Check for existing authentication on app start
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [currentView]);

  const handleViewChange = (newView) => {
    setPageTransition('fade-out');
    setTimeout(() => {
      setCurrentView(newView);
      setPageTransition('fade-in');
    }, 300);
  };

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      showNotification('Failed to load bookings. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
    
    // Execute pending action after login
    if (pendingAction) {
      const { type, booking, bookingId } = pendingAction;
      if (type === 'edit' && booking) {
        setSelectedBooking(booking);
        handleViewChange('edit');
      } else if (type === 'delete' && bookingId) {
        executeDeleteBooking(bookingId);
      }
      setPendingAction(null);
    }
    
    setAuthAction('');
    showNotification('Successfully logged in!', 'success');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    setSelectedBooking(null);
    setPendingAction(null);
    showNotification('Successfully logged out!', 'info');
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    handleViewChange('details');
  };

  const handleBackToList = () => {
    setSelectedBooking(null);
    handleViewChange('bookings');
  };

  const handleCreateBooking = () => {
    handleViewChange('create');
  };

  const handleBookingCreated = () => {
    handleViewChange('bookings');
    loadBookings();
    showNotification('Booking created successfully!', 'success');
  };

  const handleEditBooking = (booking) => {
    if (isAuthenticated) {
      setSelectedBooking(booking);
      handleViewChange('edit');
    } else {
      setSelectedBooking(booking);
      setAuthAction('edit');
      setPendingAction({ type: 'edit', booking });
      setShowAuthModal(true);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (isAuthenticated) {
      executeDeleteBooking(bookingId);
    } else {
      const booking = bookings.find(b => b.bookingid === bookingId);
      setSelectedBooking(booking);
      setAuthAction('delete');
      setPendingAction({ type: 'delete', bookingId });
      setShowAuthModal(true);
    }
  };

  // Actual delete execution
  const executeDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteBooking(bookingId);
        showNotification('Booking deleted successfully!', 'success');
        loadBookings();
        if (currentView === 'details') {
          handleViewChange('bookings');
        }
      } catch (error) {
        console.error('Delete error:', error);
        showNotification('Failed to delete booking: ' + (error.response?.data?.error || 'Unknown error'), 'error');
      }
    }
  };

  const handleUpdateBooking = async (bookingData) => {
    if (!isAuthenticated) {
      showNotification('Authentication required to update booking', 'error');
      return;
    }

    try {
      await updateBooking(selectedBooking.bookingid, bookingData);
      showNotification('Booking updated successfully!', 'success');
      handleViewChange('bookings');
      loadBookings();
    } catch (error) {
      console.error('Update error:', error);
      showNotification('Failed to update booking: ' + (error.response?.data?.error || 'Unknown error'), 'error');
    }
  };

  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${getNotificationIcon(type)}</span>
        <span class="notification-message">${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 4000);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '💡';
    }
  };

  const renderCurrentView = () => {
    const view = (() => {
      switch (currentView) {
        case 'create':
          return (
            <BookingForm 
              onBookingCreated={handleBookingCreated}
              onCancel={() => handleViewChange('bookings')}
            />
          );
        
        case 'edit':
          return (
            <BookingForm 
              booking={selectedBooking}
              onBookingCreated={handleUpdateBooking}
              onCancel={() => handleViewChange('details')}
              isEdit={true}
            />
          );
        
        case 'details':
          return (
            <BookingDetails 
              booking={selectedBooking}
              onBack={handleBackToList}
              onEdit={() => handleEditBooking(selectedBooking)}
              onDelete={() => handleDeleteBooking(selectedBooking.bookingid)}
              isAuthenticated={isAuthenticated}
            />
          );
        
        case 'bookings':
        default:
          return (
            <BookingList 
              bookings={bookings}
              loading={loading}
              onViewDetails={handleViewDetails}
              onEdit={handleEditBooking}
              onDelete={handleDeleteBooking}
              isAuthenticated={isAuthenticated}
              onLoginRequired={() => {
                setAuthAction('edit');
                setShowAuthModal(true);
              }}
            />
          );
      }
    })();

    return (
      <div className={`page-container ${pageTransition}`}>
        {view}
      </div>
    );
  };

  return (
    <div className="App">
      {/* Background Decoration */}
      <div className="background-decoration">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      <Navigation 
        currentView={currentView}
        onViewChange={handleViewChange}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onCreateBooking={handleCreateBooking}
        onLogin={() => {
          setAuthAction('');
          setShowAuthModal(true);
        }}
      />
      
      <main className="main-content">
        {renderCurrentView()}
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-decoration"></div>
            <Auth 
              onLogin={handleLogin}
              onCancel={() => {
                setShowAuthModal(false);
                setAuthAction('');
                setSelectedBooking(null);
                setPendingAction(null);
              }}
              action={authAction}
            />
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && currentView === 'bookings' && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner-large"></div>
            <p>Loading your bookings...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;