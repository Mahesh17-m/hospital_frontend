import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PatientDetailModal from './PatientDetailModal';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [patientCount, setPatientCount] = useState(0);
  const [todayPatients, setTodayPatients] = useState(0);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    ipNumber: '',
    patientName: '',
    serialNumber: '',
    place: '',
    phoneNumber: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [patients, filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/patients`);
      
      let patientsData = [];
      
      if (response.data.success && Array.isArray(response.data.patients)) {
        patientsData = response.data.patients;
      } else if (Array.isArray(response.data)) {
        patientsData = response.data;
      }
      
      patientsData.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayCount = patientsData.filter(patient => 
        new Date(patient.registrationDate) >= today
      ).length;
      
      setPatientCount(patientsData.length);
      setTodayPatients(todayCount);
      setPatients(patientsData);
      setFilteredPatients(patientsData);
      setError(null);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please check if the server is running.');
      setPatients([]);
      setFilteredPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...patients];
    
    if (filters.ipNumber) {
      filtered = filtered.filter(patient => 
        patient.ipNumber?.toLowerCase().includes(filters.ipNumber.toLowerCase())
      );
    }
    
    if (filters.patientName) {
      filtered = filtered.filter(patient => 
        patient.patientName?.toLowerCase().includes(filters.patientName.toLowerCase())
      );
    }
    
    if (filters.serialNumber) {
      filtered = filtered.filter(patient => 
        patient.serialNumber?.toLowerCase().includes(filters.serialNumber.toLowerCase())
      );
    }
    
    if (filters.place) {
      filtered = filtered.filter(patient => 
        patient.place?.toLowerCase().includes(filters.place.toLowerCase())
      );
    }
    
    if (filters.phoneNumber) {
      filtered = filtered.filter(patient => 
        patient.phoneNumber?.includes(filters.phoneNumber)
      );
    }
    
    if (filters.startDate) {
      filtered = filtered.filter(patient => 
        new Date(patient.registrationDate) >= new Date(filters.startDate)
      );
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(patient => 
        new Date(patient.registrationDate) <= endDate
      );
    }
    
    setFilteredPatients(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/patients`);
      setPatients(response.data.patients);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const clearFilters = () => {
    setFilters({
      ipNumber: '',
      patientName: '',
      serialNumber: '',
      place: '',
      phoneNumber: '',
      startDate: '',
      endDate: ''
    });
  };

  const exportToExcel = () => {
    const headers = ['IP Number', 'Serial Number', 'Patient Name', 'Age', 'Place', 'Phone Number', 'Referral', 'Registration Date'];
    const csvContent = [
      headers.join(','),
      ...filteredPatients.map(patient => [
        patient.ipNumber || '',
        patient.serialNumber || '',
        `"${patient.patientName || ''}"`,
        patient.age || '',
        `"${patient.place || ''}"`,
        patient.phoneNumber || '',
        `"${patient.referral || ''}"`,
        patient.registrationDate ? new Date(patient.registrationDate).toLocaleDateString() : ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `patients_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

const exportToPDF = () => {
  const printContent = `
    <html>
      <head>
        <title>Patients Export</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          h1 { text-align: center; }
        </style>
      </head>
      <body>
        <h1>Patients List - ${new Date().toLocaleDateString()}</h1>
        <table>
          <thead>
            <tr>
              <th>IP Number</th>
              <th>Patient Name</th>
              <th>Age</th>
              <th>Place</th>
              <th>Phone</th>
              <th>Registration Date</th>
            </tr>
          </thead>
          <tbody>
            ${filteredPatients.map(patient => `
              <tr>
                <td>${patient.ipNumber || 'N/A'}</td>
                <td>${patient.patientName || 'N/A'}</td>
                <td>${patient.age || 'N/A'}</td>
                <td>${patient.place || 'N/A'}</td>
                <td>${patient.phoneNumber || 'N/A'}</td> 
                <td>${patient.registrationDate ? new Date(patient.registrationDate).toLocaleDateString() : 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};


  const openPatientDetails = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '50vh'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-3">Loading dashboard data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mx-3 mt-3" role="alert">
        <div className="d-flex align-items-center">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>{error}</strong>
        </div>
        <button onClick={fetchData} className="btn btn-primary mt-2">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3">
      <div className="row mb-4">
        <div className="col">
          <h1 className="h2 border-bottom pb-2">Patient Dashboard</h1>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-body text-center">
              <h5 className="card-title text-muted">Total Patients</h5>
              <h2 className="card-text text-primary display-4">{patientCount}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-body text-center">
              <h5 className="card-title text-muted">Today's Patients</h5>
              <h2 className="card-text text-success display-4">{todayPatients}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header bg-light py-2">
          <h6 className="mb-0">Filter Options</h6>
        </div>
        <div className="card-body p-3">
          <div className="row g-2 align-items-end">
            <div className="col-md-2">
              <label className="form-label small mb-1">IP Number</label>
              <input
                type="text"
                name="ipNumber"
                value={filters.ipNumber}
                onChange={handleFilterChange}
                placeholder="Search IP..."
                className="form-control form-control-sm"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small mb-1">Patient Name</label>
              <input
                type="text"
                name="patientName"
                value={filters.patientName}
                onChange={handleFilterChange}
                placeholder="Search name..."
                className="form-control form-control-sm"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small mb-1">Serial Number</label>
              <input
                type="text"
                name="serialNumber"
                value={filters.serialNumber}
                onChange={handleFilterChange}
                placeholder="Search serial..."
                className="form-control form-control-sm"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small mb-1">Place</label>
              <input
                type="text"
                name="place"
                value={filters.place}
                onChange={handleFilterChange}
                placeholder="Search place..."
                className="form-control form-control-sm"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small mb-1">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={filters.phoneNumber}
                onChange={handleFilterChange}
                placeholder="Search phone..."
                className="form-control form-control-sm"
              />
            </div>
            <div className="col-md-1">
              <label className="form-label small mb-1">From Date</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="form-control form-control-sm"
              />
            </div>
            <div className="col-md-1">
              <label className="form-label small mb-1">To Date</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="form-control form-control-sm"
              />
            </div>
            <div className="col-md-2">
              <button onClick={clearFilters} className="btn btn-outline-secondary btn-sm w-100 mt-3">
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header bg-light d-flex justify-content-between align-items-center py-2">
          <h6 className="mb-0">Patients List</h6>
          <div>
            <button onClick={exportToExcel} className="btn btn-success btn-sm me-1">
              <i className="bi bi-file-earmark-excel"></i> Excel
            </button>
            <button onClick={exportToPDF} className="btn btn-danger btn-sm">
              <i className="bi bi-file-earmark-pdf"></i> PDF
            </button>
          </div>
        </div>
        <div className="card-body p-0">
          {filteredPatients.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>IP Number</th>
                    <th>Serial No.</th>
                    <th>Patient Name</th>
                    <th>Registration Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map(patient => (
                    <tr key={patient._id}>
                      <td className="fw-bold text-primary">{patient.ipNumber || 'N/A'}</td>
                      <td className="text-muted">{patient.serialNumber || 'N/A'}</td>
                      <td>{patient.patientName || 'N/A'}</td>
                    
                      <td>
                        {patient.registrationDate 
                          ? new Date(patient.registrationDate).toLocaleDateString() 
                          : 'N/A'
                        }
                      </td>
                      <td>
                        <button 
                          onClick={() => openPatientDetails(patient)}
                          className="btn btn-sm btn-outline-primary"
                          title="View Details"
                        >
                          <i className="bi bi-eye"></i> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-search display-4 text-muted"></i>
              <h5 className="mt-3 text-muted">No patients found</h5>
              <p className="text-muted">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setIsModalOpen(false)}
          refreshPatients={fetchPatients}
        />
      )}
    </div>
  );
};

export default Dashboard;