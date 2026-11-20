import React, { useState } from 'react';
import { CreditCard, Search, DollarSign, Send, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { Member, PaymentTransaction, GymSettings } from '../types';

interface FeesPaymentsProps {
  members: Member[];
  transactions: PaymentTransaction[];
  settings: GymSettings;
  onOpenRecordPayment: (member: Member) => void;
  onOpenWhatsApp: (member: Member) => void;
}

export const FeesPayments: React.FC<FeesPaymentsProps> = ({
  members,
  transactions,
  settings,
  onOpenRecordPayment,
  onOpenWhatsApp,
}) => {
  const [activeTab, setActiveTab] = useState<'dues' | 'ledger'>('dues');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Filter members with pending dues or all
  const membersWithDues = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || m.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredTransactions = transactions.filter(t => 
    t.memberName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.receiptNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCollectedRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalPendingDues = members.reduce((sum, m) => sum + m.pendingAmount, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Fees & Payment Management</h2>
          <p className="text-zinc-400 text-sm">Track paid, partial, unpaid dues and verified revenue for {settings.gymName}.</p>
        </div>

        {/* Summary Mini Cards */}
        <div className="flex gap-3">
          <div className="bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl">
            <div className="text-[10px] text-zinc-500 uppercase font-semibold">Total Revenue</div>
            <div className="text-lg font-black text-emerald-400">{settings.currency}{totalCollectedRevenue.toLocaleString('en-IN')}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl">
            <div className="text-[10px] text-zinc-500 uppercase font-semibold">Pending Dues</div>
            <div className="text-lg font-black text-rose-400">{settings.currency}{totalPendingDues.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex space-x-2 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setActiveTab('dues')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'dues'
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
              : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
          }`}
        >
          Outstanding Dues & Status
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'ledger'
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
              : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
          }`}
        >
          Payment Transaction Ledger ({transactions.length})
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={activeTab === 'dues' ? "Search member name or phone..." : "Search transaction by name or receipt..."}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
          />
        </div>

        {activeTab === 'dues' && (
          <div className="w-full md:w-64">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
            >
              <option value="All">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        )}
      </div>

      {/* Content tables */}
      {activeTab === 'dues' ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-950/80 border-b border-zinc-800 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Member Name</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Plan Fee</th>
                  <th className="py-3.5 px-4">Paid Amount</th>
                  <th className="py-3.5 px-4">Pending Due</th>
                  <th className="py-3.5 px-4">Payment Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-sm">
                {membersWithDues.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-zinc-500">
                      No members found matching filters.
                    </td>
                  </tr>
                ) : (
                  membersWithDues.map((member) => (
                    <tr key={member.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">{member.name}</td>
                      <td className="py-3.5 px-4 text-zinc-300">{member.phone}</td>
                      <td className="py-3.5 px-4 font-medium text-white">{settings.currency}{member.planFee}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">{settings.currency}{member.paidAmount}</td>
                      <td className="py-3.5 px-4 font-extrabold text-rose-400">{settings.currency}{member.pendingAmount}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          member.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          member.paymentStatus === 'Partial' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {member.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onOpenRecordPayment(member)}
                            className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-sm transition-colors flex items-center space-x-1"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Collect</span>
                          </button>
                          {member.pendingAmount > 0 && (
                            <button
                              onClick={() => onOpenWhatsApp(member)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition-colors flex items-center space-x-1"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-950/80 border-b border-zinc-800 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Receipt No</th>
                  <th className="py-3.5 px-4">Member Name</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">Note</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-sm">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-zinc-500">
                      No payment transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-orange-400">{tx.receiptNo}</td>
                      <td className="py-3.5 px-4 font-bold text-white">{tx.memberName}</td>
                      <td className="py-3.5 px-4 text-zinc-300">{tx.date}</td>
                      <td className="py-3.5 px-4 font-semibold text-zinc-300">{tx.method}</td>
                      <td className="py-3.5 px-4 text-zinc-400 text-xs">{tx.note || 'Membership fee'}</td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-emerald-400">+{settings.currency}{tx.amount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
