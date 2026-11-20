import React, { useState } from 'react';
import { CalendarClock, AlertTriangle, Send, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Member, GymSettings, PaymentTransaction } from '../types';

interface ExpiryRenewalsProps {
  members: Member[];
  settings: GymSettings;
  onRenewMember: (memberId: string, newExpiryDate: string, newTxn: PaymentTransaction) => void;
  onOpenWhatsApp: (member: Member) => void;
}

export const ExpiryRenewals: React.FC<ExpiryRenewalsProps> = ({
  members,
  settings,
  onRenewMember,
  onOpenWhatsApp,
}) => {
  const [filterType, setFilterType] = useState<'all' | '7days' | '3days' | 'tomorrow' | 'expired'>('all');
  const [renewPlanMonths, setRenewPlanMonths] = useState<{ [key: string]: number }>({});

  const today = new Date('2026-11-19');

  const getDaysRemaining = (expiryDateStr: string) => {
    const exp = new Date(expiryDateStr);
    const diffTime = exp.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const categorizedMembers = members.map(m => {
    const days = getDaysRemaining(m.expiryDate);
    return { ...m, daysRemaining: days };
  }).filter(m => {
    if (filterType === 'expired') return m.daysRemaining < 0 || m.membershipStatus === 'Expired';
    if (filterType === 'tomorrow') return m.daysRemaining === 1;
    if (filterType === '3days') return m.daysRemaining >= 0 && m.daysRemaining <= 3;
    if (filterType === '7days') return m.daysRemaining >= 0 && m.daysRemaining <= 7;
    return true;
  });

  const handleExecuteRenewal = (member: typeof categorizedMembers[0]) => {
    const months = renewPlanMonths[member.id] || 1;
    const planFee = months * settings.defaultMonthlyFee;

    // Calculate new expiry date from today or current expiry if future
    const baseDate = new Date(member.expiryDate > today.toISOString().split('T')[0] ? member.expiryDate : today);
    baseDate.setMonth(baseDate.getMonth() + months);
    const newExpiry = baseDate.toISOString().split('T')[0];

    const txnId = `TXN-${Math.floor(1000 + Math.random() * 9000)}`;
    const receiptNo = `RCP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const todayStr = '2026-11-19';

    const newTxn: PaymentTransaction = {
      id: txnId,
      memberId: member.id,
      memberName: member.name,
      amount: planFee,
      date: todayStr,
      method: 'UPI',
      receiptNo,
      note: `Membership renewal for ${months} month(s)`,
    };

    onRenewMember(member.id, newExpiry, newTxn);
    alert(`Successfully renewed membership for ${member.name} for ${months} month(s). New expiry: ${newExpiry}`);
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Membership Expiry & Renewals</h2>
        <p className="text-zinc-400 text-sm">Monitor upcoming renewals and execute one-click plan extensions for {settings.gymName}.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filterType === 'all' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
          }`}
        >
          All Members ({members.length})
        </button>
        <button
          onClick={() => setFilterType('7days')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filterType === '7days' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
          }`}
        >
          Expiring in 7 Days
        </button>
        <button
          onClick={() => setFilterType('3days')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filterType === '3days' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
          }`}
        >
          Expiring in 3 Days
        </button>
        <button
          onClick={() => setFilterType('tomorrow')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filterType === 'tomorrow' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
          }`}
        >
          Expiring Tomorrow
        </button>
        <button
          onClick={() => setFilterType('expired')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filterType === 'expired' ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
          }`}
        >
          Already Expired
        </button>
      </div>

      {/* Members Expiry Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/80 border-b border-zinc-800 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Member Name</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4">Status / Days Left</th>
                <th className="py-3.5 px-4">Select Renewal Plan</th>
                <th className="py-3.5 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-sm">
              {categorizedMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-500">
                    No memberships found matching this filter category.
                  </td>
                </tr>
              ) : (
                categorizedMembers.map((member) => {
                  const months = renewPlanMonths[member.id] || 1;
                  const cost = months * settings.defaultMonthlyFee;

                  return (
                    <tr key={member.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">{member.name}</td>
                      <td className="py-3.5 px-4 text-zinc-300">{member.phone}</td>
                      <td className="py-3.5 px-4 font-semibold text-orange-400">{member.expiryDate}</td>
                      <td className="py-3.5 px-4">
                        {member.daysRemaining < 0 ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            Expired ({Math.abs(member.daysRemaining)}d ago)
                          </span>
                        ) : member.daysRemaining === 0 ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Expires Today
                          </span>
                        ) : member.daysRemaining === 1 ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                            Expires Tomorrow
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {member.daysRemaining} days left
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={months}
                          onChange={(e) => setRenewPlanMonths({ ...renewPlanMonths, [member.id]: Number(e.target.value) })}
                          className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                        >
                          <option value={1}>1 Month ({settings.currency}{settings.defaultMonthlyFee})</option>
                          <option value={3}>3 Months ({settings.currency}{settings.defaultMonthlyFee * 3})</option>
                          <option value={6}>6 Months ({settings.currency}{settings.defaultMonthlyFee * 6})</option>
                          <option value={12}>1 Year ({settings.currency}{settings.defaultMonthlyFee * 12})</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleExecuteRenewal(member)}
                            className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-sm transition-colors flex items-center space-x-1"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Renew ({settings.currency}{cost})</span>
                          </button>
                          <button
                            onClick={() => onOpenWhatsApp(member)}
                            className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-colors"
                            title="WhatsApp Renewal Reminder"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
