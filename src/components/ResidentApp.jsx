import React, { useState, useEffect } from 'react';
import { useSim } from '../context/SimEngine';
import {
  Bell, QrCode, CreditCard, AlertTriangle, FileText, Calendar, Vote,
  BookOpen, Plus, Send, Check, X, ShieldAlert, User, LogOut, Search,
  Clock, ArrowRight, Sparkles, MapPin, Download, Share2, Upload, MessageSquare
} from 'lucide-react';

export default function ResidentApp() {
  const {
    activeResidentScreen,
    setActiveResidentScreen,
    currentResident,
    setCurrentResident,
    visitors,
    setVisitors,
    complaints,
    submitComplaint,
    maintenanceDues,
    payMaintenanceBill,
    notices,
    events,
    polls,
    submitVote,
    documents,
    facilityBookings,
    bookFacility,
    incomingApprovalRequest,
    respondToVisitorRequest,
    getAiChatbotReply,
    addToast
  } = useSim();

  // Screen layout state
  const [activeTab, setActiveTab] = useState('home'); // home, visitors, services, profile
  const [loginPhone, setLoginPhone] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [loginStep, setLoginStep] = useState(1); // 1: phone, 2: otp
  
  // Notice details modal
  const [selectedNotice, setSelectedNotice] = useState(null);
  
  // Event details modal
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Visitor Details modal
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  // Document details viewer
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Facility Details state
  const [bookingFacility, setBookingFacility] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSlot, setBookingSlot] = useState('06:00 PM - 09:00 PM');

  // Visitor registration state
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorType, setVisitorType] = useState('Guest');
  const [visitorVehicle, setVisitorVehicle] = useState('');
  const [generatedQr, setGeneratedQr] = useState(null);

  // Complaint form state
  const [complaintCategory, setComplaintCategory] = useState('Water');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintPriority, setComplaintPriority] = useState('Medium');
  const [complaintLoc, setComplaintLoc] = useState('');
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  // Floating AI Chat state
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMsgInput, setAiMsgInput] = useState('');
  const [aiMessages, setAiMessages] = useState([
    { sender: 'system', text: 'Hello! I am your Resident AI Concierge. Ask me anything about maintenance, visitors, or complaints!' }
  ]);

  // Handle splash screen timer
  useEffect(() => {
    if (activeResidentScreen === 'splash') {
      const timer = setTimeout(() => {
        setActiveResidentScreen('login');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [activeResidentScreen]);

  // Auto route bottom bar tabs to correct screens
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') setActiveResidentScreen('home');
    else if (tab === 'visitors') setActiveResidentScreen('myVisitors');
    else if (tab === 'services') setActiveResidentScreen('servicesMenu');
    else if (tab === 'profile') setActiveResidentScreen('profile');
  };

  // Login handlers
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!loginPhone || loginPhone.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoginStep(2);
    addToast('OTP Sent successfully to +91 ' + loginPhone + ' (Use 1234 to verify)', 'info');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (loginOtp === '1234') {
      setActiveResidentScreen('selectSociety');
    } else {
      alert('Invalid OTP. Please enter 1234 for simulation.');
    }
  };

  // Pre-approve visitor QR generation
  const handlePreApprove = (e) => {
    e.preventDefault();
    if (!visitorName || !visitorPhone) {
      alert('Please fill out Name and Phone number');
      return;
    }
    
    const qrCodeVal = `QR_PRE_${Math.floor(10000 + Math.random() * 90000)}`;
    const newPreVisitor = {
      id: 'pre_' + Date.now(),
      name: visitorName,
      mobile: visitorPhone,
      purpose: visitorType,
      status: 'Pre-Approved',
      date: new Date().toISOString().split('T')[0],
      time: 'Planned Entry',
      vehicleNumber: visitorVehicle || 'None',
      residentUnit: currentResident.unit,
      photoUrl: '',
      entryTime: '',
      exitTime: '',
      type: visitorType,
      qrCode: qrCodeVal
    };

    setVisitors(prev => [newPreVisitor, ...prev]);
    setGeneratedQr(newPreVisitor);
    setActiveResidentScreen('visitorQrView');
    addToast(`QR Code generated for Pre-Approved ${visitorType} "${visitorName}"`, 'success');
    
    // Clear forms
    setVisitorName('');
    setVisitorPhone('');
    setVisitorVehicle('');
  };

  // AI assist categories recommendation
  const handleComplaintDescChange = (val) => {
    setComplaintDesc(val);
    if (val.length > 8) {
      setAiAnalyzing(true);
      const text = val.toLowerCase();
      // AI Priority & Category detection simulation
      setTimeout(() => {
        if (text.includes('leak') || text.includes('water') || text.includes('plumb')) {
          setComplaintCategory('Water');
          setComplaintPriority(text.includes('flood') || text.includes('burst') ? 'High' : 'Medium');
        } else if (text.includes('lift') || text.includes('elevator') || text.includes('stuck')) {
          setComplaintCategory('Lift');
          setComplaintPriority(text.includes('stuck') || text.includes('grind') ? 'High' : 'Medium');
        } else if (text.includes('spark') || text.includes('electricity') || text.includes('power') || text.includes('short')) {
          setComplaintCategory('Electricity');
          setComplaintPriority(text.includes('shock') || text.includes('short') || text.includes('dark') ? 'High' : 'Medium');
        } else if (text.includes('dirty') || text.includes('garbage') || text.includes('clean')) {
          setComplaintCategory('Cleaning');
          setComplaintPriority('Low');
        } else if (text.includes('guard') || text.includes('stranger') || text.includes('thief')) {
          setComplaintCategory('Security');
          setComplaintPriority('High');
        }
        setAiAnalyzing(false);
      }, 800);
    }
  };

  const handleRaiseComplaintSubmit = (e) => {
    e.preventDefault();
    if (!complaintDesc) {
      alert('Please describe your complaint');
      return;
    }
    submitComplaint(complaintCategory, complaintDesc, complaintPriority, complaintLoc);
    setActiveResidentScreen('complaintsList');
    setComplaintDesc('');
    setComplaintLoc('');
  };

  // Booking submit
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingDate) {
      alert('Please pick a date');
      return;
    }
    bookFacility(bookingFacility.title, bookingDate, bookingSlot);
    setActiveResidentScreen('bookingHistory');
  };

  // Send message to AI Chatbox
  const handleAiSend = (e) => {
    e.preventDefault();
    if (!aiMsgInput.trim()) return;
    
    const userMsg = { sender: 'user', text: aiMsgInput };
    setAiMessages(prev => [...prev, userMsg]);
    setAiMsgInput('');

    setTimeout(() => {
      const responseText = getAiChatbotReply(userMsg.text);
      setAiMessages(prev => [...prev, { sender: 'system', text: responseText }]);
    }, 600);
  };

  // Renders the correct screen inside the mobile mock
  const renderScreen = () => {
    switch (activeResidentScreen) {
      case 'splash':
        return (
          <div className="phone-screen-content animate-fade-in" style={{ justifyContent: 'center', alignItems: 'center', height: '100%', background: 'var(--primary-gradient)', color: 'white' }}>
            <div className="animate-splash" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '24px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                <ShieldAlert size={48} style={{ color: 'var(--primary)' }} />
              </div>
              <h2 style={{ color: 'white', fontSize: '1.8rem', fontWeight: 800 }}>SmartSociety</h2>
              <span style={{ fontSize: '0.75rem', opacity: 0.8, letterSpacing: '0.05em' }}>GATEKEEPER SUITE v3.1</span>
            </div>
            <div style={{ position: 'absolute', bottom: '40px', fontSize: '0.7rem', opacity: 0.6 }}>
              Checking app version & autologin...
            </div>
          </div>
        );

      case 'login':
        return (
          <div className="phone-screen-content animate-fade-in" style={{ padding: '24px' }}>
            <div style={{ marginTop: '40px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome!</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Login to access your society portal</p>
            </div>

            {loginStep === 1 ? (
              <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label>MOBILE NUMBER</label>
                  <input
                    type="tel"
                    placeholder="Enter 10 digit number"
                    className="form-input"
                    maxLength={10}
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <button type="submit" className="form-submit-btn">GET Verification OTP</button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '12px 0' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-light)' }}></div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>OR LOGIN VIA</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-light)' }}></div>
                </div>
                <button type="button" className="sim-btn" onClick={() => setActiveResidentScreen('selectSociety')} style={{ justifyContent: 'center' }}>
                  Demo Auto Login (Skip OTP)
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Enter the 4-digit code sent to <b>+91 {loginPhone}</b>
                </p>
                <div className="form-group">
                  <label>OTP CODE</label>
                  <input
                    type="password"
                    placeholder="Enter 1234 to bypass"
                    className="form-input"
                    maxLength={4}
                    value={loginOtp}
                    onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, ''))}
                    style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '1.2rem', fontWeight: 'bold' }}
                  />
                </div>
                <button type="submit" className="form-submit-btn">Verify & Continue</button>
                <button type="button" className="sim-btn" onClick={() => setLoginStep(1)} style={{ justifyContent: 'center' }}>
                  Back to mobile entry
                </button>
              </form>
            )}
          </div>
        );

      case 'selectSociety':
        return (
          <div className="phone-screen-content animate-fade-in">
            <div style={{ margin: '16px 0' }}>
              <h3 style={{ fontSize: '1.4rem' }}>Select Society</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Choose your registered property unit</p>
            </div>
            
            <div className="form-group" style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '34px', color: 'var(--text-tertiary)' }} />
              <input type="text" className="form-input" placeholder="Search society..." style={{ paddingLeft: '36px' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div 
                className="premium-card" 
                style={{ cursor: 'pointer', borderLeft: '4px solid var(--primary)' }}
                onClick={() => {
                  setActiveResidentScreen('home');
                  setActiveTab('home');
                }}
              >
                <h4 style={{ fontSize: '0.9rem' }}>Royal Orchid Residency</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Wing A, flat 101, Mumbai</p>
                <span className="badge success" style={{ marginTop: '8px' }}>Approved Resident</span>
              </div>

              <div className="premium-card" style={{ opacity: 0.6 }}>
                <h4 style={{ fontSize: '0.9rem' }}>Green Meadows Co-op</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Pending Unit request B-402</p>
                <span className="badge warning" style={{ marginTop: '8px' }}>Verification Pending</span>
              </div>
            </div>

            <div style={{ flex: 1 }}></div>
            <button className="sim-btn" style={{ justifyContent: 'center', borderColor: 'var(--primary)', color: 'var(--primary)' }}>
              + Add / Join New Society
            </button>
          </div>
        );

      case 'home':
        const unpaidBills = maintenanceDues.filter(m => m.status === 'Unpaid');
        return (
          <div className="phone-screen-content animate-fade-in">
            {/* Header Greeting */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Good Morning,</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{currentResident.name}</h3>
              </div>
              <button 
                onClick={() => addToast('🔔 Checking for new notification broadcasts...', 'info')}
                style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'white', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <Bell size={18} style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>

            {/* Outstanding dues card */}
            {unpaidBills.length > 0 ? (
              <div className="premium-card primary" style={{ position: 'relative', overflow: 'hidden' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.9 }}>Outstanding Dues</span>
                <h2 style={{ fontSize: '2rem', margin: '4px 0', color: 'white' }}>₹{unpaidBills.reduce((acc, b) => acc + b.dueAmount, 0)}</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Due on: {unpaidBills[0].dueDate}</span>
                  <button 
                    onClick={() => setActiveResidentScreen('maintenance')}
                    className="sim-btn" 
                    style={{ background: 'white', border: 'none', color: 'var(--primary)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold' }}
                  >
                    Pay Bill <ArrowRight size={14} style={{ display: 'inline', marginLeft: '4px' }} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="premium-card" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', border: 'none', color: '#065f46' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#065f46' }}>All Clear! 🎉</h4>
                <p style={{ fontSize: '0.75rem', color: '#065f46', marginTop: '4px' }}>Maintenance bills are paid fully. No outstanding dues.</p>
              </div>
            )}

            {/* Quick Actions Grid */}
            <div>
              <h4 style={{ fontSize: '0.85rem', marginBottom: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>Quick Actions</h4>
              <div className="quick-actions-grid">
                <button className="quick-action-btn" onClick={() => setActiveResidentScreen('visitorEntry')}>
                  <div className="quick-icon-wrapper indigo"><QrCode size={20} /></div>
                  <span>Add Visitor</span>
                </button>
                <button className="quick-action-btn" onClick={() => setActiveResidentScreen('maintenance')}>
                  <div className="quick-icon-wrapper emerald"><CreditCard size={20} /></div>
                  <span>Maintenance</span>
                </button>
                <button className="quick-action-btn" onClick={() => setActiveResidentScreen('complaintRaise')}>
                  <div className="quick-icon-wrapper rose"><AlertTriangle size={20} /></div>
                  <span>Complaints</span>
                </button>
                <button className="quick-action-btn" onClick={() => setActiveResidentScreen('facilityList')}>
                  <div className="quick-icon-wrapper amber"><Calendar size={20} /></div>
                  <span>Bookings</span>
                </button>
                <button className="quick-action-btn" onClick={() => setActiveResidentScreen('noticesList')}>
                  <div className="quick-icon-wrapper cyan"><Bell size={20} /></div>
                  <span>Notices</span>
                </button>
                <button className="quick-action-btn" onClick={() => setActiveResidentScreen('documentsList')}>
                  <div className="quick-icon-wrapper indigo"><BookOpen size={20} /></div>
                  <span>Docs</span>
                </button>
              </div>
            </div>

            {/* Notices feed snippet */}
            <div className="premium-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Latest Notice</h4>
                <button onClick={() => setActiveResidentScreen('noticesList')} style={{ border: 'none', background: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>View All</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h5 style={{ fontSize: '0.85rem' }}>{notices[0].title}</h5>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{notices[0].content}</p>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Published {notices[0].date}</span>
              </div>
            </div>

            {/* Active Poll banner */}
            <div className="premium-card" style={{ borderLeft: '4px solid var(--warning)' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                <Vote size={18} style={{ color: 'var(--warning)' }} />
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ACTIVE SOCIETY POLL</h4>
              </div>
              <h5 style={{ fontSize: '0.85rem', marginBottom: '8px' }}>{polls[0].question}</h5>
              <button 
                onClick={() => setActiveResidentScreen('pollsList')}
                className="form-submit-btn" 
                style={{ background: 'var(--warning-gradient)', fontSize: '0.75rem', padding: '8px' }}
              >
                Cast Your Vote
              </button>
            </div>
          </div>
        );

      case 'visitorEntry':
        return (
          <div className="phone-screen-content animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button className="sim-btn" onClick={() => setActiveResidentScreen('home')} style={{ padding: '6px', width: 'auto' }}><X size={16} /></button>
              <h3 style={{ fontSize: '1.2rem' }}>Visitor Pre-Approval</h3>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Generate a secure QR code for guests, relatives, or delivery agents to bypass manual verification at the gate.
            </p>

            <form onSubmit={handlePreApprove} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label>VISITOR NAME</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. John Doe"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label>MOBILE NUMBER</label>
                <input 
                  type="tel" 
                  className="form-input" 
                  placeholder="Enter 10-digit number"
                  maxLength={10}
                  value={visitorPhone}
                  onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                  onChange={(e) => setVisitorPhone(e.target.value.replace(/\D/g, ''))}
                />
              </div>

              <div className="form-group">
                <label>VISITOR TYPE</label>
                <select 
                  className="form-input" 
                  value={visitorType}
                  onChange={(e) => setVisitorType(e.target.value)}
                  style={{ appearance: 'auto' }}
                >
                  <option value="Guest">Guest</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Maid">Maid/Daily Help</option>
                  <option value="Driver">Driver</option>
                  <option value="Relative">Relative</option>
                </select>
              </div>

              <div className="form-group">
                <label>VEHICLE NUMBER (OPTIONAL)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. MH-02-AB-1234"
                  value={visitorVehicle}
                  onChange={(e) => setVisitorVehicle(e.target.value.toUpperCase())}
                />
              </div>

              <button type="submit" className="form-submit-btn">Generate Security QR</button>
            </form>
          </div>
        );

      case 'visitorQrView':
        return (
          <div className="phone-screen-content animate-fade-in" style={{ alignItems: 'center', justifyContent: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Visitor QR Code</h3>
            
            {generatedQr && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{ padding: '16px', background: 'white', borderRadius: '16px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <QrCode size={180} style={{ color: 'var(--text-primary)' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>{generatedQr.qrCode}</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ fontSize: '1rem' }}>{generatedQr.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Type: {generatedQr.purpose} | Vehicle: {generatedQr.vehicleNumber}</p>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                  <button className="sim-btn" onClick={() => addToast('📄 Mock Download PDF triggered', 'success')} style={{ flex: 1, justifyContent: 'center' }}>
                    <Download size={16} /> Save
                  </button>
                  <button className="sim-btn" onClick={() => addToast('📲 Shared link to WhatsApp', 'info')} style={{ flex: 1, justifyContent: 'center' }}>
                    <Share2 size={16} /> Share
                  </button>
                </div>

                <button 
                  className="form-submit-btn" 
                  onClick={() => {
                    setGeneratedQr(null);
                    setActiveResidentScreen('myVisitors');
                  }}
                  style={{ marginTop: '20px' }}
                >
                  Go to Visitor Logs
                </button>
              </div>
            )}
          </div>
        );

      case 'myVisitors':
        return (
          <div className="phone-screen-content animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem' }}>My Visitors</h3>
              <button className="sim-btn" onClick={() => setActiveResidentScreen('visitorEntry')} style={{ width: 'auto', padding: '6px 12px' }}>+ New</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {visitors.map((v) => (
                <div 
                  key={v.id} 
                  className="premium-card" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedVisitor(v)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '0.85rem' }}>{v.name}</h4>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                        {v.purpose} • {v.date} {v.time}
                      </p>
                    </div>
                    <div>
                      {v.status === 'Approved' && <span className="badge success">Approved</span>}
                      {v.status === 'Rejected' && <span className="badge danger">Rejected</span>}
                      {v.status === 'Pending' && <span className="badge warning">Pending</span>}
                      {v.status === 'Pre-Approved' && <span className="badge info">Pre-Approved</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'maintenance':
        return (
          <div className="phone-screen-content animate-fade-in">
            <h3 style={{ fontSize: '1.2rem' }}>Maintenance Dashboard</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>View, track, and clear your society dues and bills.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
              {maintenanceDues.map((m) => (
                <div key={m.id} className="premium-card" style={{ borderLeft: m.status === 'Unpaid' ? '4px solid var(--danger)' : '4px solid var(--success)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{m.month} Billing</h4>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Due date: {m.dueDate}</p>
                      {m.status === 'Paid' && (
                        <p style={{ fontSize: '0.65rem', color: 'var(--success)', marginTop: '4px', fontWeight: 'bold' }}>
                          Paid on: {m.paidDate} (Receipt: {m.receiptId})
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 'bold', display: 'block' }}>₹{m.dueAmount}</span>
                      {m.status === 'Unpaid' ? (
                        <button 
                          className="sim-btn sim-btn-primary" 
                          onClick={() => {
                            payMaintenanceBill(m.id, 'UPI');
                            addToast(`Generating receipts for ${m.month}...`, 'info');
                          }}
                          style={{ fontSize: '0.65rem', padding: '4px 10px', width: 'auto', marginTop: '6px' }}
                        >
                          Pay Dues
                        </button>
                      ) : (
                        <button 
                          onClick={() => addToast('Receipt downloaded locally (simulated)', 'success')}
                          className="sim-btn" 
                          style={{ fontSize: '0.65rem', padding: '4px 10px', width: 'auto', marginTop: '6px' }}
                        >
                          Receipt
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'complaintRaise':
        return (
          <div className="phone-screen-content animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button className="sim-btn" onClick={() => setActiveResidentScreen('home')} style={{ padding: '6px', width: 'auto' }}><X size={16} /></button>
              <h3 style={{ fontSize: '1.2rem' }}>File a Complaint</h3>
            </div>

            <div className="premium-card" style={{ background: '#f0f9ff', border: 'none', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Sparkles size={24} style={{ color: 'var(--secondary)' }} />
              <p style={{ fontSize: '0.7rem', color: 'var(--info-dark)' }}>
                <b>AI assistant enabled:</b> Describe your complaint, and we will auto-detect the category and priority level.
              </p>
            </div>

            <form onSubmit={handleRaiseComplaintSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label>COMPLAINT DESCRIPTION</label>
                <textarea 
                  rows={4}
                  className="form-input" 
                  placeholder="Describe your issue in detail (e.g. lift Wing B is not working, water tap leakage in master bathroom, etc.)"
                  value={complaintDesc}
                  onChange={(e) => handleComplaintDescChange(e.target.value)}
                  style={{ resize: 'none' }}
                />
              </div>

              {aiAnalyzing && (
                <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={12} className="animate-spin" /> AI analyzing description tags...
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>CATEGORY</label>
                  <select 
                    className="form-input" 
                    value={complaintCategory}
                    onChange={(e) => setComplaintCategory(e.target.value)}
                    style={{ appearance: 'auto' }}
                  >
                    <option value="Water">Water</option>
                    <option value="Lift">Lift</option>
                    <option value="Security">Security</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Electricity">Electricity</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>PRIORITY</label>
                  <select 
                    className="form-input" 
                    value={complaintPriority}
                    onChange={(e) => setComplaintPriority(e.target.value)}
                    style={{ appearance: 'auto' }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>LOCATION / BLOCKS</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Kitchen sink, Wing B Lobby"
                  value={complaintLoc}
                  onChange={(e) => setComplaintLoc(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>ATTACH PHOTO (MOCK UPLOAD)</label>
                <div style={{ width: '100%', height: '70px', border: '1px dashed var(--border-light)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'var(--bg-main)' }}>
                  <Upload size={20} style={{ color: 'var(--text-tertiary)' }} />
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>Click to upload file/photo</span>
                </div>
              </div>

              <button type="submit" className="form-submit-btn">File Complaint</button>
              <button 
                type="button" 
                className="sim-btn" 
                onClick={() => setActiveResidentScreen('complaintsList')}
                style={{ justifyContent: 'center' }}
              >
                View Complaint History
              </button>
            </form>
          </div>
        );

      case 'complaintsList':
        return (
          <div className="phone-screen-content animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem' }}>My Complaints</h3>
              <button className="sim-btn" onClick={() => setActiveResidentScreen('complaintRaise')} style={{ width: 'auto', padding: '6px 12px' }}>+ New</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {complaints.map((c) => (
                <div key={c.id} className="premium-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span className="badge info">{c.category}</span>
                    <span className={`badge ${c.status === 'Resolved' ? 'success' : c.status === 'Open' ? 'warning' : 'info'}`}>
                      {c.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{c.description}</p>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '6px' }}>Submitted on: {c.date} | Priority: <b>{c.priority}</b></p>
                  
                  {/* Timeline progress */}
                  <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                    <h5 style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Tracking Status</h5>
                    <div className="timeline-wrapper">
                      {c.timeline.map((t, idx) => (
                        <div key={idx} className="timeline-item">
                          <div className="timeline-dot active"></div>
                          <div className="timeline-content">
                            <span style={{ fontSize: '0.65rem', fontWeight: 'bold', display: 'block' }}>{t.status}</span>
                            <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)' }}>{t.date} - {t.note}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'noticesList':
        return (
          <div className="phone-screen-content animate-fade-in">
            <h3 style={{ fontSize: '1.2rem' }}>Notice Board</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Important society announcements and directives.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              {notices.map((n) => (
                <div 
                  key={n.id} 
                  className="premium-card" 
                  style={{ cursor: 'pointer', borderLeft: n.category === 'Important' ? '4px solid var(--danger)' : '1px solid var(--border-light)' }}
                  onClick={() => setSelectedNotice(n)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className={`badge ${n.category === 'Important' ? 'danger' : n.category === 'Event' ? 'success' : 'info'}`}>
                      {n.category}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{n.date}</span>
                  </div>
                  <h4 style={{ fontSize: '0.85rem', marginBottom: '4px' }}>{n.title}</h4>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {n.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'facilityList':
        const facilities = [
          { id: 1, title: 'Club House', desc: 'Central indoor party hall and activity lounge.', rate: '₹1,500/slot', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=100&h=80&fit=crop' },
          { id: 2, title: 'Garden', desc: 'Open lawn playground for small kids birthday.', rate: 'Free (Request slot)', image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=100&h=80&fit=crop' },
          { id: 3, title: 'Hall', desc: 'Main community hall for functions and events.', rate: '₹5,000/day', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=100&h=80&fit=crop' },
          { id: 4, title: 'Gym', desc: 'Fitness workout center with treadmills & weights.', rate: '₹500/mo', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=80&fit=crop' }
        ];
        return (
          <div className="phone-screen-content animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Book Facilities</h3>
              <button className="sim-btn" onClick={() => setActiveResidentScreen('bookingHistory')} style={{ width: 'auto', padding: '6px 12px' }}>History</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {facilities.map((f) => (
                <div key={f.id} className="premium-card" style={{ display: 'flex', gap: '12px', padding: '12px' }}>
                  <img src={f.image} alt={f.title} style={{ width: '80px', height: '64px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: '0.85rem' }}>{f.title}</h4>
                      <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{f.desc}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)' }}>{f.rate}</span>
                      <button 
                        onClick={() => {
                          setBookingFacility(f);
                          setActiveResidentScreen('facilityBook');
                        }}
                        className="sim-btn sim-btn-primary" 
                        style={{ padding: '4px 10px', fontSize: '0.65rem', width: 'auto' }}
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'facilityBook':
        return (
          <div className="phone-screen-content animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button className="sim-btn" onClick={() => setActiveResidentScreen('facilityList')} style={{ padding: '6px', width: 'auto' }}><X size={16} /></button>
              <h3 style={{ fontSize: '1.2rem' }}>Reserve {bookingFacility?.title}</h3>
            </div>

            <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
              <div className="form-group">
                <label>BOOKING DATE</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={bookingDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBookingDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>AVAILABLE SLOTS</label>
                <select 
                  className="form-input" 
                  value={bookingSlot}
                  onChange={(e) => setBookingSlot(e.target.value)}
                  style={{ appearance: 'auto' }}
                >
                  <option value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM (Morning)</option>
                  <option value="02:00 PM - 05:00 PM">02:00 PM - 05:00 PM (Afternoon)</option>
                  <option value="06:00 PM - 09:00 PM">06:00 PM - 09:00 PM (Evening)</option>
                </select>
              </div>

              <div className="premium-card" style={{ background: '#f8fafc' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Rate Charges</span>
                <h4 style={{ fontSize: '1rem', color: 'var(--primary)' }}>{bookingFacility?.rate}</h4>
                <p style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>Charges will be added to your next monthly maintenance bill upon committee approval.</p>
              </div>

              <button type="submit" className="form-submit-btn">Request Reservation</button>
            </form>
          </div>
        );

      case 'bookingHistory':
        return (
          <div className="phone-screen-content animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem' }}>My Reservations</h3>
              <button className="sim-btn" onClick={() => setActiveResidentScreen('facilityList')} style={{ width: 'auto', padding: '6px 12px' }}>+ Book</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {facilityBookings.map((b) => (
                <div key={b.id} className="premium-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <h4 style={{ fontSize: '0.85rem' }}>{b.facility}</h4>
                    <span className={`badge ${b.status === 'Completed' ? 'success' : b.status === 'Upcoming' ? 'info' : 'warning'}`}>
                      {b.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Slot: {b.slot}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Date: {b.date} | Cost: <b>₹{b.charges}</b></p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'documentsList':
        return (
          <div className="phone-screen-content animate-fade-in">
            <h3 style={{ fontSize: '1.2rem' }}>Documents</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Access official society certificates, bye-laws, and formats.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
              {documents.map((d) => (
                <div 
                  key={d.id} 
                  className="premium-card" 
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  onClick={() => setSelectedDoc(d)}
                >
                  <div>
                    <span style={{ fontSize: '0.6rem', color: 'var(--primary)', fontWeight: 'bold' }}>{d.category}</span>
                    <h4 style={{ fontSize: '0.8rem', marginTop: '2px' }}>{d.title}</h4>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{d.date} • {d.size}</span>
                  </div>
                  <BookOpen size={18} style={{ color: 'var(--text-tertiary)' }} />
                </div>
              ))}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="phone-screen-content animate-fade-in" style={{ gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
                RK
              </div>
              <h3 style={{ fontSize: '1.2rem' }}>{currentResident.name}</h3>
              <span className="badge info">{currentResident.unit} Unit Holder</span>
            </div>

            <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '0.85rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px' }}>Family Members</h4>
              {currentResident.family.map((f, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span style={{ fontWeight: 'bold' }}>{f.name}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{f.relation}</span>
                </div>
              ))}
            </div>

            <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '0.85rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px' }}>Registered Vehicles</h4>
              {currentResident.vehicles.map((v, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span>{v.model} ({v.type})</span>
                  <span style={{ fontWeight: 'bold' }}>{v.number}</span>
                </div>
              ))}
            </div>

            <div style={{ flex: 1 }}></div>
            
            <button 
              className="sim-btn sim-btn-danger" 
              onClick={() => {
                setActiveResidentScreen('login');
                addToast('Logged out of Resident application simulator', 'info');
              }}
              style={{ justifyContent: 'center' }}
            >
              <LogOut size={16} /> Log Out Account
            </button>
          </div>
        );

      case 'servicesMenu':
        return (
          <div className="phone-screen-content animate-fade-in">
            <h3 style={{ fontSize: '1.2rem' }}>Society Utilities</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Services and active community logs.</p>

            <div className="quick-actions-grid" style={{ marginTop: '12px' }}>
              <button className="quick-action-btn" onClick={() => setActiveResidentScreen('facilityList')}>
                <div className="quick-icon-wrapper amber"><Calendar size={20} /></div>
                <span>Facilities</span>
              </button>
              <button className="quick-action-btn" onClick={() => setActiveResidentScreen('pollsList')}>
                <div className="quick-icon-wrapper indigo"><Vote size={20} /></div>
                <span>Active Polls</span>
              </button>
              <button className="quick-action-btn" onClick={() => setActiveResidentScreen('documentsList')}>
                <div className="quick-icon-wrapper cyan"><BookOpen size={20} /></div>
                <span>Docs Vault</span>
              </button>
            </div>
            
            <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <h4 style={{ fontSize: '0.85rem' }}>Active Staff / Directory</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span>Security Desk (Gate 1)</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>+91 22 2890 1234</span>
                </div>
                <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span>Plumber Rakesh</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>+91 9988776655</span>
                </div>
                <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span>Estate Admin Manager</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>+91 9991112223</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'pollsList':
        return (
          <div className="phone-screen-content animate-fade-in">
            <h3 style={{ fontSize: '1.2rem' }}>Society Elections & Polls</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Vote anonymously on society upgrades and management actions.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              {polls.map((p) => {
                const hasVoted = p.votedUnits.includes('A-101');
                return (
                  <div key={p.id} className="premium-card" style={{ borderLeft: p.active ? '4px solid var(--primary)' : '4px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span className={`badge ${p.active ? 'success' : 'info'}`}>{p.active ? 'Active' : 'Archived'}</span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Total: {p.totalVotes} Votes</span>
                    </div>
                    <h4 style={{ fontSize: '0.85rem', marginBottom: '12px' }}>{p.question}</h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {p.options.map((opt, optIdx) => {
                        const pct = p.totalVotes > 0 ? Math.round((opt.votes / p.totalVotes) * 100) : 0;
                        return (
                          <div key={optIdx} style={{ position: 'relative' }}>
                            {hasVoted || !p.active ? (
                              // Results view
                              <div style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', background: `linear-gradient(90deg, #e0e7ff 0%, #e0e7ff ${pct}%, #ffffff ${pct}%, #ffffff 100%)`, zIndex: 1 }}>
                                <span>{opt.text}</span>
                                <span style={{ fontWeight: 'bold' }}>{pct}%</span>
                              </div>
                            ) : (
                              // Action view
                              <button 
                                onClick={() => submitVote(p.id, optIdx)}
                                className="sim-btn" 
                                style={{ width: '100%', fontSize: '0.75rem', padding: '10px' }}
                              >
                                {opt.text}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {hasVoted && p.active && (
                      <p style={{ fontSize: '0.65rem', color: 'var(--success)', marginTop: '8px', textAlign: 'center', fontWeight: 'bold' }}>
                        ✓ Your anonymous vote has been cast.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      default:
        return <div>Screen not coded</div>;
    }
  };

  return (
    <div className="device-container animate-fade-in" style={{ zIndex: 10 }}>
      {/* Device notch */}
      <div className="device-notch">
        <div className="notch-camera"></div>
        <div className="notch-speaker"></div>
      </div>

      <div className="device-screen">
        {/* Mock phone status bar */}
        <div className="phone-status-bar">
          <span>09:41</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <span>5G</span>
            <div style={{ width: '16px', height: '8px', border: '1px solid currentColor', borderRadius: '2px', padding: '1px', display: 'flex' }}>
              <div style={{ flex: 1, backgroundColor: 'currentColor', borderRadius: '1px' }}></div>
            </div>
          </div>
        </div>

        {/* Display screen logic */}
        {renderScreen()}

        {/* Floating AI chat window */}
        {aiOpen && (
          <div className="ai-chat-window">
            <div className="ai-chat-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} />
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Society AI Helpdesk</span>
              </div>
              <button 
                onClick={() => setAiOpen(false)}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>
            <div className="ai-chat-messages">
              {aiMessages.map((msg, i) => (
                <div key={i} className={`ai-msg ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleAiSend} className="ai-chat-input-area">
              <input 
                type="text" 
                className="ai-chat-input" 
                placeholder="Ask about bills, visitors..."
                value={aiMsgInput}
                onChange={(e) => setAiMsgInput(e.target.value)}
              />
              <button type="submit" className="ai-chat-send">
                <Send size={14} />
              </button>
            </form>
          </div>
        )}

        {/* Floating AI button */}
        {activeResidentScreen !== 'splash' && activeResidentScreen !== 'login' && (
          <button 
            className="ai-assistant-bubble" 
            onClick={() => setAiOpen(!aiOpen)}
          >
            <MessageSquare size={20} />
          </button>
        )}

        {/* Incoming Approval Requests Modal popup */}
        {incomingApprovalRequest && (
          <div className="resident-incoming-modal">
            <div className="incoming-card">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                <div className="quick-icon-wrapper rose animate-bounce"><ShieldAlert size={24} /></div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>Visitor Entry Request</h4>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Gate 1 Security Guard Desk</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', background: '#f8fafc', padding: '12px', borderRadius: '12px', marginBottom: '16px' }}>
                {incomingApprovalRequest.photoUrl ? (
                  <img src={incomingApprovalRequest.photoUrl} alt="Visitor Photo" style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '50px', height: '50px', borderRadius: '8px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={20} /></div>
                )}
                <div>
                  <h5 style={{ fontSize: '0.85rem' }}>{incomingApprovalRequest.name}</h5>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Purpose: {incomingApprovalRequest.purpose}</p>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Phone: {incomingApprovalRequest.mobile}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => respondToVisitorRequest(incomingApprovalRequest.id, false)}
                  className="sim-btn sim-btn-danger" 
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <X size={16} /> Deny Entry
                </button>
                <button 
                  onClick={() => respondToVisitorRequest(incomingApprovalRequest.id, true)}
                  className="sim-btn sim-btn-primary" 
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <Check size={16} /> Approve Entry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mock phone navigation bottom tab bar */}
        {activeResidentScreen !== 'splash' && activeResidentScreen !== 'login' && activeResidentScreen !== 'selectSociety' && (
          <div className="phone-bottom-nav">
            <button 
              className={`phone-nav-item ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => handleTabClick('home')}
            >
              <User size={18} />
              <span>Home</span>
            </button>
            <button 
              className={`phone-nav-item ${activeTab === 'visitors' ? 'active' : ''}`}
              onClick={() => handleTabClick('visitors')}
            >
              <QrCode size={18} />
              <span>Visitors</span>
            </button>
            <button 
              className={`phone-nav-item ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => handleTabClick('services')}
            >
              <FileText size={18} />
              <span>Services</span>
            </button>
            <button 
              className={`phone-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => handleTabClick('profile')}
            >
              <User size={18} />
              <span>Profile</span>
            </button>
          </div>
        )}
      </div>

      {/* Notice Viewer Modal */}
      {selectedNotice && (
        <div className="standard-modal-overlay" onClick={() => setSelectedNotice(null)}>
          <div className="standard-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedNotice.title}</h3>
              <button onClick={() => setSelectedNotice(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <span className="badge danger" style={{ marginBottom: '12px' }}>{selectedNotice.category}</span>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {selectedNotice.content}
              </p>
              <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-light)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                <span>Author: {selectedNotice.author}</span>
                <span>Date: {selectedNotice.date}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="sim-btn" onClick={() => addToast('Downloading notice attachment PDF...', 'info')}>Download PDF</button>
              <button className="form-submit-btn" style={{ width: 'auto' }} onClick={() => setSelectedNotice(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Visitor Details logs popup */}
      {selectedVisitor && (
        <div className="standard-modal-overlay" onClick={() => setSelectedVisitor(null)}>
          <div className="standard-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Visitor Details</h3>
              <button onClick={() => setSelectedVisitor(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                {selectedVisitor.photoUrl ? (
                  <img src={selectedVisitor.photoUrl} alt="Visitor" style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={28} /></div>
                )}
                <div>
                  <h4 style={{ fontSize: '1rem' }}>{selectedVisitor.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Phone: {selectedVisitor.mobile}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Type: <b>{selectedVisitor.purpose}</b></p>
                </div>
              </div>

              <div className="premium-card" style={{ background: 'var(--bg-main)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between' }}>
                  <span>Log Date:</span>
                  <span style={{ fontWeight: 'bold' }}>{selectedVisitor.date}</span>
                </div>
                <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between' }}>
                  <span>Status:</span>
                  <span className={`badge ${selectedVisitor.status === 'Approved' ? 'success' : selectedVisitor.status === 'Rejected' ? 'danger' : 'info'}`}>{selectedVisitor.status}</span>
                </div>
                <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between' }}>
                  <span>Vehicle No:</span>
                  <span style={{ fontWeight: 'bold' }}>{selectedVisitor.vehicleNumber}</span>
                </div>
                {selectedVisitor.entryTime && (
                  <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between' }}>
                    <span>Gate Entry:</span>
                    <span style={{ fontWeight: 'bold', color: 'var(--success)' }}>{selectedVisitor.entryTime}</span>
                  </div>
                )}
                {selectedVisitor.exitTime && (
                  <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between' }}>
                    <span>Gate Exit:</span>
                    <span style={{ fontWeight: 'bold', color: 'var(--text-tertiary)' }}>{selectedVisitor.exitTime}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="form-submit-btn" style={{ width: 'auto' }} onClick={() => setSelectedVisitor(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {selectedDoc && (
        <div className="standard-modal-overlay" onClick={() => setSelectedDoc(null)}>
          <div className="standard-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedDoc.title}</h3>
              <button onClick={() => setSelectedDoc(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <span className="badge info" style={{ marginBottom: '16px' }}>{selectedDoc.category}</span>
              <div style={{ width: '100%', height: '220px', border: '1px solid var(--border-light)', borderRadius: '12px', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <FileText size={48} style={{ color: 'var(--text-tertiary)' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Mock PDF Viewer Engine</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Loaded: {selectedDoc.size}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="sim-btn" onClick={() => addToast('Document Shared successfully', 'success')}><Share2 size={14} style={{ display: 'inline', marginRight: '6px' }} /> Share</button>
              <button className="sim-btn" onClick={() => addToast('Downloading document PDF...', 'info')}><Download size={14} style={{ display: 'inline', marginRight: '6px' }} /> Download</button>
              <button className="form-submit-btn" style={{ width: 'auto' }} onClick={() => setSelectedDoc(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
