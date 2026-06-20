import React, { useState } from 'react';
import { useSim } from '../context/SimEngine';
import {
  Globe, CreditCard, ShieldCheck, Mail, Key, RefreshCw,
  Plus, Check, X, Server, MessageCircle, BarChart3, Database, MessageSquare
} from 'lucide-react';

export default function SuperAdminApp() {
  const {
    activeSuperAdminScreen,
    setActiveSuperAdminScreen,
    societies,
    setSocieties,
    subscriptionPlans,
    supportTickets,
    addToast
  } = useSim();

  // Integration Settings states
  const [whatsappActive, setWhatsappActive] = useState(true);
  const [smsActive, setSmsActive] = useState(true);
  const [smsGateway, setSmsGateway] = useState('Msg91');
  const [faceRecogAccuracy, setFaceRecogAccuracy] = useState(98.5);

  // New plan state variables
  const [planMultiplier, setPlanMultiplier] = useState(1);

  // Approve a pending society request
  const approveSociety = (id) => {
    setSocieties(prev =>
      prev.map(s => s.id === id ? { ...s, status: 'Active' } : s)
    );
    addToast('Society configuration approved successfully. Provisioned tenant database.', 'success');
  };

  const calculateSaaSMonthlyRevenue = () => {
    let rev = 0;
    societies.forEach(s => {
      if (s.status === 'Active') {
        if (s.plan === 'Premium') rev += 12000;
        else if (s.plan === 'Basic') rev += 5000;
        else if (s.plan === 'Enterprise') rev += 30000;
      }
    });
    return rev;
  };

  const renderSuperAdminContent = () => {
    switch (activeSuperAdminScreen) {
      case 'dashboard':
        return (
          <div className="desktop-main-scroll animate-fade-in">
            <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem' }}>SaaS Owner Core Console</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Global SmartSociety subscription statistics and configurations</p>
              </div>
              <span className="badge success" style={{ background: '#ecfdf5', color: '#047857' }}>SaaS Engine V4.1</span>
            </div>

            {/* Metrics cards grid */}
            <div className="dashboard-metrics-grid">
              <div className="metric-card">
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Registered Societies</span>
                  <h3 style={{ fontSize: '1.8rem', margin: '4px 0' }}>{societies.length} Clients</h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--success)' }}>{societies.filter(s => s.status === 'Active').length} Active tenants</span>
                </div>
                <div className="metric-icon-box" style={{ background: '#d1fae5', color: 'var(--success)' }}>
                  <Globe size={24} />
                </div>
              </div>

              <div className="metric-card">
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Monthly Recurring Rev (MRR)</span>
                  <h3 style={{ fontSize: '1.8rem', margin: '4px 0' }}>₹{calculateSaaSMonthlyRevenue() * planMultiplier}/mo</h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--success)' }}>Average LTV: ₹1.4L</span>
                </div>
                <div className="metric-icon-box" style={{ background: '#e0e7ff', color: 'var(--primary)' }}>
                  <BarChart3 size={24} />
                </div>
              </div>

              <div className="metric-card">
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Server Node Status</span>
                  <h3 style={{ fontSize: '1.8rem', margin: '4px 0' }}>99.98%</h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--info)' }}>Vite+Node Cluster AWS</span>
                </div>
                <div className="metric-icon-box" style={{ background: '#cffafe', color: 'var(--info)' }}>
                  <Server size={24} />
                </div>
              </div>

              <div className="metric-card">
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Support Tickets</span>
                  <h3 style={{ fontSize: '1.8rem', margin: '4px 0' }}>{supportTickets.filter(t => t.status === 'Open').length} Pending</h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--warning)' }}>Requires SLA resolution</span>
                </div>
                <div className="metric-icon-box" style={{ background: '#fef3c7', color: 'var(--warning)' }}>
                  <MessageSquare size={24} />
                </div>
              </div>
            </div>

            {/* Quick configuration triggers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
              
              {/* Clients management */}
              <div className="premium-card">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Tenant Management (Societies List)</h3>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Society Name</th>
                      <th>Location</th>
                      <th>License Plan</th>
                      <th>License Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {societies.map((s) => (
                      <tr key={s.id}>
                        <td><b>{s.name}</b></td>
                        <td>{s.location}</td>
                        <td><span className="badge info">{s.plan}</span></td>
                        <td>
                          <span className={`badge ${s.status === 'Active' ? 'success' : 'warning'}`}>
                            {s.status}
                          </span>
                        </td>
                        <td>
                          {s.status === 'Pending Approval' ? (
                            <button 
                              onClick={() => approveSociety(s.id)}
                              className="sim-btn sim-btn-primary" 
                              style={{ padding: '4px 8px', fontSize: '0.65rem', width: 'auto' }}
                            >
                              Approve & Provision
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>No Actions</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Global Integrations */}
              <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.1rem' }}>Global SaaS Gateways</h3>
                
                <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>WhatsApp Alerts Integration</span>
                    <button 
                      onClick={() => {
                        setWhatsappActive(!whatsappActive);
                        addToast(`WhatsApp alerts gateway ${!whatsappActive ? 'Enabled' : 'Disabled'}.`, 'info');
                      }}
                      className="sim-btn" 
                      style={{ 
                        width: 'auto', 
                        padding: '4px 10px', 
                        fontSize: '0.7rem', 
                        backgroundColor: whatsappActive ? 'var(--success)' : '#e2e8f0',
                        color: whatsappActive ? 'white' : 'var(--text-secondary)',
                        border: 'none'
                      }}
                    >
                      {whatsappActive ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Sends QR visitor invite templates, billing reminders automatically.</p>
                </div>

                <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>SMS Intercom Backup</span>
                    <button 
                      onClick={() => {
                        setSmsActive(!smsActive);
                        addToast(`SMS Intercom backup gateway ${!smsActive ? 'Enabled' : 'Disabled'}.`, 'info');
                      }}
                      className="sim-btn" 
                      style={{ 
                        width: 'auto', 
                        padding: '4px 10px', 
                        fontSize: '0.7rem', 
                        backgroundColor: smsActive ? 'var(--success)' : '#e2e8f0',
                        color: smsActive ? 'white' : 'var(--text-secondary)',
                        border: 'none'
                      }}
                    >
                      {smsActive ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Fallback SMS verification codes when data connection fails.</p>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>AI FACE RECOGNITION ACCURACY THRESHOLD</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input 
                      type="range" 
                      min="90" 
                      max="100" 
                      step="0.1" 
                      value={faceRecogAccuracy} 
                      onChange={(e) => setFaceRecogAccuracy(parseFloat(e.target.value))}
                      style={{ flex: 1, accentColor: 'var(--primary)' }}
                    />
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{faceRecogAccuracy}%</span>
                  </div>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Smart Gate cameras check entry faces against registered helper profiles.</p>
                </div>
              </div>

            </div>
          </div>
        );

      case 'plans':
        return (
          <div className="desktop-main-scroll animate-fade-in">
            <h2 style={{ fontSize: '1.6rem' }}>License Pricing Tier Adjustments</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Global license feature bundles and plan values configuration</p>

            <div style={{ display: 'flex', gap: '16px', margin: '12px 0', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Simulate Inflation Multiplier:</span>
              <button onClick={() => { setPlanMultiplier(1.1); addToast('License rates adjusted by +10%', 'warning'); }} className="sim-btn" style={{ width: 'auto', padding: '6px 12px' }}>+10% Rate</button>
              <button onClick={() => { setPlanMultiplier(1); addToast('License rates reset to standard base.', 'info'); }} className="sim-btn" style={{ width: 'auto', padding: '6px 12px' }}>Reset Base</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '12px' }}>
              {subscriptionPlans.map((plan) => (
                <div key={plan.id} className="premium-card" style={{ borderTop: plan.name === 'Premium Plan' ? '6px solid var(--primary)' : '1px solid var(--border-light)' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{plan.name}</h3>
                  <span style={{ fontSize: '1.8rem', fontWeight: 'bold', display: 'block', color: 'var(--primary)', marginBottom: '16px' }}>
                    {plan.id === 's3' ? 'Custom Quote' : `₹${Math.round(parseInt(plan.cost.replace(/\D/g, '')) * planMultiplier)}/mo`}
                  </span>
                  
                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                    <h5 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>ENABLED FEATURES</h5>
                    <ul style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '14px', color: 'var(--text-secondary)' }}>
                      {plan.features.map((feat, idx) => (
                        <li key={idx}>{feat}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'tickets':
        return (
          <div className="desktop-main-scroll animate-fade-in">
            <h2 style={{ fontSize: '1.6rem' }}>Society Client Inquiries (Support Tickets)</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Resolve technical webhooks or setup concerns for registered societies.</p>

            <div className="premium-card" style={{ marginTop: '12px' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Society Client</th>
                    <th>Ticket Topic / Details</th>
                    <th>Priority Level</th>
                    <th>SLA Status</th>
                    <th>Resolve Action</th>
                  </tr>
                </thead>
                <tbody>
                  {supportTickets.map((t) => (
                    <tr key={t.id}>
                      <td>{t.date}</td>
                      <td><b>{t.society}</b></td>
                      <td>{t.subject}</td>
                      <td>
                        <span className={`badge ${t.priority === 'High' ? 'danger' : 'warning'}`}>{t.priority}</span>
                      </td>
                      <td>
                        <span className={`badge ${t.status === 'Resolved' ? 'success' : 'warning'}`}>{t.status}</span>
                      </td>
                      <td>
                        {t.status === 'Open' ? (
                          <button 
                            onClick={() => addToast(`Support agent dispatched to review ticket ID ${t.id}`, 'info')}
                            className="sim-btn sim-btn-primary" 
                            style={{ padding: '4px 8px', fontSize: '0.65rem', width: 'auto' }}
                          >
                            Resolve Ticket
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>No Actions</span>
                        )}
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
          <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)' }}>SaaS Control</h3>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>GLOBAL CONFIG & BILLING</span>
        </div>

        <button 
          className={`desktop-nav-btn ${activeSuperAdminScreen === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveSuperAdminScreen('dashboard')}
        >
          <Database size={16} /> Global Analytics
        </button>

        <button 
          className={`desktop-nav-btn ${activeSuperAdminScreen === 'plans' ? 'active' : ''}`}
          onClick={() => setActiveSuperAdminScreen('plans')}
        >
          <CreditCard size={16} /> Subscription Tiers
        </button>

        <button 
          className={`desktop-nav-btn ${activeSuperAdminScreen === 'tickets' ? 'active' : ''}`}
          onClick={() => setActiveSuperAdminScreen('tickets')}
        >
          <MessageCircle size={16} /> Support Tickets
        </button>
      </div>

      {/* Main Panel Scrolling Area */}
      {renderSuperAdminContent()}
    </div>
  );
}
