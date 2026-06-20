import React, { useState } from 'react';
import { SimProvider, useSim } from './context/SimEngine';
import ResidentApp from './components/ResidentApp';
import SecurityApp from './components/SecurityApp';
import AdminApp from './components/AdminApp';
import SuperAdminApp from './components/SuperAdminApp';
import { 
  Smartphone, Shield, Activity, Users, Settings, Volume2, 
  BellRing, AlertOctagon, Clock, Sparkles, Terminal, Code, HelpCircle,
  CreditCard
} from 'lucide-react';

function MasterSimulator() {
  const {
    userRole,
    setUserRole,
    toasts,
    activeSociety,
    simulateWalkInVisitor,
    triggerSos,
    addNotice,
    generateBulkMaintenanceBills,
    visitors,
    complaints,
    sosActive
  } = useSim();

  // Local log array to track simulation events triggers
  const [simLogs, setSimLogs] = useState([
    { time: '09:00 AM', text: 'SmartSociety SaaS Node Engine initialized.', type: 'info' },
    { time: '09:05 AM', text: 'Royal Orchid Wing A/B/C tenant DB online.', type: 'info' },
    { time: '09:10 AM', text: 'Active Gate 1 Security Terminal sync complete.', type: 'success' }
  ]);

  const addSimLog = (text, type = 'info') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSimLogs((prev) => [{ time, text, type }, ...prev]);
  };

  // Simulation Triggers
  const fireSimWalkIn = () => {
    const guests = [
      { name: 'Karan Johar', purpose: 'Guest', phone: '9988776655' },
      { name: 'Shyam Sundar (Zomato)', purpose: 'Delivery', phone: '9123456789' },
      { name: 'Ramlal (Daily Driver)', purpose: 'Driver', phone: '9876543210' }
    ];
    const picked = guests[Math.floor(Math.random() * guests.length)];
    simulateWalkInVisitor(picked.name, picked.purpose, picked.phone);
    addSimLog(`Walk-in visitor "${picked.name}" arrived at Gate 1 for Flat A-101.`, 'warning');
  };

  const fireSimSos = () => {
    triggerSos('Intruder Break-in / Suspicious Movement');
    addSimLog('SOS Panic Alarm triggered for Unit A-101 (Rajesh Kumar).', 'danger');
  };

  const fireSimNotice = () => {
    const noticesTemplates = [
      { title: 'Emergency Lift Maintenance Wing C', content: 'Lift C will be down for emergency cable replacement between 02:00 PM and 04:00 PM today. Please use main stairs.', cat: 'Important' },
      { title: 'Monsoon Pest Control Treatment', content: 'Anti-insect drainage spray will be done across ground gardens this Saturday starting 08:00 AM. Keep windows shut.', cat: 'General' }
    ];
    const picked = noticesTemplates[Math.floor(Math.random() * noticesTemplates.length)];
    addNotice(picked.title, picked.content, picked.cat);
    addSimLog(`Broadcasted notice: "${picked.title}" to all resident screens.`, 'info');
  };

  const fireSimMaintenanceBill = () => {
    generateBulkMaintenanceBills('July 2026');
    addSimLog('Initiated bulk utility invoice creation (240 active resident accounts).', 'success');
  };

  // Helper mapping for current role labels
  const getRoleHeaderLabel = () => {
    switch (userRole) {
      case 'resident': return '📱 Resident Portal (Mobile View)';
      case 'security': return '🛡️ Security Guard Intercom (Rugged Tablet)';
      case 'admin': return '🏛️ Committee Office (Desktop Panel)';
      case 'superadmin': return '⚙️ SaaS Global Configurations';
      default: return 'SmartSociety Platform';
    }
  };

  return (
    <div className="simulator-layout">
      {/* LEFT: Simulation Control Console */}
      <aside className="sim-controls-sidebar">
        <div className="sim-sidebar-header">
          <h2>SmartSociety 360</h2>
          <p>Multi-Role SaaS Sandbox Simulator</p>
        </div>

        {/* Action Panel triggers */}
        <section className="sim-section">
          <h3>Simulation Control Room</h3>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: '1.4' }}>
            Click triggers below to inject real-time sandbox events and watch how they sync immediately across all apps.
          </p>
          
          <div className="sim-btn-group">
            <button className="sim-btn sim-btn-primary" onClick={fireSimWalkIn}>
              <Users size={16} /> Simulate Gate Arrival
            </button>
            <button className="sim-btn sim-btn-danger" onClick={fireSimSos}>
              <Volume2 size={16} /> Trigger Resident SOS
            </button>
            <button className="sim-btn" onClick={fireSimNotice}>
              <BellRing size={16} /> Broadcast Notice
            </button>
            <button className="sim-btn" onClick={fireSimMaintenanceBill}>
              <CreditCard size={16} /> Bulk Bill Dues
            </button>
          </div>
        </section>

        {/* Live event logs */}
        <section className="sim-section" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Terminal size={14} style={{ color: 'var(--text-tertiary)' }} />
            <h3>Real-Time Event Logs</h3>
          </div>
          <div className="sim-logs-container" style={{ flex: 1 }}>
            {simLogs.map((log, index) => (
              <div key={index} className={`sim-log-item ${log.type}`}>
                <span style={{ fontWeight: 'bold', display: 'block', opacity: 0.6 }}>{log.time}</span>
                {log.text}
              </div>
            ))}
          </div>
        </section>

        {/* Instructions */}
        <section className="sim-section" style={{ borderBottom: 'none', background: '#f8fafc' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '8px', color: 'var(--text-secondary)' }}>
            <HelpCircle size={14} />
            <h4 style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Simulation Guide:</h4>
          </div>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            1. Click <b>"Simulate Gate Arrival"</b>. <br/>
            2. Toggle to <b>"Security Guard"</b> role, check <b>"Pings"</b>.<br/>
            3. Click <b>"Send Intercom Request"</b>.<br/>
            4. Toggle to <b>"Resident Portal"</b>, approve/deny the alert card.<br/>
            5. See results instantly update!
          </p>
        </section>
      </aside>

      {/* RIGHT: Master Workspace Area */}
      <main className="sim-main-content">
        {/* Workspace Role Switcher Navbar */}
        <header className="role-switcher-header">
          <div className="society-info-banner">
            <span>Property: {activeSociety}</span>
            <span className="society-badge">SaaS Client</span>
          </div>

          {/* Role selection tab bar */}
          <div className="role-switcher-tabs">
            <button 
              className={`role-tab ${userRole === 'resident' ? 'active' : ''}`}
              onClick={() => {
                setUserRole('resident');
                addSimLog('Switched viewpoint to Resident Mobile Portal.', 'info');
              }}
            >
              <Smartphone size={14} /> Resident App
            </button>
            <button 
              className={`role-tab ${userRole === 'security' ? 'active' : ''}`}
              onClick={() => {
                setUserRole('security');
                addSimLog('Switched viewpoint to Security Guard Intercom.', 'info');
              }}
            >
              <Shield size={14} /> Guard App
            </button>
            <button 
              className={`role-tab ${userRole === 'admin' ? 'active' : ''}`}
              onClick={() => {
                setUserRole('admin');
                addSimLog('Switched viewpoint to Committee Admin Dashboard.', 'info');
              }}
            >
              <Users size={14} /> Admin Panel
            </button>
            <button 
              className={`role-tab ${userRole === 'superadmin' ? 'active' : ''}`}
              onClick={() => {
                setUserRole('superadmin');
                addSimLog('Switched viewpoint to SaaS Owner Console.', 'info');
              }}
            >
              <Settings size={14} /> Super Admin
            </button>
          </div>
        </header>

        {/* Viewport heading */}
        <div style={{ padding: '24px 32px 0 32px', background: 'var(--bg-main)' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{getRoleHeaderLabel()}</h2>
        </div>

        {/* Active viewport component renderer */}
        <div className="active-workspace">
          {userRole === 'resident' && <ResidentApp />}
          {userRole === 'security' && <SecurityApp />}
          {userRole === 'admin' && <AdminApp />}
          {userRole === 'superadmin' && <SuperAdminApp />}
        </div>
      </main>

      {/* Floating System Notifications (Toasts) */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            <Sparkles size={16} style={{ color: 'inherit', marginTop: '2px', flexShrink: 0 }} />
            <div className="toast-msg">{t.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      hasError: true,
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', fontFamily: 'monospace', background: '#fee2e2', color: '#991b1b', height: '100vh', overflow: 'auto' }}>
          <h2 style={{ marginBottom: '16px' }}>🚨 Application Crashed (React Error Boundary)</h2>
          <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{this.state.error && this.state.error.toString()}</p>
          <pre style={{ background: '#fca5a5', padding: '16px', borderRadius: '8px', marginTop: '16px', whiteSpace: 'pre-wrap' }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <SimProvider>
        <MasterSimulator />
      </SimProvider>
    </ErrorBoundary>
  );
}
