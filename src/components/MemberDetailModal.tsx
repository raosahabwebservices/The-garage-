import React from 'react';
import { X, Phone, Calendar, CreditCard, UserCheck, Shield, Send, Trash2 } from 'lucide-react';
import { Member, PaymentTransaction, AttendanceRecord, GymSettings } from '../types';

interface MemberDetailModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
  transactions: PaymentTransaction[];
  attendance: AttendanceRecord[];
  settings: GymSettings;
  onDeleteMember: (id: string) => void;
  onOpenRecordPayment: (member: Member) => void;
  onOpenWhatsApp: (member: Member) => void;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  member,
  isOpen,
  onClose,
  transactions,
  attendance,
  settings,
  onDeleteMember,
  onOpenRecordPayment,
  onOpenWhatsApp,
}) => {
  if (!isOpen || !member) return null;

  const memberTransactions = transactions.filter(t => t.memberId === member.id);
  const memberAttendance = attendance.filter(a => a.memberId === member.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl text-zinc-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 font-black text-xl flex items-center justify-center border border-orange-500/30">
              {member.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-black text-white">{member.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                  {member.id}
                </span>
              </div>
              <p className="text-xs text-zinc-400 flex items-center mt-0.5">
                <Phone className="w-3.5 h-3.5 mr-1 text-orange-400" />
                {member.phone}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            <div className="text-[10px] uppercase font-semibold text-zinc-500">Membership</div>
            <div className={`text-sm font-bold mt-1 ${member.membershipStatus === 'Active' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {member.membershipStatus}
            </div>
          </div>
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            <div className="text-[10px] uppercase font-semibold text-zinc-500">Payment Status</div>
            <div className={`text-sm font-bold mt-1 ${
              member.paymentStatus === 'Paid' ? 'text-emerald-400' :
              member.paymentStatus === 'Partial' ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {member.paymentStatus}
            </div>
          </div>
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            <div className="text-[10px] uppercase font-semibold text-zinc-500">Pending Due</div>
            <div className="text-sm font-bold mt-1 text-rose-400">
              {settings.currency}{member.pendingAmount}
            </div>
          </div>
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            <div className="text-[10px] uppercase font-semibold text-zinc-500">Expiry Date</div>
            <div className="text-sm font-bold mt-1 text-orange-400">
              {member.expiryDate}
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap gap-2.5 pb-4 border-b border-zinc-800">
          <button
            onClick={() => {
              onClose();
              onOpenRecordPayment(member);
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
          
          <button
            onClick={() => {
              onClose();
              onOpenWhatsApp(member);
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>WhatsApp Reminder</span>
          </button>

          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete member ${member.name}?`)) {
                onDeleteMember(member.id);
                onClose();
              }
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 text-xs font-semibold border border-rose-500/30 transition-colors ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Member</span>
          </button>
        </div>

        {/* Additional Details & Notes */}
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-1.5">
              <div className="text-zinc-500 font-semibold uppercase">Joining Info</div>
              <div className="text-zinc-300 flex justify-between">
                <span>Joining Date:</span>
                <span className="font-medium text-white">{member.joiningDate}</span>
              </div>
              <div className="text-zinc-300 flex justify-between">
                <span>Start Date:</span>
                <span className="font-medium text-white">{member.membershipStartDate}</span>
              </div>
              <div className="text-zinc-300 flex justify-between">
                <span>Plan Fee:</span>
                <span className="font-medium text-white">{settings.currency}{member.planFee}</span>
              </div>
            </div>

            <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-1.5">
              <div className="text-zinc-500 font-semibold uppercase">Trainer Notes</div>
              <p className="text-zinc-300 italic">{member.notes || 'No special remarks recorded for this member.'}</p>
            </div>
          </div>

          {/* Payment History */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2 flex items-center">
              <CreditCard className="w-4 h-4 mr-1.5 text-orange-400" />
              Payment Ledger History
            </h4>
            {memberTransactions.length === 0 ? (
              <p className="text-xs text-zinc-500 bg-zinc-950 p-3 rounded-xl">No payment transactions recorded yet.</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {memberTransactions.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                    <div>
                      <span className="font-bold text-white">{tx.receiptNo}</span>
                      <span className="text-zinc-400 ml-2">({tx.date} - {tx.method})</span>
                    </div>
                    <span className="font-extrabold text-emerald-400">+{settings.currency}{tx.amount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Attendance History */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2 flex items-center">
              <UserCheck className="w-4 h-4 mr-1.5 text-orange-400" />
              Recent Attendance Check-Ins
            </h4>
            {memberAttendance.length === 0 ? (
              <p className="text-xs text-zinc-500 bg-zinc-950 p-3 rounded-xl">No attendance records found.</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {memberAttendance.map(att => (
                  <div key={att.id} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                    <span className="font-bold text-white">{att.date}</span>
                    <span className="text-emerald-400 font-semibold">Check-In: {att.checkInTime}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        <div className="pt-4 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
