import React, { createContext, useContext, useState, useEffect } from 'react';

const SimContext = createContext();

export const useSim = () => useContext(SimContext);

export const SimProvider = ({ children }) => {
  // Navigation & Role States
  const [userRole, setUserRole] = useState('resident'); // 'resident' | 'security' | 'admin' | 'superadmin'
  const [activeResidentScreen, setActiveResidentScreen] = useState('splash'); // splash, login, society, home, profile, visitorEntry, myVisitors, maintenance, pay, complaints, notices, events, polls, documents, booking
  const [activeSecurityScreen, setActiveSecurityScreen] = useState('dashboard');
  const [activeAdminScreen, setActiveAdminScreen] = useState('dashboard');
  const [activeSuperAdminScreen, setActiveSuperAdminScreen] = useState('dashboard');

  // Notifications Toast State
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  // Mock Database Initial States
  const [currentResident, setCurrentResident] = useState({
    name: 'Rajesh Kumar',
    unit: 'A-101',
    mobile: '9876543210',
    email: 'rajesh.kumar@gmail.com',
    family: [
      { name: 'Sunita Kumar', relation: 'Spouse', mobile: '9876543211' },
      { name: 'Aarav Kumar', relation: 'Son', mobile: 'N/A' }
    ],
    vehicles: [
      { type: '4 Wheeler', model: 'Tata Nexon EV', number: 'MH-02-EV-4562' },
      { type: '2 Wheeler', model: 'Activa 6G', number: 'MH-02-XY-8890' }
    ],
    emergencyContacts: [
      { name: 'Society Gate 1 Security', phone: '+91 22 2890 1234' },
      { name: 'Electrician (Ramesh)', phone: '+91 9988776655' }
    ]
  });

  const [activeSociety, setActiveSociety] = useState('Royal Orchid Residency');
  
  const [societies, setSocieties] = useState([
    { id: 1, name: 'Royal Orchid Residency', location: 'Mumbai, MH', residents: 240, status: 'Active', plan: 'Premium' },
    { id: 2, name: 'Green Meadows Co-op Society', location: 'Pune, MH', residents: 120, status: 'Active', plan: 'Basic' },
    { id: 3, name: 'Skyline Heights', location: 'Bangalore, KA', residents: 480, status: 'Pending Approval', plan: 'Enterprise' },
    { id: 4, name: 'Palm Breeze Society', location: 'Surat, GJ', residents: 95, status: 'Active', plan: 'Basic' }
  ]);

  const [visitors, setVisitors] = useState([
    {
      id: 'v1',
      name: 'Amit Shah (Amazon)',
      mobile: '9123456780',
      purpose: 'Delivery',
      status: 'Approved',
      date: '2026-06-20',
      time: '10:15 AM',
      vehicleNumber: 'MH-03-XX-1122',
      residentUnit: 'A-101',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      entryTime: '10:20 AM',
      exitTime: '10:45 AM',
      type: 'Delivery',
      qrCode: 'QR_AMZ_8891'
    },
    {
      id: 'v2',
      name: 'Suresh Patel (Maid)',
      mobile: '9888877777',
      purpose: 'Daily Help',
      status: 'Approved',
      date: '2026-06-20',
      time: '08:00 AM',
      vehicleNumber: 'None',
      residentUnit: 'A-101',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      entryTime: '08:05 AM',
      exitTime: '11:00 AM',
      type: 'Maid',
      qrCode: 'QR_MAID_9201'
    },
    {
      id: 'v3',
      name: 'Rohan Sharma',
      mobile: '9345678912',
      purpose: 'Relative',
      status: 'Pre-Approved',
      date: '2026-06-20',
      time: '06:30 PM',
      vehicleNumber: 'DL-01-AB-1234',
      residentUnit: 'A-101',
      photoUrl: '',
      entryTime: '',
      exitTime: '',
      type: 'Relative',
      qrCode: 'QR_REL_4422'
    }
  ]);

  const [complaints, setComplaints] = useState([
    {
      id: 'c1',
      category: 'Lift',
      priority: 'High',
      description: 'Lift B is making grinding sounds and stopping 2 inches below the floor level. Dangerous.',
      status: 'In Progress',
      date: '2026-06-19',
      unit: 'A-101',
      location: 'Wing A, Lift B Lobby',
      timeline: [
        { status: 'Open', date: '2026-06-19 14:30', note: 'Complaint filed by Resident' },
        { status: 'In Progress', date: '2026-06-19 16:00', note: 'Assigned to Lift Technician (OTIS Ltd)' }
      ],
      comments: [
        { sender: 'Admin', text: 'Technician has arrived at the site. Troubleshooting in progress.', date: '2026-06-19 16:30' }
      ]
    },
    {
      id: 'c2',
      category: 'Water',
      priority: 'Medium',
      description: 'Low water pressure in kitchen toilet tap since yesterday evening.',
      status: 'Resolved',
      date: '2026-06-18',
      unit: 'A-101',
      location: 'Unit A-101 Toilet',
      timeline: [
        { status: 'Open', date: '2026-06-18 09:00', note: 'Complaint filed by Resident' },
        { status: 'In Progress', date: '2026-06-18 10:15', note: 'Assigned to Plumber (Rakesh)' },
        { status: 'Resolved', date: '2026-06-18 11:30', note: 'Air lock cleared in inlet pipe. Pressure restored.' }
      ],
      comments: [
        { sender: 'Plumber Rakesh', text: 'Cleaned the filter faucet and removed air lock.', date: '2026-06-18 11:20' }
      ]
    }
  ]);

  const [maintenanceDues, setMaintenanceDues] = useState([
    { id: 'm1', month: 'June 2026', dueAmount: 4500, previousDue: 0, status: 'Unpaid', dueDate: '2026-06-25', paidDate: '', receiptId: '' },
    { id: 'm2', month: 'May 2026', dueAmount: 4500, previousDue: 0, status: 'Paid', dueDate: '2026-05-25', paidDate: '2026-05-23', receiptId: 'REC-202605-A101' },
    { id: 'm3', month: 'April 2026', dueAmount: 4500, previousDue: 0, status: 'Paid', dueDate: '2026-04-25', paidDate: '2026-04-24', receiptId: 'REC-202604-A101' }
  ]);

  const [notices, setNotices] = useState([
    {
      id: 'n1',
      title: 'Water Supply Interruption - Wing A & B',
      content: 'Please note that there will be a scheduled overhead tank cleaning on Sunday, 22nd June 2026. Water supply will be unavailable from 10:00 AM to 02:00 PM. Kindly store water in advance.',
      date: '2026-06-20',
      category: 'Important',
      author: 'Committee Secretary'
    },
    {
      id: 'n2',
      title: 'International Yoga Day Celebration',
      content: 'Join us for a morning yoga session at the Society Clubhouse Garden on June 21st at 06:30 AM. Instructors from the Patanjali Center will guide us. Yoga mats and light refreshments will be provided.',
      date: '2026-06-19',
      category: 'Event',
      author: 'Cultural Committee'
    },
    {
      id: 'n3',
      title: 'Annual General Body Meeting (AGM) Notice',
      content: 'The 12th Annual General Body Meeting of the society is scheduled on 28th June 2026 at 04:00 PM in the Society Hall. Main agenda: Security vendor contract review, Annual budget approvals, and election of new committee members.',
      date: '2026-06-15',
      category: 'General',
      author: 'Management Committee'
    }
  ]);

  const [events, setEvents] = useState([
    {
      id: 'e1',
      title: 'Monsoon Tree Plantation Drive',
      description: 'Let us make our neighborhood green! Planting 200 saplings in and around society premises. Eco-gifts for children participating.',
      date: '2026-06-27',
      time: '09:00 AM',
      venue: 'Common Playground',
      rsvpCount: 42,
      rsvped: false
    },
    {
      id: 'e2',
      title: 'Yoga Day Session',
      description: 'Morning yoga, meditation, and healthy breakfast. Open to all age groups.',
      date: '2026-06-21',
      time: '06:30 AM',
      venue: 'Clubhouse Garden',
      rsvpCount: 65,
      rsvped: true
    }
  ]);

  const [polls, setPolls] = useState([
    {
      id: 'p1',
      question: 'Should we replace the current security agency (SecureForce) with GuardPro?',
      options: [
        { text: 'Yes, GuardPro has better patrol systems', votes: 85 },
        { text: 'No, SecureForce is cheaper and familiar', votes: 42 },
        { text: 'Need a detailed comparison table first', votes: 23 }
      ],
      votedUnits: ['B-204', 'C-501', 'A-102'],
      active: true,
      totalVotes: 150
    },
    {
      id: 'p2',
      question: 'Proposal for installing individual EV Charging Points in parking slots',
      options: [
        { text: 'Approved (Self-funded setup)', votes: 94 },
        { text: 'Reject (Increases electrical load risks)', votes: 12 }
      ],
      votedUnits: ['A-101', 'B-204', 'C-501', 'C-104'], // Current resident voted
      active: false,
      totalVotes: 106
    }
  ]);

  const [documents, setDocuments] = useState([
    { id: 'd1', title: 'Society Bye-Laws & Rules 2026', category: 'Society Rules', date: '2026-01-01', size: '2.4 MB' },
    { id: 'd2', title: 'AGM Minutes Meeting - Dec 2025', category: 'Meeting Minutes', date: '2025-12-15', size: '840 KB' },
    { id: 'd3', title: 'No-Objection Certificate (NOC) Form', category: 'Forms', date: '2026-02-10', size: '120 KB' },
    { id: 'd4', title: 'Society Share Certificate Sample', category: 'Certificates', date: '2026-03-05', size: '1.1 MB' }
  ]);

  const [facilityBookings, setFacilityBookings] = useState([
    { id: 'b1', facility: 'Club House', date: '2026-06-25', slot: '06:00 PM - 09:00 PM', charges: 1500, unit: 'A-101', status: 'Upcoming' },
    { id: 'b2', facility: 'Hall', date: '2026-05-10', slot: '10:00 AM - 04:00 PM', charges: 5000, unit: 'A-101', status: 'Completed' }
  ]);

  const [ledgers, setLedgers] = useState([
    { id: 'tx1', type: 'Income', category: 'Maintenance', amount: 1080000, date: '2026-06-05', description: 'Bulk maintenance collections June', status: 'Paid' },
    { id: 'tx2', type: 'Expense', category: 'Utility Bills', amount: 120000, date: '2026-06-10', description: 'Common area electricity bill - MSEDCL', status: 'Paid' },
    { id: 'tx3', type: 'Expense', category: 'Vendor Payments', amount: 350000, date: '2026-06-12', description: 'SecureForce agency monthly security service', status: 'Paid' },
    { id: 'tx4', type: 'Income', category: 'Donations', amount: 50000, date: '2026-06-14', description: 'Festival sponsor donation', status: 'Paid' },
    { id: 'tx5', type: 'Expense', category: 'Cleaning', amount: 85000, date: '2026-06-16', description: 'Water tank deep cleaning and bleaching', status: 'Paid' }
  ]);

  // SaaS Subscription plans
  const [subscriptionPlans, setSubscriptionPlans] = useState([
    { id: 's1', name: 'Basic Plan', cost: '₹5,000/mo', features: ['Visitor Log', 'SOS Alarm', 'Notice Board', 'Basic Support'] },
    { id: 's2', name: 'Premium Plan', cost: '₹12,000/mo', features: ['AI Assist', 'QR Entry', 'Ledger Accounting', 'Smart Parking', 'WhatsApp integration'] },
    { id: 's3', name: 'Enterprise Plan', cost: 'Custom Quote', features: ['Face Recog', 'Biometric link', 'Multi-Society', 'SLA Support', 'API Access'] }
  ]);

  // Support Tickets
  const [supportTickets, setSupportTickets] = useState([
    { id: 't1', society: 'Royal Orchid Residency', subject: 'WhatsApp webhook failing to trigger templates', status: 'Open', date: '2026-06-20', priority: 'High' },
    { id: 't2', society: 'Green Meadows', subject: 'Requesting layout adjustment for customized reports', status: 'Resolved', date: '2026-06-18', priority: 'Medium' }
  ]);

  // Emergency SOS State
  const [sosActive, setSosActive] = useState(false);
  const [sosDetails, setSosDetails] = useState(null);

  // Incoming Visitor Verification State (Sync between Guard and Resident)
  const [incomingApprovalRequest, setIncomingApprovalRequest] = useState(null);

  // Smart Parking Slots Simulator
  const [parkingSlots, setParkingSlots] = useState([
    { id: 'P-101', occupied: true, carNumber: 'MH-02-EV-4562', type: 'Resident EV' },
    { id: 'P-102', occupied: false, carNumber: '', type: 'Resident' },
    { id: 'P-103', occupied: true, carNumber: 'DL-01-AB-1234', type: 'Visitor' },
    { id: 'P-104', occupied: false, carNumber: '', type: 'Visitor' }
  ]);

  // AI Chat Bot Mock replies
  const getAiChatbotReply = (message) => {
    const text = message.toLowerCase();
    if (text.includes('maintenance') || text.includes('pay') || text.includes('due')) {
      return 'Your current maintenance due for June 2026 is ₹4,500. The due date is June 25, 2026. You can pay via UPI or Cards in the Maintenance tab.';
    }
    if (text.includes('visitor') || text.includes('guest') || text.includes('qr')) {
      return 'You can pre-approve visitors by generating a QR code. Go to "Visitor Entry", fill details, and click "Generate QR". Show that to your visitor!';
    }
    if (text.includes('complaint') || text.includes('raise') || text.includes('lift') || text.includes('plumber')) {
      return 'To raise a complaint, click "Raise Complaint". Our AI will auto-detect the category (Water, Electricity, Lift, Security, etc.) and direct it to the correct vendor.';
    }
    if (text.includes('sos') || text.includes('emergency')) {
      return 'If there is an emergency, press the RED SOS button in the app. It will trigger a high-volume siren on the Security Guard panel and send GPS coordinates.';
    }
    return "Hi, I am your SmartSociety AI Assistant. How can I help you today? You can ask about Maintenance payments, pre-approving Visitors, creating Complaints, or Emergency SOS alerts!";
  };

  // SYSTEM LOGIC SIMULATORS (THE SIMULATION ENGINE CONTROLS)

  // 1. Walk-in Visitor at Gate
  const simulateWalkInVisitor = (name = 'Karan Johar', purpose = 'Guest', phone = '9998887776') => {
    const newVisitor = {
      id: 'v_sim_' + Date.now(),
      name,
      mobile: phone,
      purpose,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      vehicleNumber: 'MH-12-GZ-5509',
      residentUnit: 'A-101',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      entryTime: '',
      exitTime: '',
      type: purpose,
      qrCode: ''
    };

    setVisitors((prev) => [newVisitor, ...prev]);
    setIncomingApprovalRequest(newVisitor);
    addToast(`🚨 Security Guard: Walk-in Visitor "${name}" arrived for Unit A-101. Approval requested.`, 'warning');
    
    // Auto switch screen alerts depending on visual flow
    if (userRole === 'security') {
      setActiveSecurityScreen('approvals');
    }
  };

  // 2. Handle approval response from Resident
  const respondToVisitorRequest = (visitorId, isApproved) => {
    setVisitors((prev) =>
      prev.map((v) => {
        if (v.id === visitorId) {
          return {
            ...v,
            status: isApproved ? 'Approved' : 'Rejected',
            entryTime: isApproved ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            qrCode: isApproved ? `QR_APP_${Math.floor(1000 + Math.random() * 9000)}` : ''
          };
        }
        return v;
      })
    );

    const match = visitors.find((v) => v.id === visitorId);
    const visitorName = match ? match.name : 'Visitor';

    setIncomingApprovalRequest(null);
    addToast(
      isApproved 
        ? `✅ Resident: Visitor "${visitorName}" Approved! Log entry recorded.`
        : `❌ Resident: Visitor "${visitorName}" Rejected. Guard informed.`,
      isApproved ? 'success' : 'danger'
    );
  };

  // 3. Trigger Resident SOS
  const triggerSos = (type = 'Fire') => {
    setSosActive(true);
    setSosDetails({
      unit: 'A-101',
      resident: 'Rajesh Kumar',
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      coords: '19.0760° N, 72.8777° E (Gate Wing A)'
    });
    addToast(`🔥 CRITICAL SOS: Unit A-101 triggered a ${type} alert! Siren enabled on guard console.`, 'danger');
  };

  // 4. Resolve/Deactivate SOS
  const clearSos = () => {
    setSosActive(false);
    setSosDetails(null);
    addToast('ℹ️ SOS Alert cleared by Security Staff.', 'info');
  };

  // 5. Submit Complaint
  const submitComplaint = (category, description, priority, location) => {
    const newComplaint = {
      id: 'c_' + Date.now(),
      category,
      priority,
      description,
      status: 'Open',
      date: new Date().toISOString().split('T')[0],
      unit: 'A-101',
      location: location || 'A-101 Unit Area',
      timeline: [
        { status: 'Open', date: new Date().toISOString().replace('T', ' ').slice(0, 16), note: 'Complaint submitted by Resident' }
      ],
      comments: []
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    addToast(`📝 Complaint raised under "${category}" (${priority} Priority). Assigned to Admin board.`, 'success');
  };

  // 6. Admin assigns and changes status of Complaint
  const updateComplaintStatus = (complaintId, nextStatus, commentText = '') => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          const updatedTimeline = [...c.timeline, { status: nextStatus, date: new Date().toISOString().replace('T', ' ').slice(0, 16), note: `Status updated to ${nextStatus}` }];
          const updatedComments = commentText 
            ? [...c.comments, { sender: 'Admin', text: commentText, date: new Date().toISOString().replace('T', ' ').slice(0, 16) }]
            : c.comments;
          return {
            ...c,
            status: nextStatus,
            timeline: updatedTimeline,
            comments: updatedComments
          };
        }
        return c;
      })
    );
    addToast(`🔧 Complaint status updated to "${nextStatus}" by Management.`, 'info');
  };

  // 7. Make Maintenance Payment
  const payMaintenanceBill = (billId, method) => {
    const txId = 'REC-' + Date.now().toString().slice(-8);
    setMaintenanceDues((prev) =>
      prev.map((m) => {
        if (m.id === billId) {
          return {
            ...m,
            status: 'Paid',
            paidDate: new Date().toISOString().split('T')[0],
            receiptId: txId
          };
        }
        return m;
      })
    );

    const paidBill = maintenanceDues.find((m) => m.id === billId);
    const amount = paidBill ? paidBill.dueAmount : 4500;

    // Add income ledger entry
    const newTx = {
      id: 'tx_' + Date.now(),
      type: 'Income',
      category: 'Maintenance',
      amount,
      date: new Date().toISOString().split('T')[0],
      description: `Unit A-101 maintenance bill payment (${paidBill ? paidBill.month : 'June 2026'})`,
      status: 'Paid'
    };

    setLedgers((prev) => [newTx, ...prev]);
    addToast(`💰 Maintenance paid for ${paidBill?.month || 'June'} via ${method}! Receipt Generated: ${txId}`, 'success');
  };

  // 8. Generate Maintenance Bills Bulk (Admin action)
  const generateBulkMaintenanceBills = (monthName = 'July 2026') => {
    const isExist = maintenanceDues.some((m) => m.month === monthName);
    if (isExist) {
      addToast(`⚠️ Bills for ${monthName} have already been generated.`, 'warning');
      return;
    }

    const newBill = {
      id: 'm_bulk_' + Date.now(),
      month: monthName,
      dueAmount: 4500,
      previousDue: 0,
      status: 'Unpaid',
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 days from now
      paidDate: '',
      receiptId: ''
    };

    setMaintenanceDues((prev) => [newBill, ...prev]);
    addToast(`📄 Maintenance Bills generated successfully for ${monthName} (Bulk 240 Units).`, 'success');
  };

  // 9. Book Facility
  const bookFacility = (facilityName, date, slot) => {
    const bookingChargeMap = { 'Club House': 1500, 'Garden': 0, 'Hall': 5000, 'Gym': 500 };
    const charges = bookingChargeMap[facilityName] || 0;
    
    const newBooking = {
      id: 'fb_' + Date.now(),
      facility: facilityName,
      date,
      slot,
      charges,
      unit: 'A-101',
      status: charges > 0 ? 'Pending' : 'Upcoming' // Paid facilities require approval
    };

    setFacilityBookings((prev) => [newBooking, ...prev]);
    addToast(`📅 facility Booked: ${facilityName} for ${date} during slot ${slot}.`, 'success');
  };

  // 10. Admin approves/rejects facility booking
  const updateBookingStatus = (bookingId, status) => {
    setFacilityBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return { ...b, status };
        }
        return b;
      })
    );
    addToast(`📅 Facility booking status updated to ${status}.`, 'info');
  };

  // 11. Add a new Notice (Admin)
  const addNotice = (title, content, category) => {
    const newNotice = {
      id: 'n_' + Date.now(),
      title,
      content,
      date: new Date().toISOString().split('T')[0],
      category,
      author: 'Management Committee'
    };

    setNotices((prev) => [newNotice, ...prev]);
    addToast(`📢 New Notice Broadcasted: "${title}"`, 'info');
  };

  // 12. Submit Poll Vote
  const submitVote = (pollId, optionIndex) => {
    setPolls((prev) =>
      prev.map((p) => {
        if (p.id === pollId) {
          const updatedOptions = p.options.map((opt, i) => {
            if (i === optionIndex) {
              return { ...opt, votes: opt.votes + 1 };
            }
            return opt;
          });
          return {
            ...p,
            options: updatedOptions,
            votedUnits: [...p.votedUnits, 'A-101'],
            totalVotes: p.totalVotes + 1
          };
        }
        return p;
      })
    );
    addToast('🗳️ Your vote has been cast anonymously.', 'success');
  };

  return (
    <SimContext.Provider
      value={{
        // Role Navigation
        userRole,
        setUserRole,
        activeResidentScreen,
        setActiveResidentScreen,
        activeSecurityScreen,
        setActiveSecurityScreen,
        activeAdminScreen,
        setActiveAdminScreen,
        activeSuperAdminScreen,
        setActiveSuperAdminScreen,

        // Toast Messages
        toasts,
        addToast,

        // Mock Database States
        currentResident,
        setCurrentResident,
        activeSociety,
        setActiveSociety,
        societies,
        setSocieties,
        visitors,
        setVisitors,
        complaints,
        setComplaints,
        maintenanceDues,
        notices,
        events,
        polls,
        documents,
        facilityBookings,
        ledgers,
        setLedgers,
        subscriptionPlans,
        supportTickets,
        sosActive,
        sosDetails,
        incomingApprovalRequest,
        parkingSlots,

        // AI helper
        getAiChatbotReply,

        // System Action Simulators
        simulateWalkInVisitor,
        respondToVisitorRequest,
        triggerSos,
        clearSos,
        submitComplaint,
        updateComplaintStatus,
        payMaintenanceBill,
        generateBulkMaintenanceBills,
        bookFacility,
        updateBookingStatus,
        addNotice,
        submitVote
      }}
    >
      {children}
    </SimContext.Provider>
  );
};
