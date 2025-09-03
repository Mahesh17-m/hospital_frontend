import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Register = () => {
  const [formData, setFormData] = useState({
    ipNumber: '',
    serialNumber: '',
    patientName: '',
    age: '',
    place: '',
    phoneNumber: '',
    referral: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    generateAutomaticFields();
  }, []);

  const getDateString = () => {
    const now = new Date();
    return now.toISOString().slice(0, 10).replace(/-/g, '');
  };

  const generateAutomaticFields = async () => {
    try {
      const dateString = getDateString();
      const ipNumber = `IP${dateString}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      
      try {
        const response = await axios.get(`${API_BASE_URL}/patients/today-count`);
        const dailyCount = response.data.count || 0;
        const nextSerial = dailyCount + 1;
        const serialNumber = `SN${dateString}-${nextSerial.toString().padStart(3, '0')}`;
        
        setFormData(prev => ({
          ...prev,
          ipNumber,
          serialNumber
        }));
      } catch (error) {
        const storedDate = localStorage.getItem('serialCountDate');
        const storedCount = localStorage.getItem('serialCount');
        
        let nextSerial = 1; 
        if (storedDate === dateString && storedCount) {
          nextSerial = parseInt(storedCount) + 1;
        } else {
          localStorage.setItem('serialCountDate', dateString);
          localStorage.setItem('serialCount', '0');
        }
        
        const serialNumber = `SN${dateString}-${nextSerial.toString().padStart(3, '0')}`;
        
        setFormData(prev => ({
          ...prev,
          ipNumber,
          serialNumber
        }));
      }
    } catch (error) {
      console.error('Error generating fields:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.patientName || !formData.age || !formData.place) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.post(`${API_BASE_URL}/patients/register`, formData);
      
      if (response.data.success) {
        setSuccess('Patient registered successfully!');
        
        const dateString = getDateString();
        const storedDate = localStorage.getItem('serialCountDate');
        let currentCount = 0;
        
        if (storedDate === dateString) {
          currentCount = parseInt(localStorage.getItem('serialCount') || '0');
        }
        
        localStorage.setItem('serialCountDate', dateString);
        localStorage.setItem('serialCount', (currentCount + 1).toString());
        
        setFormData(prev => ({
          ...prev,
          patientName: '',
          age: '',
          place: '',
          phoneNumber: '',
          referral: ''
        }));
        
        generateAutomaticFields();
      } else {
        setError(response.data.message || 'Failed to register patient');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.message) {
        if (error.response.data.message.includes('serial number')) {
          generateAutomaticFields();
          setError('Serial number conflict. Please try registering again.');
        } else {
          setError(error.response.data.message);
        }
      } else {
        setError('Failed to register patient. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData(prev => ({
      ...prev,
      patientName: '',
      age: '',
      place: '',
      phoneNumber: '',
      referral: ''
    }));
    setError('');
    setSuccess('');
  };

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-primary text-white py-3">
              <h2 className="h3 mb-0">
                <i className="bi bi-person-plus-fill me-2"></i>
                Patient Registration Form
              </h2>
            </div>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
              )}
              
              {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  {success}
                  <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">System Generated Information</h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label fw-bold">IP Number</label>
                        <input
                          type="text"
                          name="ipNumber"
                          value={formData.ipNumber}
                          readOnly
                          className="form-control-plaintext bg-light rounded p-2"
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label fw-bold">Serial Number</label>
                        <input
                          type="text"
                          name="serialNumber"
                          value={formData.serialNumber}
                          readOnly
                          className="form-control-plaintext bg-light rounded p-2"
                        />
                       
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">Patient Details</h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label fw-bold">Patient Name *</label>
                          <input
                            type="text"
                            name="patientName"
                            value={formData.patientName}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter full name"
                            required
                          />
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Age *</label>
                          <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter age"
                            min="0"
                            max="120"
                            required
                          />
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label">Phone Number</label>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter phone number (optional)" 
                            pattern="[0-9]{10}"
                            maxLength={10}
                          />
                        </div>
                        
                        <div className="col-12">
                          <label className="form-label fw-bold">Place *</label>
                          <input
                            type="text"
                            name="place"
                            value={formData.place}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter place of residence"
                            required
                          />
                        </div>
                        
                        <div className="col-12">
                          <label className="form-label">Referral Information</label>
                          <input
                            type="text"
                            name="referral"
                            value={formData.referral}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Optional referral information"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                    <small className="text-muted">
                      <i className="bi bi-info-circle me-1"></i>
                      Fields marked with * are required
                    </small>
                    <div>
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary me-2"
                        onClick={clearForm}
                      >
                        <i className="bi bi-x-circle me-1"></i>
                        Clear Form
                      </button>
                      
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Registering...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            Register Patient
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;