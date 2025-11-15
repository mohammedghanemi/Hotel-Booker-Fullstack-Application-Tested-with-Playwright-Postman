import React, { useState } from 'react';
import { login } from '../services/api';
import '../App.css';

const Auth = ({ onLogin, onCancel, action = '' }) => {
  const [credentials, setCredentials] = useState({
    username: 'admin',
    password: 'password123'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(credentials.username, credentials.password);
      
      if (result.token) {
        localStorage.setItem('authToken', result.token);
        onLogin();
      } else {
        setError(result.reason || 'Login failed');
      }
    } catch (error) {
      setError(error.response?.data?.reason || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const getActionText = () => {
    switch (action) {
      case 'edit':
        return 'edit bookings';
      case 'delete':
        return 'delete bookings';
      default:
        return 'access admin features';
    }
  };

  return (
    <div className="auth-modal">
      <div className="auth-modal-header">
        <h2>Admin Login Required</h2>
        <p>Please login to {getActionText()}</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="auth-modal-actions">
          <button 
            type="button" 
            className="cancel-button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
      
      <div className="auth-note">
        <p>Default admin credentials are pre-filled.</p>
      </div>
    </div>
  );
};

export default Auth;