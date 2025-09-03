import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Register from './Register';

const Home = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'register':
        return <Register />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="home-container">
      <Navbar />
      <div className="main-content">
        <Sidebar setActiveView={setActiveView} activeView={activeView} />
        <div className="content-area">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Home;