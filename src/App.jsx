import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import './index.css';

// Function to check backend health
const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/health`);
    const data = await response.json();
    return data.success; // true if backend is running
  } catch (error) {
    console.error('Backend not reachable:', error);
    return false;
  }
};

function App() {
  useEffect(() => {
    const verifyBackend = async () => {
      const isBackendUp = await checkBackendHealth();
      if (isBackendUp) {
        alert('Backend deployed successfully!');
      } else {
        alert('Backend not reachable. Check Vercel deployment.');
      }
    };

    verifyBackend();
  }, []);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/register" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
