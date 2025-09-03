import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/dashboard');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={handleHomeClick}>
          Hospital Management System
        </div>
      </div>
    </nav>
  );
};

export default Navbar;