import React, { useState } from 'react';
import { X, CreditCard, DollarSign } from 'lucide-react';
import { Member, GymSettings, PaymentTransaction } from '../types';

interface RecordPaymentModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
  onSavePayment: (transaction: PaymentTransaction, updatedMember: Member) => void;
  settings: GymSettings;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  member,
  isOpen,
  onClose,
  onSavePayment,
  settings,
}) => {
  if (!isOpen || !member) return null;

  const [amount, setAmount] = useState(member.pendingAmount > 0 ? member.pendingAmount : settings.defaultMonthlyFee);
  const [method, setMethod] = useState<'Cash' | 'UPI' | 'Card' | 'Bank Transfer'>('UPI');
  const [note, setNote] = useState('Monthly membership fee payment');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const txnId = `TXN-${Math.floor(1000 + Math.random() * 9000)}`;
    const receiptNo = `RCP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newTxn: PaymentTransaction = {
      id: txnId,
      memberId: member.id,
      memberName: member.name,
      amount,
      date: today,
      method,
      receiptNo,
      note,
    };

    const newPaidAmount = member.paidAmount + amount;
    const newPendingAmount = Math.max(0, member.planFee - newPaidAmount);
    const newPaymentStatus = newPendingAmount === 0 ? 'Paid' : 'Partial';

    const updatedMember: Member = {
      ...member,
      paidAmount: newPaidAmount,
      pendingAmount: newPendingAmount,
      paymentStatus: newPaymentStatus,
    };

    onSavePayment(newTxn, updatedMember);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl p-6 shadow-2xl text-zinc-100">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Record Fee Payment</h3>
              <p className="text-xs text-zinc-400">{member.name} ({member.id})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex justify-between items-center text-xs">
            <div>
              <span className="text-zinc-500">Plan Fee:</span> <strong className="text-white">{settings.currency}{member.planFee}</strong>
            </div>
            <div>
              <span className="text-zinc-500">Pending Due:</span> <strong className="text-rose-400">{settings.currency}{member.pendingAmount}</strong>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Payment Amount ({settings.currency}) *</label>
            <input
              type="number"
              required
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm font-bold focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Payment Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
            >
              <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
              <option value="Cash">Cash</option>
              <option value="Card">Debit / Credit Card</option>
              <option value="Bank Transfer">Bank Transfer (IMPS/NEFT)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Notes / Receipt Remarks</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. November fee installment"
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold shadow-lg shadow-orange-600/30"
            >
              Confirm & Save Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
