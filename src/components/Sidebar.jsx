import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ setActiveView, activeView }) => {
  const navigate = useNavigate();

  const handleNavigation = (view) => {
    setActiveView(view);
    if (view === 'dashboard') {
      navigate('/dashboard');
    } else if (view === 'register') {
      navigate('/register');
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        <button
          className={`sidebar-item ${activeView === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleNavigation('dashboard')}
        >
          Dashboard Overview
        </button>
        <button
          className={`sidebar-item ${activeView === 'register' ? 'active' : ''}`}
          onClick={() => handleNavigation('register')}
        >
          Patient Registration
        </button>
      </div>
    </div>
  );
};

export default Sidebar;