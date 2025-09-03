import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ;

const PatientDetailModal = ({ patient, onClose, refreshPatients }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Clean phone number function
  const cleanPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    return phone
      .replace(/[{}]/g, '')      // remove curly braces
      .replace(/[^\d+]/g, '');   // keep only digits and +
  };

  const handleEdit = () => {
    alert('Edit functionality would open here');
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.delete(`${API_BASE_URL}/patients/${patient._id}`);
      if (response.data.success) {
        refreshPatients();
        onClose();
        alert('✅ Patient deleted successfully');
      } else {
        setError('Failed to delete patient');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete patient. Please try again.');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  // ✅ Print patient details with cleaned phone number
  const printPatientDetails = () => {
    const printContent = `
      <html>
        <head>
          <title>Patient Details - ${patient.patientName || 'N/A'}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background: white; }
            .patient-header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #222; padding-bottom: 10px; }
            .patient-details { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .patient-details th, .patient-details td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .patient-details th { background-color: #f5f7f9; width: 30%; font-weight: bold; }
            .footer { margin-top: 30px; text-align: right; font-size: 12px; color: #555; }
            h1 { color: #1981e9; }
            h2 { color: #102337; }
          </style>
        </head>
        <body>
          <div class="patient-header">
            <h1>Hospital Management System</h1>
            <h2>Patient Details</h2>
          </div>
          
          <table class="patient-details">
            <tr><th>IP Number:</th><td>${patient.ipNumber || 'N/A'}</td></tr>
            <tr><th>Serial Number:</th><td>${patient.serialNumber || 'N/A'}</td></tr>
            <tr><th>Patient Name:</th><td>${patient.patientName || 'N/A'}</td></tr>
            <tr><th>Age:</th><td>${patient.age || 'N/A'}</td></tr>
            <tr><th>Place:</th><td>${patient.place || 'N/A'}</td></tr>
            <tr><th>Phone Number:</th><td>${cleanPhoneNumber(patient.phoneNumber) || 'N/A'}</td></tr>
            <tr><th>Referral:</th><td>${patient.referral || 'N/A'}</td></tr>
            <tr><th>Registration Date:</th><td>${patient.registrationDate ? new Date(patient.registrationDate).toLocaleDateString() : 'N/A'}</td></tr>
          </table>
          
          <div class="footer">
            <p>Printed on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          
          {/* Header */}
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="bi bi-person-badge me-2"></i>
              Patient Details
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} disabled={loading}></button>
          </div>
          
          {/* Body */}
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
                <button type="button" className="btn-close" onClick={() => setError('')}></button>
              </div>
            )}
            
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3"><label className="form-label fw-bold">IP Number:</label><p className="form-control-plaintext">{patient.ipNumber || 'N/A'}</p></div>
                <div className="mb-3"><label className="form-label fw-bold">Serial Number:</label><p className="form-control-plaintext">{patient.serialNumber || 'N/A'}</p></div>
                <div className="mb-3"><label className="form-label fw-bold">Patient Name:</label><p className="form-control-plaintext">{patient.patientName || 'N/A'}</p></div>
                <div className="mb-3"><label className="form-label fw-bold">Age:</label><p className="form-control-plaintext">{patient.age || 'N/A'}</p></div>
              </div>
              <div className="col-md-6">
                <div className="mb-3"><label className="form-label fw-bold">Place:</label><p className="form-control-plaintext">{patient.place || 'N/A'}</p></div>
                <div className="mb-3"><label className="form-label fw-bold">Phone Number:</label><p className="form-control-plaintext">{cleanPhoneNumber(patient.phoneNumber) || 'N/A'}</p></div>
                <div className="mb-3"><label className="form-label fw-bold">Referral:</label><p className="form-control-plaintext">{patient.referral || 'N/A'}</p></div>
                <div className="mb-3"><label className="form-label fw-bold">Registration Date:</label>
                  <p className="form-control-plaintext">{patient.registrationDate ? new Date(patient.registrationDate).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="modal-footer">
            <button onClick={handleEdit} className="btn btn-outline-warning" disabled={loading}>
              <i className="bi bi-pencil me-2"></i> Edit Patient
            </button>
            <button onClick={() => setShowDeleteConfirm(true)} className="btn btn-outline-danger" disabled={loading}>
              <i className="bi bi-trash me-2"></i> Delete Patient
            </button>
            <button onClick={printPatientDetails} className="btn btn-outline-primary" disabled={loading}>
              <i className="bi bi-printer me-2"></i> Print Details
            </button>
            <button onClick={onClose} className="btn btn-secondary" disabled={loading}>
              <i className="bi bi-x-circle me-2"></i> Close
            </button>
          </div>

          {showDeleteConfirm && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header bg-danger text-white">
                    <h5 className="modal-title">
                      <i className="bi bi-exclamation-triangle me-2"></i> Confirm Deletion
                    </h5>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowDeleteConfirm(false)} disabled={loading}></button>
                  </div>
                  <div className="modal-body">
                    <p>Are you sure you want to delete patient <strong>{patient.patientName}</strong>?</p>
                    <p className="text-muted">This action cannot be undone.</p>
                  </div>
                  <div className="modal-footer">
                    <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary" disabled={loading}>
                      Cancel
                    </button>
                    <button onClick={handleDelete} className="btn btn-danger" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span> Deleting...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-trash me-2"></i> Delete Patient
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PatientDetailModal;
