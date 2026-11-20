import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { Member, GymSettings } from '../types';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (newMember: Member) => void;
  settings: GymSettings;
  existingCount: number;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onAddMember,
  settings,
  existingCount,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [planDurationMonths, setPlanDurationMonths] = useState(1);
  const [planFee, setPlanFee] = useState(settings.defaultMonthlyFee);
  const [paidAmount, setPaidAmount] = useState(settings.defaultMonthlyFee);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Please enter member name and phone number.');
      return;
    }

    const idNum = 1001 + existingCount;
    const id = `TFG-${idNum}`;
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate expiry date
    const startDateObj = new Date(today);
    const expiryDateObj = new Date(startDateObj);
    expiryDateObj.setMonth(expiryDateObj.getMonth() + planDurationMonths);
    const expiryDate = expiryDateObj.toISOString().split('T')[0];

    const pendingAmount = Math.max(0, planFee - paidAmount);
    const paymentStatus = pendingAmount === 0 ? 'Paid' : paidAmount > 0 ? 'Partial' : 'Unpaid';

    const newMember: Member = {
      id,
      name,
      phone,
      joiningDate: today,
      membershipStartDate: today,
      expiryDate,
      planDurationMonths,
      planFee,
      paidAmount,
      pendingAmount,
      paymentStatus,
      attendanceStatus: 'Absent',
      membershipStatus: 'Active',
      notes,
    };

    onAddMember(newMember);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl text-zinc-100">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Register New Member</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mohit Kumar"
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Phone Number *</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Membership Plan</label>
              <select
                value={planDurationMonths}
                onChange={(e) => {
                  const months = Number(e.target.value);
                  setPlanDurationMonths(months);
                  const fee = months * settings.defaultMonthlyFee;
                  setPlanFee(fee);
                  setPaidAmount(fee);
                }}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
              >
                <option value={1}>1 Month ({settings.currency}{settings.defaultMonthlyFee})</option>
                <option value={3}>3 Months ({settings.currency}{settings.defaultMonthlyFee * 3})</option>
                <option value={6}>6 Months ({settings.currency}{settings.defaultMonthlyFee * 6})</option>
                <option value={12}>1 Year ({settings.currency}{settings.defaultMonthlyFee * 12})</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Total Plan Fee ({settings.currency})</label>
              <input
                type="number"
                value={planFee}
                onChange={(e) => setPlanFee(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Paid Amount ({settings.currency})</label>
              <input
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Pending Balance</label>
              <div className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-rose-400 font-bold text-sm flex items-center">
                {settings.currency}{Math.max(0, planFee - paidAmount)}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Notes / Trainer Remarks</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Morning batch, student discount..."
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold shadow-lg shadow-orange-600/30 transition-colors"
            >
              Register Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
