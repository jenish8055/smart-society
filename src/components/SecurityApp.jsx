import React, { useState } from 'react';
import { useSim } from '../context/SimEngine';
import { 
  ShieldAlert, QrCode, Phone, UserPlus, AlertCircle, FileText, Check, X, 
  Video, Eye, RefreshCw, Send, AlertTriangle, ShieldCheck, Heart, Shield
} from 'lucide-react';

export default function SecurityApp() {
  const {
    activeSecurityScreen,
    setActiveSecurityScreen,
    visitors,
    setVisitors,
    sosActive,
    triggerSos,
    clearSos,
    incomingApprovalRequest,
    respondToVisitorRequest,
    addToast
  } = useSim();

  // Screen layout state
  const [scanResult, setScanResult] = useState(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [mockQrInput, setMockQrInput] = useState('');
  
  // Walk-in form states
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinPurpose, setWalkinPurpose] = useState('Guest');
  const [walkinUnit, setWalkinUnit] = useState('A-101');
  const [walkinVehicle, setWalkinVehicle] = useState('');
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [capturingPhoto, setCapturingPhoto] = useState(false);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState('');

  // Auto trigger photo capture simulator
  const handleCapturePhoto = () => {
    setCapturingPhoto(true);
    setTimeout(() => {
      const mockPhotos = [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop',
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&h=120&fit=crop',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop'
      ];
      const randomPhoto = mockPhotos[Math.floor(Math.random() * mockPhotos.length)];
      setCapturedPhotoUrl(randomPhoto);
      setPhotoCaptured(true);
      setCapturingPhoto(false);
      addToast('Visitor photo captured successfully.', 'success');
    }, 1200);
  };

  // Register Walk-in visitor
  const handleWalkinSubmit = (e) => {
    e.preventDefault();
    if (!walkinName || !walkinPhone) {
      alert('Please enter visitor name and mobile phone');
      return;
    }

    const newVisitor = {
      id: 'walk_' + Date.now(),
      name: walkinName,
      mobile: walkinPhone,
      purpose: walkinPurpose,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      vehicleNumber: walkinVehicle || 'None',
      residentUnit: walkinUnit,
      photoUrl: capturedPhotoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      entryTime: '',
      exitTime: '',
      type: walkinPurpose,
      qrCode: ''
    };

    setVisitors(prev => [newVisitor, ...prev]);
    respondToVisitorRequest(newVisitor.id, null); // Set status to sync context
    
    // Simulate push alert to resident
    addToast(`🔔 Pinged Resident in Unit ${walkinUnit} for approval.`, 'info');
    setActiveSecurityScreen('approvals');

    // Clear form
    setWalkinName('');
    setWalkinPhone('');
    setPhotoCaptured(false);
    setCapturedPhotoUrl('');
  };

  // QR scan verification
  const handleScanCode = (codeToScan) => {
    setScannerActive(true);
    setScanResult(null);
    
    setTimeout(() => {
      const match = visitors.find(v => v.qrCode && v.qrCode.toLowerCase() === codeToScan.toLowerCase());
      
      if (match) {
        if (match.status === 'Pre-Approved') {
          // Log the entry time automatically
          setVisitors(prev => prev.map(v => v.id === match.id ? {
            ...v,
            status: 'Approved',
            entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          } : v));
          setScanResult({
            success: true,
            msg: `ACCESS GRANTED! Pre-Approved ${match.purpose} verified for Unit ${match.residentUnit}.`,
            visitor: match
          });
          addToast(`✅ QR Verified! Access granted to ${match.name}.`, 'success');
        } else {
          setScanResult({
            success: false,
            msg: `Access Blocked: QR code exists but status is "${match.status}".`
          });
        }
      } else {
        setScanResult({
          success: false,
          msg: 'ACCESS DENIED! Invalid or expired QR Code record.'
        });
        addToast(`❌ Invalid QR scan attempt logged.`, 'danger');
      }
      setScannerActive(false);
    }, 1500);
  };

  const activeRequests = visitors.filter(v => v.status === 'Pending');

  const renderSecurityScreen = () => {
    switch (activeSecurityScreen) {
      case 'dashboard':
        return (
          <div className="phone-screen-content animate-fade-in" style={{ padding: '12px' }}>
            {/* Header Guard profile */}
            <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>ACTIVE GATE: GATE 1</span>
                <h4 style={{ fontSize: '0.95rem' }}>Guard Sunil Dutt</h4>
              </div>
              <span className="badge success">On Duty</span>
            </div>

            {/* Quick counters */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
              <div className="premium-card" style={{ textAlign: 'center', padding: '12px 8px' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', display: 'block', color: 'var(--primary)' }}>
                  {visitors.filter(v => v.entryTime && !v.exitTime).length}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Visitors Inside</span>
              </div>
              <div 
                className="premium-card" 
                style={{ textAlign: 'center', padding: '12px 8px', cursor: 'pointer', border: activeRequests.length > 0 ? '1px solid var(--warning)' : '1px solid var(--border-light)' }}
                onClick={() => setActiveSecurityScreen('approvals')}
              >
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', display: 'block', color: activeRequests.length > 0 ? 'var(--warning)' : 'var(--text-secondary)' }}>
                  {activeRequests.length}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Pending Pings</span>
              </div>
            </div>

            {/* Guard Quick Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <button 
                onClick={() => setActiveSecurityScreen('scanner')}
                className="sim-btn sim-btn-primary" 
                style={{ justifyContent: 'center', padding: '14px' }}
              >
                <QrCode size={18} /> Scan Visitor QR Code
              </button>

              <button 
                onClick={() => setActiveSecurityScreen('walkin')}
                className="sim-btn" 
                style={{ justifyContent: 'center', padding: '14px' }}
              >
                <UserPlus size={18} /> Register Walk-In Visitor
              </button>

              <button 
                onClick={() => setActiveSecurityScreen('emergency')}
                className="sim-btn sim-btn-danger" 
                style={{ justifyContent: 'center', padding: '14px' }}
              >
                <ShieldAlert size={18} /> SOS Panic Alarms
              </button>
            </div>

            {/* Logs snippet */}
            <div className="premium-card" style={{ marginTop: '10px' }}>
              <h5 style={{ fontSize: '0.75rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>Recent Entry Logs</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {visitors.slice(0, 3).map((v, i) => (
                  <div key={i} style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', padding: '4px 0', borderBottom: '1px solid var(--bg-main)' }}>
                    <span>{v.name} ({v.residentUnit})</span>
                    <span style={{ fontWeight: 'bold', color: v.status === 'Approved' ? 'var(--success)' : 'var(--danger)' }}>{v.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'walkin':
        return (
          <div className="phone-screen-content animate-fade-in" style={{ padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button className="sim-btn" onClick={() => setActiveSecurityScreen('dashboard')} style={{ padding: '4px', width: 'auto' }}><X size={16} /></button>
              <h4 style={{ fontSize: '1rem' }}>Walk-In Registration</h4>
            </div>

            <form onSubmit={handleWalkinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '12px', border: '2px dashed var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', overflow: 'hidden' }}>
                  {photoCaptured ? (
                    <img src={capturedPhotoUrl} alt="Captured Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Video size={24} style={{ color: 'var(--text-tertiary)' }} />
                  )}
                </div>
                <div>
                  <button 
                    type="button" 
                    className="sim-btn" 
                    onClick={handleCapturePhoto}
                    disabled={capturingPhoto}
                    style={{ fontSize: '0.7rem', padding: '6px 10px', width: 'auto' }}
                  >
                    {capturingPhoto ? 'Capturing...' : photoCaptured ? 'Retake Photo' : 'Capture Camera Photo'}
                  </button>
                  <p style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>Face recognition check automatically pings database.</p>
                </div>
              </div>

              <div className="form-group">
                <label>VISITOR NAME</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Visitor's name"
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>MOBILE NUMBER</label>
                <input 
                  type="tel" 
                  className="form-input" 
                  placeholder="10-digit number"
                  maxLength={10}
                  value={walkinPhone}
                  onChange={(e) => setWalkinPhone(e.target.value.replace(/\D/g, ''))}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="form-group">
                  <label>DESTINATION UNIT</label>
                  <select 
                    className="form-input" 
                    value={walkinUnit}
                    onChange={(e) => setWalkinUnit(e.target.value)}
                    style={{ appearance: 'auto' }}
                  >
                    <option value="A-101">A-101 (Kumar R)</option>
                    <option value="A-102">A-102 (Sharma D)</option>
                    <option value="B-204">B-204 (Roy J)</option>
                    <option value="C-501">C-501 (Patel S)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>VISITOR TYPE</label>
                  <select 
                    className="form-input" 
                    value={walkinPurpose}
                    onChange={(e) => setWalkinPurpose(e.target.value)}
                    style={{ appearance: 'auto' }}
                  >
                    <option value="Guest">Guest</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Maid">Maid/Help</option>
                    <option value="Driver">Driver</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>VEHICLE NUMBER (OPTIONAL)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. MH-02-XY-1234"
                  value={walkinVehicle}
                  onChange={(e) => setWalkinVehicle(e.target.value.toUpperCase())}
                />
              </div>

              <button type="submit" className="form-submit-btn" style={{ marginTop: '10px' }}>
                Send Resident Approval Intercom Request
              </button>
            </form>
          </div>
        );

      case 'scanner':
        // Find a valid pre-approved code to suggest for ease of simulation
        const samplePreCode = visitors.find(v => v.status === 'Pre-Approved')?.qrCode || 'QR_PRE_4422';
        return (
          <div className="phone-screen-content animate-fade-in" style={{ padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button className="sim-btn" onClick={() => setActiveSecurityScreen('dashboard')} style={{ padding: '4px', width: 'auto' }}><X size={16} /></button>
                <h4 style={{ fontSize: '1rem' }}>Scan QR Code</h4>
              </div>
              <span className="badge info">Gate 1 Scanner</span>
            </div>

            <div className="scanner-viewport" style={{ marginTop: '12px' }}>
              <div className="scanner-line"></div>
              {scannerActive ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <RefreshCw className="animate-spin" size={24} />
                  <span style={{ fontSize: '0.7rem' }}>Checking database ledger...</span>
                </div>
              ) : (
                <div className="scanner-focus-box"></div>
              )}
            </div>

            {/* Test input simulator */}
            <div className="premium-card" style={{ marginTop: '16px' }}>
              <h5 style={{ fontSize: '0.75rem', marginBottom: '8px' }}>Simulate QR Scanner Feed</h5>
              <p style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
                Enter or select a code. Pre-approved mock code: <b>{samplePreCode}</b>
              </p>
              
              <div style={{ display: 'flex', gap: '6px' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter QR text..."
                  value={mockQrInput}
                  onChange={(e) => setMockQrInput(e.target.value.toUpperCase())}
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.75rem' }}
                />
                <button 
                  onClick={() => handleScanCode(mockQrInput || samplePreCode)}
                  className="sim-btn sim-btn-primary" 
                  style={{ width: 'auto', padding: '8px 12px', fontSize: '0.75rem' }}
                  disabled={scannerActive}
                >
                  Scan Code
                </button>
              </div>

              {scanResult && (
                <div 
                  className="premium-card animate-slide-up" 
                  style={{ 
                    marginTop: '12px', 
                    background: scanResult.success ? 'var(--success-light)' : 'var(--danger-light)',
                    color: scanResult.success ? 'var(--success-dark)' : 'var(--danger-dark)',
                    border: 'none',
                    padding: '12px'
                  }}
                >
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {scanResult.success ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
                    <h5 style={{ fontSize: '0.85rem' }}>{scanResult.success ? 'Success' : 'Denied'}</h5>
                  </div>
                  <p style={{ fontSize: '0.7rem', marginTop: '6px', fontWeight: '500' }}>{scanResult.msg}</p>
                  
                  {scanResult.success && scanResult.visitor && (
                    <div style={{ marginTop: '8px', fontSize: '0.65rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '6px' }}>
                      <b>Visitor:</b> {scanResult.visitor.name} ({scanResult.visitor.purpose}) <br/>
                      <b>Allowed Unit:</b> {scanResult.visitor.residentUnit}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'approvals':
        return (
          <div className="phone-screen-content animate-fade-in" style={{ padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button className="sim-btn" onClick={() => setActiveSecurityScreen('dashboard')} style={{ padding: '4px', width: 'auto' }}><X size={16} /></button>
              <h4 style={{ fontSize: '1rem' }}>Resident Intercom Requests</h4>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Lists active pings sent to residents waiting for gate clearance.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
              {activeRequests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-tertiary)' }}>
                  <Shield size={36} style={{ margin: '0 auto 12px auto', display: 'block' }} />
                  <span style={{ fontSize: '0.75rem' }}>No pending approval requests. Gate is secure.</span>
                </div>
              ) : (
                activeRequests.map((req) => (
                  <div key={req.id} className="premium-card" style={{ borderLeft: '4px solid var(--warning)' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                      <img src={req.photoUrl} alt="Visitor" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div>
                        <h4 style={{ fontSize: '0.85rem' }}>{req.name}</h4>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Visiting Unit <b>{req.residentUnit}</b></span>
                      </div>
                    </div>
                    
                    <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '8px', fontSize: '0.65rem', marginBottom: '10px' }}>
                      Purpose: {req.purpose} | Phone: {req.mobile}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => respondToVisitorRequest(req.id, false)}
                        className="sim-btn sim-btn-danger" 
                        style={{ padding: '6px', fontSize: '0.7rem', flex: 1, justifyContent: 'center' }}
                      >
                        <X size={12} /> Deny Manual
                      </button>
                      <button 
                        onClick={() => respondToVisitorRequest(req.id, true)}
                        className="sim-btn sim-btn-primary" 
                        style={{ padding: '6px', fontSize: '0.7rem', flex: 1, justifyContent: 'center' }}
                      >
                        <Check size={12} /> Approve Manual
                      </button>
                    </div>

                    <button 
                      onClick={() => addToast(`📞 Dialing Resident intercom for Unit ${req.residentUnit}... (Calling Rajesh Kumar)`, 'info')}
                      className="sim-btn" 
                      style={{ fontSize: '0.7rem', width: '100%', marginTop: '6px', justifyContent: 'center' }}
                    >
                      <Phone size={12} /> Call Intercom
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'emergency':
        return (
          <div className="phone-screen-content animate-fade-in" style={{ padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button className="sim-btn" onClick={() => setActiveSecurityScreen('dashboard')} style={{ padding: '4px', width: 'auto' }}><X size={16} /></button>
              <h4 style={{ fontSize: '1rem' }}>Emergency Hub</h4>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Pressing these alerts triggers high-priority warning signals and broadcasts notification logs across society panels.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button 
                onClick={() => triggerSos('Fire Accident')}
                className="sim-btn-danger" 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '20px', borderRadius: '16px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 16px rgba(239, 68, 68, 0.2)' }}
              >
                <AlertTriangle size={24} />
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>FIRE EMERGENCY</span>
              </button>

              <button 
                onClick={() => triggerSos('Medical Ambulance')}
                className="sim-btn" 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '20px', borderRadius: '16px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)' }}
              >
                <Heart size={24} />
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>MEDICAL / AMBULANCE</span>
              </button>

              <button 
                onClick={() => triggerSos('Police Security Intruder')}
                className="sim-btn" 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '20px', borderRadius: '16px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)', color: 'white', boxShadow: '0 8px 16px rgba(30, 58, 138, 0.2)' }}
              >
                <Shield size={24} />
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>POLICE / INTRUDER</span>
              </button>
            </div>
            
            {sosActive && (
              <div className="premium-card animate-pulse" style={{ marginTop: '20px', background: 'var(--danger-light)', border: '1px solid var(--danger)', padding: '14px' }}>
                <h5 style={{ fontSize: '0.8rem', color: 'var(--danger-dark)', fontWeight: 'bold' }}>🚨 ACTIVE PANIC EMERGENCY</h5>
                <p style={{ fontSize: '0.7rem', color: 'var(--danger-dark)', marginTop: '4px' }}>Siren alerts sent to Resident dashboard and Committee desks.</p>
                <button 
                  onClick={clearSos} 
                  className="sim-btn" 
                  style={{ fontSize: '0.7rem', width: 'auto', padding: '4px 10px', marginTop: '10px', backgroundColor: 'white', color: 'var(--danger-dark)', border: '1px solid var(--danger)' }}
                >
                  Clear SOS
                </button>
              </div>
            )}
          </div>
        );

      default:
        return <div>Screen not found</div>;
    }
  };

  return (
    <div className="device-container rugged animate-fade-in" style={{ zIndex: 10 }}>
      {/* Speaker grill */}
      <div style={{ width: '60px', height: '6px', background: '#334155', borderRadius: '3px', margin: '0 auto 12px auto' }}></div>

      <div className="device-screen" style={{ backgroundColor: '#fdfdfd' }}>
        {/* Guard status top notification banner */}
        <div style={{ background: '#1e293b', color: '#cbd5e1', padding: '8px 12px', display: 'flex', justifyItems: 'center', justifyContent: 'space-between', fontSize: '0.65rem' }}>
          <span>🏢 SMART_GATE SECURITY APP v4.0</span>
          <span>ONLINE</span>
        </div>

        {/* Display Screens */}
        {renderSecurityScreen()}

        {/* SOS Panic Overlay when active */}
        {sosActive && activeSecurityScreen !== 'emergency' && (
          <div className="sos-overlay">
            <div className="sos-icon-pulse">
              <ShieldAlert size={48} />
            </div>
            <h2 style={{ color: 'white', fontSize: '1.6rem', fontWeight: 800 }}>PANIC ALARM STROBE</h2>
            <p style={{ fontSize: '0.85rem', marginTop: '10px', color: 'white' }}>
              Emergency SOS reported. Gate lights flashed.
            </p>
            <button 
              onClick={clearSos}
              className="sim-btn" 
              style={{ backgroundColor: 'white', color: 'var(--danger)', border: 'none', padding: '10px 20px', borderRadius: '12px', marginTop: '24px', fontWeight: 'bold' }}
            >
              Acknowledge & Mute Alarm
            </button>
          </div>
        )}

        {/* Rugged Guard Phone bottom nav */}
        <div className="phone-bottom-nav" style={{ borderTop: '2px solid #cbd5e1', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <button 
            className={`phone-nav-item ${activeSecurityScreen === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSecurityScreen('dashboard')}
          >
            <Shield size={18} />
            <span>Guard Desk</span>
          </button>
          <button 
            className={`phone-nav-item ${activeSecurityScreen === 'approvals' ? 'active' : ''}`}
            onClick={() => setActiveSecurityScreen('approvals')}
          >
            <Phone size={18} />
            <span>Pings</span>
          </button>
          <button 
            className={`phone-nav-item ${activeSecurityScreen === 'emergency' ? 'active' : ''}`}
            onClick={() => setActiveSecurityScreen('emergency')}
          >
            <AlertTriangle size={18} />
            <span>Panic SOS</span>
          </button>
        </div>
      </div>
    </div>
  );
}
