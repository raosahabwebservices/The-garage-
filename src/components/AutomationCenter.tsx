import React, { useState } from 'react';
import { Cpu, Zap, Play, CheckCircle2, AlertCircle, ShieldAlert, Send } from 'lucide-react';
import { Member, AutomationLog, GymSettings } from '../types';

interface AutomationCenterProps {
  members: Member[];
  automationLogs: AutomationLog[];
  settings: GymSettings;
  onRunAutomation: () => void;
  setActiveTab: (tab: string) => void;
}

export const AutomationCenter: React.FC<AutomationCenterProps> = ({
  members,
  automationLogs,
  settings,
  onRunAutomation,
  setActiveTab,
}) => {
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      onRunAutomation();
      setIsRunning(false);
    }, 800);
  };

  // Compute stats for current scan preview
  const unpaidCount = members.filter(m => m.pendingAmount > 0).length;
  const expiringCount = members.filter(m => {
    if (m.membershipStatus !== 'Active') return false;
    const today = new Date('2026-11-19');
    const expiry = new Date(m.expiryDate);
    const diff = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff >= 0 && diff <= 7;
  }).length;
  const expiredCount = members.filter(m => m.membershipStatus === 'Expired').length;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Automation & Smart Reminders</h2>
          <p className="text-zinc-400 text-sm">Scan dues, expiries and generate automated owner summaries for {settings.gymName}.</p>
        </div>
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-xl shadow-orange-600/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Running Automation Scan...' : 'Run Daily Automation'}</span>
        </button>
      </div>

      {/* Notice Banner */}
      <div className="bg-zinc-900 border border-orange-500/30 rounded-2xl p-5 flex items-start space-x-4">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
          <Zap className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-sm text-zinc-300">
          <div className="font-bold text-white">Manual Automation Control Center</div>
          <p className="text-zinc-400 text-xs">
            As requested, automated scans run on command. No background cron scheduler is active. Clicking "Run Daily Automation" scans all {members.length} member records, detects unpaid dues, upcoming expiries within 7 days, and generates prefilled WhatsApp reminder links and owner daily summaries.
          </p>
        </div>
      </div>

      {/* Live Scan Preview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
          <div className="text-xs text-zinc-500 font-semibold uppercase">Fee Reminders Pending</div>
          <div className="text-3xl font-black text-rose-400 mt-2">{unpaidCount} Accounts</div>
          <p className="text-xs text-zinc-400 mt-1">Unpaid or partial fee balances detected.</p>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className="mt-4 text-xs font-bold text-orange-400 hover:underline flex items-center"
          >
            Open WhatsApp Center <Send className="w-3 h-3 ml-1" />
          </button>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
          <div className="text-xs text-zinc-500 font-semibold uppercase">Renewal Alerts (7 Days)</div>
          <div className="text-3xl font-black text-amber-400 mt-2">{expiringCount} Members</div>
          <p className="text-xs text-zinc-400 mt-1">Memberships expiring soon.</p>
          <button
            onClick={() => setActiveTab('expiry')}
            className="mt-4 text-xs font-bold text-orange-400 hover:underline flex items-center"
          >
            View Expiries <Send className="w-3 h-3 ml-1" />
          </button>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
          <div className="text-xs text-zinc-500 font-semibold uppercase">Expired Memberships</div>
          <div className="text-3xl font-black text-rose-500 mt-2">{expiredCount} Members</div>
          <p className="text-xs text-zinc-400 mt-1">Expired memberships needing follow-up.</p>
          <button
            onClick={() => setActiveTab('expiry')}
            className="mt-4 text-xs font-bold text-orange-400 hover:underline flex items-center"
          >
            Manage Renewals <Send className="w-3 h-3 ml-1" />
          </button>
        </div>
      </div>

      {/* Execution History */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center">
          <Cpu className="w-5 h-5 text-orange-400 mr-2" />
          Automation Execution History Log
        </h3>

        <div className="space-y-3">
          {automationLogs.map(log => (
            <div key={log.id} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-white">{log.title}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {log.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-300">{log.description}</p>
                <p className="text-[11px] text-zinc-500 italic">{log.details}</p>
              </div>
              <div className="text-xs font-mono text-zinc-400 shrink-0">
                {log.timestamp}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
