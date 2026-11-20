import React, { useState } from 'react';
import { BarChart3, Download, FileText, DollarSign, Users, UserCheck, Calendar } from 'lucide-react';
import { Member, PaymentTransaction, AttendanceRecord, GymSettings } from '../types';

interface ReportsViewProps {
  members: Member[];
  transactions: PaymentTransaction[];
  attendance: AttendanceRecord[];
  settings: GymSettings;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  members,
  transactions,
  attendance,
  settings,
}) => {
  const [reportType, setReportType] = useState<'collections' | 'outstanding' | 'registrations' | 'attendance' | 'renewals'>('collections');

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    let filename = `${reportType}_report_${settings.gymName.replace(/\s+/g, '_')}.csv`;

    if (reportType === 'collections') {
      csvContent += "Transaction ID,Receipt No,Member Name,Date,Amount,Method,Note\n";
      transactions.forEach(t => {
        csvContent += `${t.id},${t.receiptNo},"${t.memberName}",${t.date},${t.amount},${t.method},"${t.note || ''}"\n`;
      });
    } else if (reportType === 'outstanding') {
      csvContent += "Member ID,Name,Phone,Plan Fee,Paid Amount,Pending Amount,Payment Status\n";
      members.filter(m => m.pendingAmount > 0).forEach(m => {
        csvContent += `${m.id},"${m.name}",${m.phone},${m.planFee},${m.paidAmount},${m.pendingAmount},${m.paymentStatus}\n`;
      });
    } else if (reportType === 'registrations') {
      csvContent += "Member ID,Name,Phone,Joining Date,Expiry Date,Plan Fee,Status\n";
      members.forEach(m => {
        csvContent += `${m.id},"${m.name}",${m.phone},${m.joiningDate},${m.expiryDate},${m.planFee},${m.membershipStatus}\n`;
      });
    } else if (reportType === 'attendance') {
      csvContent += "Attendance ID,Member Name,Date,Check-In Time\n";
      attendance.forEach(a => {
        csvContent += `${a.id},"${a.memberName}",${a.date},${a.checkInTime}\n`;
      });
    } else if (reportType === 'renewals') {
      csvContent += "Member ID,Name,Expiry Date,Membership Status\n";
      members.forEach(m => {
        csvContent += `${m.id},"${m.name}",${m.expiryDate},${m.membershipStatus}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Reports & Analytics</h2>
          <p className="text-zinc-400 text-sm">Generate financial, attendance, and member registration reports with CSV export.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm shadow-lg shadow-orange-600/30 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Report Type Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setReportType('collections')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            reportType === 'collections' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
          }`}
        >
          Collections Report ({transactions.length})
        </button>
        <button
          onClick={() => setReportType('outstanding')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            reportType === 'outstanding' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
          }`}
        >
          Outstanding Fees Report
        </button>
        <button
          onClick={() => setReportType('registrations')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            reportType === 'registrations' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
          }`}
        >
          Member Registration Report ({members.length})
        </button>
        <button
          onClick={() => setReportType('attendance')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            reportType === 'attendance' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
          }`}
        >
          Attendance Report ({attendance.length})
        </button>
      </div>

      {/* Report Table Display */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {reportType === 'collections' && 'Verified Collections Ledger'}
            {reportType === 'outstanding' && 'Outstanding Dues Report'}
            {reportType === 'registrations' && 'All Member Registrations'}
            {reportType === 'attendance' && 'Attendance Log Report'}
          </h3>
          <span className="text-xs text-orange-400 font-semibold">{settings.gymName} • Rohtak</span>
        </div>

        <div className="overflow-x-auto">
          {reportType === 'collections' && (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-950/50 border-b border-zinc-800 text-xs text-zinc-400 uppercase">
                  <th className="py-3 px-4">Receipt</th>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {transactions.map(t => (
                  <tr key={t.id} className="hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-orange-400">{t.receiptNo}</td>
                    <td className="py-3 px-4 font-bold text-white">{t.memberName}</td>
                    <td className="py-3 px-4 text-zinc-300">{t.date}</td>
                    <td className="py-3 px-4 font-medium text-zinc-300">{t.method}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-emerald-400">+{settings.currency}{t.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'outstanding' && (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-950/50 border-b border-zinc-800 text-xs text-zinc-400 uppercase">
                  <th className="py-3 px-4">Member ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Plan Fee</th>
                  <th className="py-3 px-4 text-right">Pending Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {members.filter(m => m.pendingAmount > 0).map(m => (
                  <tr key={m.id} className="hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-mono text-zinc-400">{m.id}</td>
                    <td className="py-3 px-4 font-bold text-white">{m.name}</td>
                    <td className="py-3 px-4 text-zinc-300">{m.phone}</td>
                    <td className="py-3 px-4">{settings.currency}{m.planFee}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-rose-400">{settings.currency}{m.pendingAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'registrations' && (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-950/50 border-b border-zinc-800 text-xs text-zinc-400 uppercase">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Joining Date</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {members.map(m => (
                  <tr key={m.id} className="hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-mono text-zinc-400">{m.id}</td>
                    <td className="py-3 px-4 font-bold text-white">{m.name}</td>
                    <td className="py-3 px-4 text-zinc-300">{m.phone}</td>
                    <td className="py-3 px-4">{m.joiningDate}</td>
                    <td className="py-3 px-4 text-orange-400">{m.expiryDate}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${m.membershipStatus === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {m.membershipStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'attendance' && (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-950/50 border-b border-zinc-800 text-xs text-zinc-400 uppercase">
                  <th className="py-3 px-4">Record ID</th>
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Check-In Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {attendance.map(a => (
                  <tr key={a.id} className="hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-mono text-zinc-400">{a.id}</td>
                    <td className="py-3 px-4 font-bold text-white">{a.memberName}</td>
                    <td className="py-3 px-4 text-zinc-300">{a.date}</td>
                    <td className="py-3 px-4 text-right text-emerald-400 font-semibold">{a.checkInTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
