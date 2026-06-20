import React, { useState } from 'react';
import { useSim } from '../context/SimEngine';
import {
  LayoutDashboard, Users, Heart, AlertTriangle, FileText, Calendar, 
  DollarSign, Settings, Plus, Check, X, ShieldAlert, Sparkles, Send,
  TrendingUp, Download, Eye, BookOpen, AlertCircle
} from 'lucide-react';

export default function AdminApp() {
  const {
    activeAdminScreen,
    setActiveAdminScreen,
    visitors,
    complaints,
    updateComplaintStatus,
    maintenanceDues,
    generateBulkMaintenanceBills,
    facilityBookings,
    updateBookingStatus,
    addNotice,
    ledgers,
    setLedgers,
    sosActive,
    sosDetails,
    clearSos,
    addToast
  } = useSim();

  // Dialog open state
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState('General');

  // Resident manager state
  const [newResidentName, setNewResidentName] = useState('');
  const [newResidentUnit, setNewResidentUnit] = useState('');
  const [newResidentPhone, setNewResidentPhone] = useState('');
  const [residentsList, setResidentsList] = useState([
    { id: 1, name: 'Rajesh Kumar', unit: 'A-101', phone: '9876543210', vehicles: 2, status: 'Owner' },
    { id: 2, name: 'Deepak Sharma', unit: 'A-102', phone: '9312345678', vehicles: 1, status: 'Tenant' },
    { id: 3, name: 'Joyita Roy', unit: 'B-204', phone: '9888877766', vehicles: 0, status: 'Owner' },
    { id: 4, name: 'Shyamal Patel', unit: 'C-501', phone: '9345678901', vehicles: 3, status: 'Owner' }
  ]);

  // Handle add resident
  const handleAddResident = (e) => {
    e.preventDefault();
    if (!newResidentName || !newResidentUnit || !newResidentPhone) {
      alert('Please fill all fields');
      return;
    }
    const newRes = {
      id: residentsList.length + 1,
      name: newResidentName,
      unit: newResidentUnit,
      phone: newResidentPhone,
      vehicles: 1,
      status: 'Owner'
    };
    setResidentsList([...residentsList, newRes]);
    addToast(`Resident ${newResidentName} added to Unit ${newResidentUnit}`, 'success');
    setNewResidentName('');
    setNewResidentUnit('');
    setNewResidentPhone('');
  };

  // Handle add notice
  const handleNoticeSubmit = (e) => {
    e.preventDefault();
    if (!newNoticeTitle || !newNoticeContent) {
      alert('Please enter title and content');
      return;
    }
    addNotice(newNoticeTitle, newNoticeContent, newNoticeCategory);
    setNewNoticeTitle('');
    setNewNoticeContent('');
    addToast('Notice published and broadcasted to residents.', 'success');
  };

  // Calculate finance metrics
  const totalIncome = ledgers.filter(tx => tx.type === 'Income').reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpense = ledgers.filter(tx => tx.type === 'Expense').reduce((sum, tx) => sum + tx.amount, 0);
  const netProfit = totalIncome - totalExpense;

  const renderAdminContent = () => {
    switch (activeAdminScreen) {
      case 'dashboard':
        return (
          <div className="desktop-main-scroll animate-fade-in">
            {/* Page Header */}
            <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem' }}>Committee Management Dashboard</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Society executive operations oversight</p>
              </div>
              <span className="badge success">Society Hub Online</span>
            </div>

            {/* Emergency SOS Banner alert */}
            {sosActive && sosDetails && (
              <div 
                className="premium-card animate-pulse" 
                style={{ 
                  background: 'var(--danger-gradient)', 
                  color: 'white', 
                  border: 'none', 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px',
                  boxShadow: '0 10px 20px rgba(239, 68, 68, 0.25)'
                }}
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <ShieldAlert size={36} />
                  <div>
                    <h3 style={{ color: 'white', fontSize: '1.1rem' }}>CRITICAL EMERGENCY ALERT (SOS)</h3>
                    <p style={{ color: 'white', fontSize: '0.8rem', opacity: 0.9 }}>
                      <b>Unit {sosDetails.unit}</b> ({sosDetails.resident}) triggered <b>{sosDetails.type}</b> alarm at {sosDetails.time}! <br />
                      Location Coordinates: {sosDetails.coords}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={clearSos}
                  className="sim-btn" 
                  style={{ background: 'white', color: 'var(--danger-dark)', border: 'none', padding: '10px 20px', fontWeight: 'bold' }}
                >
                  Clear SOS Incident
                </button>
              </div>
            )}

            {/* Metrics cards grid */}
            <div className="dashboard-metrics-grid">
              <div className="metric-card">
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total Residents</span>
                  <h3 style={{ fontSize: '1.8rem', margin: '4px 0' }}>{residentsList.length * 60} Units</h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--success)' }}>Active occupancy: 92%</span>
                </div>
                <div className="metric-icon-box" style={{ background: '#e0e7ff', color: 'var(--primary)' }}>
                  <Users size={24} />
                </div>
              </div>

              <div className="metric-card">
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Daily Visitors</span>
                  <h3 style={{ fontSize: '1.8rem', margin: '4px 0' }}>{visitors.length} Logs</h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--info)' }}>Today Entry/Exit</span>
                </div>
                <div className="metric-icon-box" style={{ background: '#cffafe', color: 'var(--secondary)' }}>
                  <Eye size={24} />
                </div>
              </div>

              <div className="metric-card">
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Open Complaints</span>
                  <h3 style={{ fontSize: '1.8rem', margin: '4px 0' }}>{complaints.filter(c => c.status !== 'Resolved').length} Open</h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--danger)' }}>Requires Staff assignment</span>
                </div>
                <div className="metric-icon-box" style={{ background: '#fee2e2', color: 'var(--danger)' }}>
                  <AlertTriangle size={24} />
                </div>
              </div>

              <div className="metric-card">
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Maintenance Collections</span>
                  <h3 style={{ fontSize: '1.8rem', margin: '4px 0' }}>₹{totalIncome}</h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--success)' }}>+14% this month</span>
                </div>
                <div className="metric-icon-box" style={{ background: '#d1fae5', color: 'var(--success)' }}>
                  <DollarSign size={24} />
                </div>
              </div>
            </div>

            {/* Quick action bar */}
            <div className="premium-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Bulk Operations:</h4>
              <button className="sim-btn sim-btn-primary" onClick={() => generateBulkMaintenanceBills('July 2026')} style={{ width: 'auto' }}>
                Generate July 2026 Bills
              </button>
              <button className="sim-btn" onClick={() => setActiveAdminScreen('notices')} style={{ width: 'auto' }}>
                Broadcast Society Notice
              </button>
              <button className="sim-btn" onClick={() => addToast('Ledger collection details compiled and sent to register.', 'success')} style={{ width: 'auto' }}>
                Export Collections Ledger (CSV)
              </button>
            </div>

            {/* Double grid list panel */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
              
              {/* Complaints tracker */}
              <div className="premium-card">
                <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Complaints Board</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {complaints.slice(0, 3).map((comp) => (
                    <div key={comp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                          <span className="badge danger">{comp.category}</span>
                          <span className="badge info">{comp.priority}</span>
                        </div>
                        <h4 style={{ fontSize: '0.85rem' }}>{comp.description}</h4>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Reported by Flat {comp.unit} | Date: {comp.date}</span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {comp.status === 'Open' && (
                          <button 
                            onClick={() => updateComplaintStatus(comp.id, 'In Progress', 'Work assigned to engineering team.')}
                            className="sim-btn sim-btn-primary" 
                            style={{ padding: '6px 12px', fontSize: '0.7rem', width: 'auto' }}
                          >
                            Assign Staff
                          </button>
                        )}
                        {comp.status === 'In Progress' && (
                          <button 
                            onClick={() => updateComplaintStatus(comp.id, 'Resolved', 'Technician fixed root cause.')}
                            className="sim-btn" 
                            style={{ padding: '6px 12px', fontSize: '0.7rem', width: 'auto', background: 'var(--success-gradient)', color: 'white', border: 'none' }}
                          >
                            Resolve
                          </button>
                        )}
                        {comp.status === 'Resolved' && (
                          <span className="badge success">Resolved</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active visitor panel */}
              <div className="premium-card">
                <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Today's Visitors Logs</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {visitors.slice(0, 4).map((v, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid var(--border-light)' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        {v.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.8rem' }}>{v.name}</h4>
                        <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Flat {v.residentUnit} | {v.purpose}</p>
                      </div>
                      <span style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>{v.time}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        );

      case 'residents':
        return (
          <div className="desktop-main-scroll animate-fade-in">
            <h2 style={{ fontSize: '1.6rem' }}>Resident & Flat Directory</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Add, search, and manage property units and residents.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginTop: '12px' }}>
              {/* Form card */}
              <div className="premium-card">
                <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Assign Resident to Unit</h3>
                <form onSubmit={handleAddResident} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="form-group">
                    <label>RESIDENT FULL NAME</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Ramesh Chandra"
                      value={newResidentName}
                      onChange={(e) => setNewResidentName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>ASSIGN UNIT / FLAT</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. B-205"
                      value={newResidentUnit}
                      onChange={(e) => setNewResidentUnit(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>MOBILE NUMBER</label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      placeholder="e.g. 9988776655"
                      value={newResidentPhone}
                      onChange={(e) => setNewResidentPhone(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="form-submit-btn">Add Resident Unit</button>
                </form>
              </div>

              {/* List table card */}
              <div className="premium-card">
                <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Flat Occupancy Register</h3>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Resident Name</th>
                      <th>Unit</th>
                      <th>Mobile Phone</th>
                      <th>Vehicles</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {residentsList.map((r) => (
                      <tr key={r.id}>
                        <td>{r.name}</td>
                        <td><b>{r.unit}</b></td>
                        <td>{r.phone}</td>
                        <td>{r.vehicles} Registered</td>
                        <td><span className="badge info">{r.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'complaints':
        return (
          <div className="desktop-main-scroll animate-fade-in">
            <h2 style={{ fontSize: '1.6rem' }}>Complaints Ticketing Center</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Track issues reported by residents and assign vendor technicians.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
              {complaints.map((c) => (
                <div key={c.id} className="premium-card">
                  <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span className="badge danger">{c.category}</span>
                      <span className="badge warning">Priority: {c.priority}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Unit <b>{c.unit}</b> | Location: {c.location}</span>
                    </div>
                    <span className={`badge ${c.status === 'Resolved' ? 'success' : 'warning'}`}>{c.status}</span>
                  </div>

                  <p style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{c.description}</p>
                  
                  {/* Status Action Buttons */}
                  <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', marginTop: '16px', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {c.status === 'Open' && (
                        <button 
                          onClick={() => updateComplaintStatus(c.id, 'In Progress', 'Assigned Electrician Ramesh to resolve issue.')}
                          className="sim-btn sim-btn-primary" 
                          style={{ width: 'auto', fontSize: '0.75rem' }}
                        >
                          Assign Technician
                        </button>
                      )}
                      {c.status === 'In Progress' && (
                        <button 
                          onClick={() => updateComplaintStatus(c.id, 'Resolved', 'Faulty circuit breakers replaced.')}
                          className="sim-btn" 
                          style={{ width: 'auto', fontSize: '0.75rem', background: 'var(--success-gradient)', color: 'white', border: 'none' }}
                        >
                          Mark as Resolved
                        </button>
                      )}
                      {c.status === 'Resolved' && (
                        <button 
                          onClick={() => updateComplaintStatus(c.id, 'Closed', 'Verified by resident and ticket archived.')}
                          className="sim-btn" 
                          style={{ width: 'auto', fontSize: '0.75rem' }}
                        >
                          Archive Ticket
                        </button>
                      )}
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                      Filing Date: {c.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'notices':
        return (
          <div className="desktop-main-scroll animate-fade-in">
            <h2 style={{ fontSize: '1.6rem' }}>Notice Board Publisher</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Create announcements that publish directly on residents' mobile dashboards.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginTop: '12px' }}>
              <div className="premium-card">
                <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Compose Notice</h3>
                <form onSubmit={handleNoticeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="form-group">
                    <label>NOTICE HEADER / TITLE</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Schedule Lift Maintenance"
                      value={newNoticeTitle}
                      onChange={(e) => setNewNoticeTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>NOTICE CONTENT BODY</label>
                    <textarea 
                      rows={6}
                      className="form-input" 
                      placeholder="Enter detailed society warning instructions..."
                      value={newNoticeContent}
                      onChange={(e) => setNewNoticeContent(e.target.value)}
                      style={{ resize: 'none' }}
                    />
                  </div>

                  <div className="form-group">
                    <label>NOTICE CRITICAL LEVEL</label>
                    <select 
                      className="form-input" 
                      value={newNoticeCategory}
                      onChange={(e) => setNewNoticeCategory(e.target.value)}
                      style={{ appearance: 'auto' }}
                    >
                      <option value="General">General Notice</option>
                      <option value="Important">Important / Urgent Attention</option>
                      <option value="Event">Cultural / Event Notice</option>
                    </select>
                  </div>

                  <button type="submit" className="form-submit-btn">Publish Notice & Ping Mobile Apps</button>
                </form>
              </div>

              <div className="premium-card" style={{ background: '#f8fafc' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>Notice Publishing Preview</h3>
                <div className="premium-card" style={{ background: 'white' }}>
                  <span className="badge danger">{newNoticeCategory}</span>
                  <h4 style={{ fontSize: '0.95rem', margin: '8px 0' }}>{newNoticeTitle || 'Notice Title Preview'}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', minHeight: '80px' }}>
                    {newNoticeContent || 'Detailed notice body content will be rendered here. Keep it professional.'}
                  </p>
                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '8px', fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>
                    Author: Management Committee | Published: Today
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'facilities':
        return (
          <div className="desktop-main-scroll animate-fade-in">
            <h2 style={{ fontSize: '1.6rem' }}>Facility Bookings Approval</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Review, approve, or reject reservations requested by residents.</p>

            <div className="premium-card" style={{ marginTop: '12px' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Facility Block</th>
                    <th>Requester Unit</th>
                    <th>Scheduled Date</th>
                    <th>Booking Slot</th>
                    <th>Charges Due</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {facilityBookings.map((b) => (
                    <tr key={b.id}>
                      <td><b>{b.facility}</b></td>
                      <td>Flat {b.unit}</td>
                      <td>{b.date}</td>
                      <td>{b.slot}</td>
                      <td>₹{b.charges}</td>
                      <td>
                        <span className={`badge ${b.status === 'Completed' ? 'success' : b.status === 'Upcoming' ? 'info' : 'warning'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td>
                        {b.status === 'Pending' ? (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button 
                              onClick={() => updateBookingStatus(b.id, 'Upcoming')}
                              className="sim-btn sim-btn-primary" 
                              style={{ padding: '4px 8px', fontSize: '0.65rem', width: 'auto' }}
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => updateBookingStatus(b.id, 'Cancelled')}
                              className="sim-btn sim-btn-danger" 
                              style={{ padding: '4px 8px', fontSize: '0.65rem', width: 'auto' }}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Decided</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'accounts':
        return (
          <div className="desktop-main-scroll animate-fade-in">
            <h2 style={{ fontSize: '1.6rem' }}>Society Finance Ledger</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Balance sheets, ledger book entries, and revenue metrics.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '12px' }}>
              <div className="premium-card" style={{ borderLeft: '4px solid var(--success)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>TOTAL REVENUE (INCOME)</span>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--success)' }}>₹{totalIncome}</h3>
              </div>
              <div className="premium-card" style={{ borderLeft: '4px solid var(--danger)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>TOTAL UTILITY EXPENSES</span>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--danger)' }}>₹{totalExpense}</h3>
              </div>
              <div className="premium-card" style={{ borderLeft: '4px solid var(--primary)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>NET RESERVE SURPLUS</span>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--primary)' }}>₹{netProfit}</h3>
              </div>
            </div>

            {/* Income statements ledger logs */}
            <div className="premium-card" style={{ marginTop: '16px' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>Ledger Journal</h3>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>TX Ledger Type</th>
                    <th>Category Description</th>
                    <th>Particulars</th>
                    <th>Transaction Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgers.map((tx) => (
                    <tr key={tx.id}>
                      <td>{tx.date}</td>
                      <td>
                        <span className={`badge ${tx.type === 'Income' ? 'success' : 'danger'}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td><b>{tx.category}</b></td>
                      <td>{tx.description}</td>
                      <td style={{ fontWeight: 'bold', color: tx.type === 'Income' ? 'var(--success-dark)' : 'var(--danger-dark)' }}>
                        {tx.type === 'Income' ? '+' : '-'} ₹{tx.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return <div>Sub-view not available</div>;
    }
  };

  return (
    <div className="desktop-panel-layout animate-fade-in" style={{ zIndex: 10 }}>
      {/* Sidebar Panel Router */}
      <div className="desktop-sidebar">
        <div style={{ padding: '0 16px 16px 16px', borderBottom: '1px solid var(--border-light)', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)' }}>Royal Orchid</h3>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>WINGS A, B & C ADMIN</span>
        </div>

        <button 
          className={`desktop-nav-btn ${activeAdminScreen === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveAdminScreen('dashboard')}
        >
          <LayoutDashboard size={16} /> Overview
        </button>

        <button 
          className={`desktop-nav-btn ${activeAdminScreen === 'residents' ? 'active' : ''}`}
          onClick={() => setActiveAdminScreen('residents')}
        >
          <Users size={16} /> Residents Registry
        </button>

        <button 
          className={`desktop-nav-btn ${activeAdminScreen === 'complaints' ? 'active' : ''}`}
          onClick={() => setActiveAdminScreen('complaints')}
        >
          <AlertTriangle size={16} /> Complaints Ticketing
        </button>

        <button 
          className={`desktop-nav-btn ${activeAdminScreen === 'notices' ? 'active' : ''}`}
          onClick={() => setActiveAdminScreen('notices')}
        >
          <FileText size={16} /> Notices Broadcast
        </button>

        <button 
          className={`desktop-nav-btn ${activeAdminScreen === 'facilities' ? 'active' : ''}`}
          onClick={() => setActiveAdminScreen('facilities')}
        >
          <Calendar size={16} /> Facility Bookings
        </button>

        <button 
          className={`desktop-nav-btn ${activeAdminScreen === 'accounts' ? 'active' : ''}`}
          onClick={() => setActiveAdminScreen('accounts')}
        >
          <DollarSign size={16} /> Ledger Accounts
        </button>
      </div>

      {/* Main Panel Scrolling Area */}
      {renderAdminContent()}
    </div>
  );
}
