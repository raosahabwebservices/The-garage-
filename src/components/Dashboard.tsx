import React from 'react';
import { 
  Users, 
  UserCheck, 
  CreditCard, 
  AlertTriangle, 
  CalendarClock, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Send,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Member, PaymentTransaction, AttendanceRecord, GymSettings } from '../types';

interface DashboardProps {
  members: Member[];
  transactions: PaymentTransaction[];
  attendance: AttendanceRecord[];
  settings: GymSettings;
  setActiveTab: (tab: string) => void;
  onOpenAddMember: () => void;
  onOpenQuickPayment: () => void;
  onRunAutomation: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  members,
  transactions,
  attendance,
  settings,
  setActiveTab,
  onOpenAddMember,
  onOpenQuickPayment,
  onRunAutomation,
}) => {
  // Calculations
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.membershipStatus === 'Active').length;
  const expiredMembers = members.filter(m => m.membershipStatus === 'Expired').length;
  
  // Today's attendance
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysAttendanceCount = attendance.filter(a => a.date === todayStr).length;

  // Monthly collections (sum of paid amounts in transactions or current month)
  const currentMonthStr = '2026-11';
  const monthlyCollections = transactions
    .filter(t => t.date.startsWith(currentMonthStr))
    .reduce((sum, t) => sum + t.amount, 0);

  // Pending fees (sum of pending amounts across all members)
  const totalPendingFees = members.reduce((sum, m) => sum + m.pendingAmount, 0);

  const paidCount = members.filter(m => m.paymentStatus === 'Paid').length;
  const partialCount = members.filter(m => m.paymentStatus === 'Partial').length;
  const unpaidCount = members.filter(m => m.paymentStatus === 'Unpaid').length;
  const overdueCount = members.filter(m => m.paymentStatus === 'Overdue').length;

  // Upcoming expiries (within 7 days)
  const upcomingExpiries = members.filter(m => {
    if (m.membershipStatus !== 'Active') return false;
    const today = new Date('2026-11-19');
    const expiry = new Date(m.expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-orange-950/40 border border-zinc-800 p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-semibold uppercase tracking-wider">
                {settings.location}
              </span>
              <span className="flex items-center text-xs text-zinc-400 bg-zinc-800/80 px-2.5 py-1 rounded-full border border-zinc-700">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400 mr-1" />
                Standard Fee: {settings.currency}{settings.defaultMonthlyFee}/mo
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, <span className="text-orange-500">{settings.ownerName}</span>
            </h2>
            <p className="text-zinc-400 text-sm mt-1 max-w-xl">
              {settings.gymName} ERP is operating smoothly. {activeMembers} active members currently training with {todaysAttendanceCount} check-ins today.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onOpenAddMember}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm shadow-lg shadow-orange-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
            <button
              onClick={onOpenQuickPayment}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-sm border border-zinc-700 transition-all"
            >
              <CreditCard className="w-4 h-4 text-orange-400" />
              <span>Record Fee</span>
            </button>
            <button
              onClick={onRunAutomation}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-orange-400 font-semibold text-sm border border-zinc-700 transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>Run Automation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Members */}
        <div 
          onClick={() => setActiveTab('members')}
          className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 cursor-pointer transition-all hover:bg-zinc-900 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-400">Total Members</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl font-black text-white">{totalMembers}</div>
            <div className="text-xs text-zinc-400 font-medium">
              <span className="text-emerald-400 font-bold">{activeMembers}</span> Active
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-zinc-400">
            <span className="text-orange-400 font-semibold mr-1">{expiredMembers}</span> Expired memberships need renewal
          </div>
        </div>

        {/* Today's Attendance */}
        <div 
          onClick={() => setActiveTab('attendance')}
          className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 cursor-pointer transition-all hover:bg-zinc-900 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-400">Today's Attendance</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl font-black text-white">{todaysAttendanceCount}</div>
            <div className="text-xs text-emerald-400 font-semibold flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Checked-In
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-zinc-400">
            Click to manage check-ins & roster
          </div>
        </div>

        {/* Monthly Collections */}
        <div 
          onClick={() => setActiveTab('fees')}
          className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 cursor-pointer transition-all hover:bg-zinc-900 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-400">Nov Collections</span>
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl font-black text-white">{settings.currency}{monthlyCollections.toLocaleString('en-IN')}</div>
            <div className="text-xs text-orange-400 font-semibold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> Verified Revenue
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-zinc-400">
            Unpaid fees excluded from revenue
          </div>
        </div>

        {/* Pending Dues */}
        <div 
          onClick={() => setActiveTab('fees')}
          className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 cursor-pointer transition-all hover:bg-zinc-900 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-400">Total Pending Dues</span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl font-black text-rose-400">{settings.currency}{totalPendingFees.toLocaleString('en-IN')}</div>
            <div className="text-xs text-rose-400 font-semibold">
              {unpaidCount + overdueCount + partialCount} Dues pending
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-zinc-400">
            Click to send WhatsApp reminders
          </div>
        </div>

      </div>

      {/* Secondary Metrics / Payment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Payment Status Summary */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Payment Status Roster</h3>
            <button 
              onClick={() => setActiveTab('fees')}
              className="text-xs text-orange-400 hover:underline flex items-center"
            >
              View All <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="flex items-center space-x-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-sm text-zinc-300 font-medium">Fully Paid</span>
              </div>
              <span className="text-sm font-bold text-white bg-zinc-800 px-2.5 py-0.5 rounded-lg">{paidCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="flex items-center space-x-3">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-sm text-zinc-300 font-medium">Partial Payment</span>
              </div>
              <span className="text-sm font-bold text-white bg-zinc-800 px-2.5 py-0.5 rounded-lg">{partialCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="flex items-center space-x-3">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="text-sm text-zinc-300 font-medium">Unpaid / Due</span>
              </div>
              <span className="text-sm font-bold text-white bg-zinc-800 px-2.5 py-0.5 rounded-lg">{unpaidCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="flex items-center space-x-3">
                <span className="w-3 h-3 rounded-full bg-red-700" />
                <span className="text-sm text-zinc-300 font-medium">Overdue</span>
              </div>
              <span className="text-sm font-bold text-white bg-zinc-800 px-2.5 py-0.5 rounded-lg">{overdueCount}</span>
            </div>
          </div>
        </div>

        {/* Upcoming Expiries (Next 7 days) */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <CalendarClock className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-bold text-white">Upcoming Expiries (Next 7 Days)</h3>
              </div>
              <button 
                onClick={() => setActiveTab('expiry')}
                className="text-xs text-orange-400 hover:underline flex items-center"
              >
                View All Expiries <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>

            {upcomingExpiries.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 text-sm">
                No memberships expiring in the next 7 days.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {upcomingExpiries.map(m => (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-white">{m.name}</span>
                        <span className="text-xs text-zinc-400">({m.id})</span>
                      </div>
                      <p className="text-xs text-orange-400 mt-0.5">Expires on: {m.expiryDate}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setActiveTab('expiry')}
                        className="px-3 py-1.5 rounded-lg bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 text-xs font-semibold border border-orange-500/30 transition-colors"
                      >
                        Renew
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <span>Automation Center ready for WhatsApp reminders</span>
            <button 
              onClick={() => setActiveTab('whatsapp')}
              className="text-orange-400 hover:underline font-semibold flex items-center"
            >
              Open WhatsApp Center <Send className="w-3 h-3 ml-1" />
            </button>
          </div>
        </div>

      </div>

      {/* Recent Transactions & Quick Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Transactions */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Recent Fee Payments</h3>
            <button 
              onClick={() => setActiveTab('fees')}
              className="text-xs text-orange-400 hover:underline flex items-center"
            >
              Ledger <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
          <div className="space-y-3">
            {transactions.slice(0, 5).map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                <div>
                  <div className="text-sm font-bold text-white">{tx.memberName}</div>
                  <div className="text-xs text-zinc-400 flex items-center space-x-2 mt-0.5">
                    <span>{tx.date}</span>
                    <span>•</span>
                    <span className="text-orange-400 font-medium">{tx.method}</span>
                    <span>•</span>
                    <span className="text-zinc-500">{tx.receiptNo}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-emerald-400">+{settings.currency}{tx.amount}</div>
                  <div className="text-[10px] text-zinc-500">Verified</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Attendance Roster */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Today's Check-Ins ({todaysAttendanceCount})</h3>
            <button 
              onClick={() => setActiveTab('attendance')}
              className="text-xs text-orange-400 hover:underline flex items-center"
            >
              Attendance Roster <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
            {attendance.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 text-sm">No check-ins recorded yet today.</div>
            ) : (
              attendance.map(att => (
                <div key={att.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{att.memberName}</div>
                      <div className="text-xs text-zinc-400">{att.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                      In: {att.checkInTime}
                    </div>
                    {att.checkOutTime && (
                      <div className="text-[10px] text-zinc-400 mt-1">Out: {att.checkOutTime}</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
