import React, { useMemo, useState, useEffect } from 'react';
import './AdminPanel.css';

// 🚀 DYNAMIC URL: Local par localhost chalega, Live hone par tumhara live link chalega
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : 'https://ayodhya-estates-web.onrender.com/api'; // Deployment ke waqt isko apne asli backend link se badal dena

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    if (!loginPassword || loginPassword.trim() === '') {
      setLoginError('Password is required');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: loginPassword })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('adminAuthenticated', 'true');
        // ✅ Fix: Login ke time Admin ID save kar rahe hain taaki password change ho sake
        localStorage.setItem('adminId', data.adminId || data.admin?._id || data.id || 'admin');
        setIsAuthenticated(true);
        setLoginPassword('');
        setLoginError('');
      } else {
        setLoginError(data.error || 'Invalid password. Please try again.');
        setLoginPassword('');
      }
    } catch (error) {
      setLoginError('Connection error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminId');
    setIsAuthenticated(false);
    setLoginPassword('');
    setLoginError('');
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-container">
          <div className="admin-login-card">
            <h1 className="admin-login-title">Admin Access</h1>
            <p className="admin-login-subtitle">Ayodhya Estates Dashboard</p>
            
            <form onSubmit={handleAdminLogin} className="admin-login-form">
              <div className="admin-login-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="admin-login-input"
                  disabled={isLoading}
                  required
                />
              </div>

              {loginError && (
                <div className="admin-login-error">
                  <i className="fas fa-exclamation-circle"></i> {loginError}
                </div>
              )}

              <button type="submit" className="admin-login-button" disabled={isLoading}>
                {isLoading ? 'Authenticating...' : 'Login to Dashboard'}
              </button>
            </form>
            <div className="admin-login-footer">
              <p>Enter the admin password to continue</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <AdminDashboard onLogout={handleAdminLogout} />;
};

const AdminDashboard = ({ onLogout }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [projectFilter, setProjectFilter] = useState('All');
  
  const [dashboardStats, setDashboardStats] = useState({
    totalInquiries: 0,
    ongoingProjects: 1,
    upcomingProjects: 1,
    completedProjects: 1
  });

  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [passwordMsg, setPasswordMsg] = useState('');
  const [inquiries, setInquiries] = useState([]);

  // ✅ Fix: Live Database se Inquiries fetch kar rahe hain
  useEffect(() => {
    fetch(`${API_BASE_URL}/inquiries`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setInquiries(data);
        }
      })
      .catch(err => console.error('Inquiries fetch error:', err));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/admin/dashboard-stats`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setDashboardStats({
            totalInquiries: data.totalInquiries || inquiries.length,
            ongoingProjects: data.ongoingProjects || 1,
            upcomingProjects: data.upcomingProjects || 1,
            completedProjects: data.completedProjects || 1
          });
        }
      })
      .catch(err => console.log('Using fallback stats'));
  }, [inquiries.length]);

  const uniqueProjects = useMemo(() => {
    return [...new Set(inquiries.map(item => item.projectOfInterest || item.project))];
  }, [inquiries]);

  const filteredInquiries = useMemo(() => {
    if (projectFilter === 'All') return inquiries;
    return inquiries.filter((lead) => (lead.projectOfInterest || lead.project) === projectFilter);
  }, [inquiries, projectFilter]);

  const handleInquiryStatusChange = (id, status) => {
    setInquiries((prev) =>
      prev.map((lead) =>
        (lead._id || lead.id) === id ? { ...lead, status } : lead
      )
    );
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Fix: Sahi adminId bhej rahe hain database mein check karne ke liye
      const response = await fetch(`${API_BASE_URL}/admin/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
          adminId: localStorage.getItem('adminId')
        })
      });
      const data = await response.json();
      
      if(!response.ok) throw new Error(data.error || data.message || 'Update failed');
      
      setPasswordMsg('Password successfully updated!');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPasswordMsg(err.message || 'Failed to update password.');
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-title">Ayodhya Estates</div>
          <div className="admin-brand-subtitle">Admin Dashboard</div>
        </div>
        <nav className="admin-nav">
          <button onClick={() => setActiveView('dashboard')} className={`admin-nav-link ${activeView === 'dashboard' ? 'active' : ''}`}>
            <i className="fas fa-chart-pie"></i> Dashboard
          </button>
          
          <button onClick={() => setActiveView('inquiries')} className={`admin-nav-link ${activeView === 'inquiries' ? 'active' : ''}`}>
            <i className="fas fa-inbox"></i> Inquiries
          </button>
          
          <button onClick={() => setActiveView('settings')} className={`admin-nav-link ${activeView === 'settings' ? 'active' : ''}`}>
            <i className="fas fa-lock"></i> Change Password
          </button>
          
          <button onClick={() => setActiveView('logout')} className={`admin-nav-link ${activeView === 'logout' ? 'active' : ''}`}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">
              {activeView === 'dashboard' && 'Dashboard'}
              {activeView === 'inquiries' && 'Inquiries'}
              {activeView === 'settings' && 'Change Password'}
              {activeView === 'logout' && 'Logout'}
            </h1>
            <p className="admin-subtitle">Ayodhya Estates Admin Center</p>
          </div>
        </div>

        {activeView === 'dashboard' && (
          <div className="admin-stats">
            <div className="admin-stat-card">
              <div className="admin-stat-label">Total Inquiries</div>
              <div className="admin-stat-value">{dashboardStats.totalInquiries}</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-label">Ongoing Projects</div>
              <div className="admin-stat-value">{dashboardStats.ongoingProjects}</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-label">Upcoming Projects</div>
              <div className="admin-stat-value">{dashboardStats.upcomingProjects}</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-label">Completed Projects</div>
              <div className="admin-stat-value">{dashboardStats.completedProjects}</div>
            </div>
          </div>
        )}

        {activeView === 'inquiries' && (
          <div className="admin-section">
            <div className="admin-filter">
              <label htmlFor="projectFilter">Filter by Project</label>
              <select id="projectFilter" value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="admin-select" style={{maxWidth: '300px'}}>
                <option value="All">All</option>
                {uniqueProjects.map((project, idx) => (
                  <option key={idx} value={project}>{project}</option>
                ))}
              </select>
            </div>
            <div className="admin-card">
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Project of Interest</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInquiries.map((lead) => (
                      <tr key={lead._id || lead.id}>
                        <td>{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : (lead.date || 'New')}</td>
                        <td>{lead.name}</td>
                        <td>{lead.phone}</td>
                        <td>{lead.projectOfInterest || lead.project}</td>
                        <td>
                          <select value={lead.status || 'New'} onChange={(e) => handleInquiryStatusChange(lead._id || lead.id, e.target.value)} className="admin-select">
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeView === 'settings' && (
          <div className="admin-card" style={{ maxWidth: '500px' }}>
            <div className="admin-empty-title" style={{ marginBottom: '1.5rem' }}>Update Security Credentials</div>
            {passwordMsg && (
              <div style={{ marginBottom: '1rem', color: passwordMsg.includes('failed') || passwordMsg.includes('Invalid') || passwordMsg.includes('required') ? '#dc2626' : '#059669', fontWeight: '600', padding: '0.75rem', backgroundColor: passwordMsg.includes('failed') || passwordMsg.includes('Invalid') || passwordMsg.includes('required') ? '#fee2e2' : '#d1fae5', borderRadius: '8px' }}>
                {passwordMsg}
              </div>
            )}
            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4b5563', fontSize: '0.9rem' }}>Current Password</label>
                <input type="password" className="admin-input" value={passwords.currentPassword} onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4b5563', fontSize: '0.9rem' }}>New Password</label>
                <input type="password" className="admin-input" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} required />
              </div>
              <button type="submit" className="admin-primary-btn" style={{ marginTop: '0.5rem' }}>
                Update Password
              </button>
            </form>
          </div>
        )}

        {activeView === 'logout' && (
          <div className="admin-card admin-empty">
            <div className="admin-empty-title">Logout</div>
            <div className="admin-empty-text">You will be logged out of the admin panel.</div>
            <button onClick={onLogout} className="admin-primary-btn" style={{ marginTop: '2rem', maxWidth: '200px' }}>
              <i className="fas fa-sign-out-alt"></i> Logout Now
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
