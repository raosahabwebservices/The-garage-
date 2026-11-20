import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, Phone, AlertTriangle, ExternalLink } from 'lucide-react';
import { Member, GymSettings } from '../types';

interface WhatsAppCenterProps {
  members: Member[];
  settings: GymSettings;
  selectedMemberId?: string | null;
}

export const WhatsAppCenter: React.FC<WhatsAppCenterProps> = ({
  members,
  settings,
  selectedMemberId,
}) => {
  const [templateType, setTemplateType] = useState<'pending_fee' | 'renewal_reminder' | 'custom'>('pending_fee');
  const [customMsg, setCustomMsg] = useState('');

  // Filter members with pending fees or upcoming expiries
  const targetMembers = members.filter(m => {
    if (selectedMemberId && m.id !== selectedMemberId) return false;
    return m.pendingAmount > 0 || m.membershipStatus === 'Expired' || templateType === 'custom';
  });

  const handleOpenWhatsApp = (member: Member) => {
    let message = '';
    const balance = member.pendingAmount > 0 ? member.pendingAmount : settings.defaultMonthlyFee;

    if (templateType === 'pending_fee') {
      message = `Hello ${member.name}, this is a gentle reminder from *${settings.gymName}*, Rohtak. Your gym membership fee outstanding balance is ₹${balance}. Please clear your dues at the earliest. Thank you! 💪`;
    } else if (templateType === 'renewal_reminder') {
      message = `Hello ${member.name}, your membership at *${settings.gymName}* is expiring soon (on ${member.expiryDate}). Please renew your monthly subscription of ₹${settings.defaultMonthlyFee} to continue your training uninterrupted! 🏋️‍♂️`;
    } else {
      message = customMsg || `Hello ${member.name}, greeting from *${settings.gymName}*, Rohtak!`;
    }

    // Format phone number (remove spaces, ensure country code)
    let cleanPhone = member.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }

    const encodedMsg = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

    // Owner confirmation before opening WhatsApp
    const confirmed = window.confirm(
      `Open WhatsApp to send prefilled message to ${member.name} (${member.phone})?\n\nMessage preview:\n"${message}"`
    );

    if (confirmed) {
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">WhatsApp Notification Center</h2>
        <p className="text-zinc-400 text-sm">Generate prefilled WhatsApp reminder links for members with pending dues or upcoming renewals.</p>
      </div>

      {/* Template Selector */}
      <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Select WhatsApp Message Template</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setTemplateType('pending_fee')}
            className={`p-4 rounded-xl border text-left transition-all ${
              templateType === 'pending_fee'
                ? 'bg-orange-500/10 border-orange-500 text-white'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="font-bold text-sm text-white">Pending Fee Reminder</div>
            <p className="text-xs text-zinc-400 mt-1">Includes outstanding balance & payment request.</p>
          </button>

          <button
            onClick={() => setTemplateType('renewal_reminder')}
            className={`p-4 rounded-xl border text-left transition-all ${
              templateType === 'renewal_reminder'
                ? 'bg-orange-500/10 border-orange-500 text-white'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="font-bold text-sm text-white">Membership Renewal</div>
            <p className="text-xs text-zinc-400 mt-1">Alerts member about upcoming/expired subscription.</p>
          </button>

          <button
            onClick={() => setTemplateType('custom')}
            className={`p-4 rounded-xl border text-left transition-all ${
              templateType === 'custom'
                ? 'bg-orange-500/10 border-orange-500 text-white'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="font-bold text-sm text-white">Custom Broadcast</div>
            <p className="text-xs text-zinc-400 mt-1">Type custom message for gym members.</p>
          </button>
        </div>

        {templateType === 'custom' && (
          <div className="pt-2">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Custom Message Text</label>
            <textarea
              rows={2}
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="Enter custom announcement or reminder..."
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>
        )}
      </div>

      {/* Recipient Members List */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center">
          <h3 className="text-sm font-bold text-white">Eligible Recipients ({targetMembers.length})</h3>
          <span className="text-xs text-zinc-400">Requires owner confirmation before opening WhatsApp</span>
        </div>

        <div className="divide-y divide-zinc-800/60">
          {targetMembers.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-sm">
              No members require WhatsApp reminders at this time.
            </div>
          ) : (
            targetMembers.map(member => (
              <div key={member.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-zinc-800/40 transition-colors">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-white">{member.name}</span>
                    <span className="text-xs text-zinc-500 font-mono">({member.id})</span>
                  </div>
                  <div className="text-xs text-zinc-400 flex items-center space-x-3 mt-1">
                    <span className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1 text-orange-400" />{member.phone}</span>
                    <span>Pending Due: <strong className="text-rose-400">{settings.currency}{member.pendingAmount}</strong></span>
                    <span>Expiry: <strong className="text-amber-400">{member.expiryDate}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenWhatsApp(member)}
                  className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 transition-all shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send WhatsApp Message</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
