import React, { useState } from 'react';
import { Search, Filter, Plus, Phone, Calendar, ChevronRight, UserX, CreditCard, Send } from 'lucide-react';
import { Member, GymSettings } from '../types';

interface MembersListProps {
  members: Member[];
  settings: GymSettings;
  onOpenAddMember: () => void;
  onSelectMember: (member: Member) => void;
  onOpenRecordPayment: (member: Member) => void;
  onOpenWhatsApp: (member: Member) => void;
  onDeleteMember: (id: string) => void;
}

export const MembersList: React.FC<MembersListProps> = ({
  members,
  settings,
  onOpenAddMember,
  onSelectMember,
  onOpenRecordPayment,
  onOpenWhatsApp,
  onDeleteMember,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');

  // Filter members
  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.phone.includes(searchTerm) ||
                          m.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || m.membershipStatus === statusFilter;
    const matchesPayment = paymentFilter === 'All' || m.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Member Directory</h2>
          <p className="text-zinc-400 text-sm">Manage all active and expired gym subscriptions at {settings.gymName}.</p>
        </div>
        <button
          onClick={onOpenAddMember}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm shadow-lg shadow-orange-600/30 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Member Registration</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, ID or phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
          >
            <option value="All">All Memberships (Active & Expired)</option>
            <option value="Active">Active Only</option>
            <option value="Expired">Expired Only</option>
          </select>
        </div>

        <div>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
          >
            <option value="All">All Payment Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/80 border-b border-zinc-800 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Member</th>
                <th className="py-3.5 px-4">Phone / ID</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4">Plan Fee</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Membership</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-sm">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-500">
                    No members found matching your search or filters.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr 
                    key={member.id} 
                    className="hover:bg-zinc-800/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectMember(member)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 font-bold flex items-center justify-center border border-orange-500/20">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-orange-400 transition-colors">
                            {member.name}
                          </div>
                          <div className="text-xs text-zinc-500">Joined: {member.joiningDate}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-zinc-300">{member.phone}</div>
                      <div className="text-xs text-zinc-500 font-mono">{member.id}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-zinc-300 font-medium">{member.expiryDate}</div>
                      {member.membershipStatus === 'Expired' && (
                        <span className="text-[10px] text-rose-400 font-bold uppercase">Expired</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{settings.currency}{member.planFee}</div>
                      {member.pendingAmount > 0 && (
                        <div className="text-xs text-rose-400 font-semibold">Due: {settings.currency}{member.pendingAmount}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        member.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        member.paymentStatus === 'Partial' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {member.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        member.membershipStatus === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {member.membershipStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onOpenRecordPayment(member)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-orange-600 hover:text-white text-zinc-300 transition-colors"
                          title="Record Payment"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenWhatsApp(member)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-emerald-600 hover:text-white text-zinc-300 transition-colors"
                          title="WhatsApp Reminder"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onSelectMember(member)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                          title="View Details"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 text-xs text-zinc-500 flex justify-between items-center">
          <span>Showing {filteredMembers.length} of {members.length} total members</span>
          <span>The Fitness Garage • Rohtak</span>
        </div>
      </div>
    </div>
  );
};
