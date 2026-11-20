import React, { useState, useEffect } from 'react';
import { 
  initialMembers, 
  initialTransactions, 
  initialAttendance, 
  initialAutomationLogs, 
  initialNotifications, 
  initialGymSettings 
} from './mockData';
import { Member, PaymentTransaction, AttendanceRecord, AutomationLog, AppNotification, GymSettings } from './types';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { MembersList } from './components/MembersList';
import { FeesPayments } from './components/FeesPayments';
import { ExpiryRenewals } from './components/ExpiryRenewals';
import { AttendanceTracker } from './components/AttendanceTracker';
import { AutomationCenter } from './components/AutomationCenter';
import { WhatsAppCenter } from './components/WhatsAppCenter';
import { ReportsView } from './components/ReportsView';
import { NotificationsCenter } from './components/NotificationsCenter';
import { SettingsView } from './components/SettingsView';
import { AddMemberModal } from './components/AddMemberModal';
import { MemberDetailModal } from './components/MemberDetailModal';
import { RecordPaymentModal } from './components/RecordPaymentModal';

export default function App() {
  // State initialization with localStorage fallback
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('tfg_members');
    return saved ? JSON.parse(saved) : initialMembers;
  });

  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => {
    const saved = localStorage.getItem('tfg_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('tfg_attendance');
    return saved ? JSON.parse(saved) : initialAttendance;
  });

  const [automationLogs, setAutomationLogs] = useState<AutomationLog[]>(() => {
    const saved = localStorage.getItem('tfg_automation_logs');
    return saved ? JSON.parse(saved) : initialAutomationLogs;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('tfg_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [settings, setSettings] = useState<GymSettings>(() => {
    const saved = localStorage.getItem('tfg_settings');
    return saved ? JSON.parse(saved) : initialGymSettings;
  });

  // Modal states
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMember, setPaymentMember] = useState<Member | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('tfg_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('tfg_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('tfg_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('tfg_automation_logs', JSON.stringify(automationLogs));
  }, [automationLogs]);

  useEffect(() => {
    localStorage.setItem('tfg_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('tfg_settings', JSON.stringify(settings));
  }, [settings]);

  // Handlers
  const handleAddMember = (newMember: Member) => {
    setMembers(prev => [newMember, ...prev]);
    
    // Add notification
    const newNotif: AppNotification = {
      id: `NOTIF-${Date.now()}`,
      title: 'New Member Registration',
      message: `${newMember.name} joined ${settings.gymName} (${newMember.id}).`,
      timestamp: 'Just now',
      type: 'registration',
      read: false,
      memberId: newMember.id,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleDeleteMember = (memberId: string) => {
    setMembers(prev => prev.filter(m => m.id !== memberId));
  };

  const handleSavePayment = (newTxn: PaymentTransaction, updatedMember: Member) => {
    setTransactions(prev => [newTxn, ...prev]);
    setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));

    // Add notification
    const newNotif: AppNotification = {
      id: `NOTIF-${Date.now()}`,
      title: 'Payment Received',
      message: `Received ₹${newTxn.amount} from ${updatedMember.name} via ${newTxn.method}.`,
      timestamp: 'Just now',
      type: 'payment',
      read: false,
      memberId: updatedMember.id,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleRenewMember = (memberId: string, newExpiryDate: string, newTxn: PaymentTransaction) => {
    setTransactions(prev => [newTxn, ...prev]);
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          expiryDate: newExpiryDate,
          membershipStatus: 'Active',
          paymentStatus: 'Paid',
          paidAmount: m.planFee,
          pendingAmount: 0,
        };
      }
      return m;
    }));

    const targetMember = members.find(m => m.id === memberId);
    if (targetMember) {
      const newNotif: AppNotification = {
        id: `NOTIF-${Date.now()}`,
        title: 'Membership Renewed',
        message: `${targetMember.name} membership renewed until ${newExpiryDate}.`,
        timestamp: 'Just now',
        type: 'expiry',
        read: false,
        memberId: targetMember.id,
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const handleCheckIn = (memberId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const targetMember = members.find(m => m.id === memberId);
    if (!targetMember) return;

    // Prevent duplicate check-in today
    const alreadyCheckedIn = attendance.some(a => a.memberId === memberId && a.date === todayStr);
    if (alreadyCheckedIn) {
      alert(`${targetMember.name} is already checked in today.`);
      return;
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newAtt: AttendanceRecord = {
      id: `ATT-${Date.now()}`,
      memberId,
      memberName: targetMember.name,
      date: todayStr,
      checkInTime: timeStr,
    };

    setAttendance(prev => [newAtt, ...prev]);
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, attendanceStatus: 'Present' } : m));
  };

  const handleCheckOut = (attendanceId: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAttendance(prev => prev.map(a => a.id === attendanceId ? { ...a, checkOutTime: timeStr } : a));
  };

  const handleRunAutomation = () => {
    const todayStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const unpaidCount = members.filter(m => m.pendingAmount > 0).length;
    const expiryCount = members.filter(m => m.membershipStatus === 'Active').length;

    const newLog: AutomationLog = {
      id: `LOG-${Date.now()}`,
      timestamp: todayStr,
      title: 'Daily Expiry & Due Automation Scan',
      description: `Scanned ${members.length} members successfully.`,
      type: 'expiry_alert',
      status: 'Success',
      details: `Detected ${unpaidCount} unpaid fee accounts and generated renewal reminders.`,
    };

    setAutomationLogs(prev => [newLog, ...prev]);
    alert(`Automation Scan Completed Successfully!\nScanned ${members.length} members. Found ${unpaidCount} accounts with pending dues.`);
  };

  const handleExportData = () => {
    const dataObj = {
      settings,
      members,
      transactions,
      attendance,
      automationLogs,
      notifications,
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `the_fitness_garage_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetDemoData = () => {
    setMembers(initialMembers);
    setTransactions(initialTransactions);
    setAttendance(initialAttendance);
    setAutomationLogs(initialAutomationLogs);
    setNotifications(initialNotifications);
    setSettings(initialGymSettings);
    localStorage.clear();
    alert('Data successfully reset to 20 fictional demo members.');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-orange-500 selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        notifications={notifications}
        onOpenAddMember={() => setAddMemberOpen(true)}
        onOpenQuickPayment={() => {
          if (members.length > 0) {
            setPaymentMember(members[0]);
            setPaymentModalOpen(true);
          }
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            members={members}
            transactions={transactions}
            attendance={attendance}
            settings={settings}
            setActiveTab={setActiveTab}
            onOpenAddMember={() => setAddMemberOpen(true)}
            onOpenQuickPayment={() => {
              if (members.length > 0) {
                setPaymentMember(members[0]);
                setPaymentModalOpen(true);
              }
            }}
            onRunAutomation={handleRunAutomation}
          />
        )}

        {activeTab === 'members' && (
          <MembersList
            members={members}
            settings={settings}
            onOpenAddMember={() => setAddMemberOpen(true)}
            onSelectMember={(m) => {
              setSelectedMember(m);
              setDetailModalOpen(true);
            }}
            onOpenRecordPayment={(m) => {
              setPaymentMember(m);
              setPaymentModalOpen(true);
            }}
            onOpenWhatsApp={() => setActiveTab('whatsapp')}
            onDeleteMember={handleDeleteMember}
          />
        )}

        {activeTab === 'fees' && (
          <FeesPayments
            members={members}
            transactions={transactions}
            settings={settings}
            onOpenRecordPayment={(m) => {
              setPaymentMember(m);
              setPaymentModalOpen(true);
            }}
            onOpenWhatsApp={() => setActiveTab('whatsapp')}
          />
        )}

        {activeTab === 'expiry' && (
          <ExpiryRenewals
            members={members}
            settings={settings}
            onRenewMember={handleRenewMember}
            onOpenWhatsApp={() => setActiveTab('whatsapp')}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceTracker
            members={members}
            attendance={attendance}
            settings={settings}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
          />
        )}

        {activeTab === 'automation' && (
          <AutomationCenter
            members={members}
            automationLogs={automationLogs}
            settings={settings}
            onRunAutomation={handleRunAutomation}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'whatsapp' && (
          <WhatsAppCenter
            members={members}
            settings={settings}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            members={members}
            transactions={transactions}
            attendance={attendance}
            settings={settings}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationsCenter
            notifications={notifications}
            onMarkAllAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
            onClearNotifications={() => setNotifications([])}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={setSettings}
            onExportData={handleExportData}
            onResetDemoData={handleResetDemoData}
          />
        )}
      </main>

      {/* Modals */}
      <AddMemberModal
        isOpen={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
        onAddMember={handleAddMember}
        settings={settings}
        existingCount={members.length}
      />

      <MemberDetailModal
        member={selectedMember}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        transactions={transactions}
        attendance={attendance}
        settings={settings}
        onDeleteMember={handleDeleteMember}
        onOpenRecordPayment={(m) => {
          setPaymentMember(m);
          setPaymentModalOpen(true);
        }}
        onOpenWhatsApp={() => setActiveTab('whatsapp')}
      />

      <RecordPaymentModal
        member={paymentMember}
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSavePayment={handleSavePayment}
        settings={settings}
      />
    </div>
  );
}
