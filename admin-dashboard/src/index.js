import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import axios from 'axios';
import './index.css';  // Add styles or Tailwind import here if used

// Base backend URL
axios.defaults.baseURL = 'http://localhost:3001';

// Attach token if present
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
