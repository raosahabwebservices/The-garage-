import React, { useState } from 'react';
import { Settings, Save, Download, Upload, RotateCcw, ShieldCheck } from 'lucide-react';
import { GymSettings } from '../types';

interface SettingsViewProps {
  settings: GymSettings;
  onUpdateSettings: (newSettings: GymSettings) => void;
  onExportData: () => void;
  onResetDemoData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onExportData,
  onResetDemoData,
}) => {
  const [gymName, setGymName] = useState(settings.gymName);
  const [location, setLocation] = useState(settings.location);
  const [phone, setPhone] = useState(settings.phone);
  const [ownerName, setOwnerName] = useState(settings.ownerName);
  const [defaultMonthlyFee, setDefaultMonthlyFee] = useState(settings.defaultMonthlyFee);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      gymName,
      location,
      phone,
      ownerName,
      defaultMonthlyFee,
    });
    setSuccessMsg('Settings updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Gym Settings & Data Controls</h2>
        <p className="text-zinc-400 text-sm">Configure gym profile, default monthly fees, and manage local storage backup/reset.</p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Settings Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl lg:col-span-2">
          <h3 className="text-base font-bold text-white mb-4 flex items-center">
            <Settings className="w-5 h-5 text-orange-400 mr-2" />
            General Gym Configuration
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Gym Name</label>
                <input
                  type="text"
                  value={gymName}
                  onChange={(e) => setGymName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Owner Name</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Location / Address</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Default Monthly Fee ({settings.currency})</label>
              <input
                type="number"
                value={defaultMonthlyFee}
                onChange={(e) => setDefaultMonthlyFee(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm shadow-lg shadow-orange-600/30 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </button>
            </div>
          </form>
        </div>

        {/* Data Backup & Reset */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center">
            <ShieldCheck className="w-5 h-5 text-orange-400 mr-2" />
            Data Backup & Storage
          </h3>

          <p className="text-xs text-zinc-400">
            All data is persisted locally in browser <code className="text-orange-400">localStorage</code>. You can export a backup JSON file or reset demo data anytime.
          </p>

          <div className="space-y-3">
            <button
              onClick={onExportData}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-sm font-semibold border border-zinc-700 transition-colors"
            >
              <Download className="w-4 h-4 text-orange-400" />
              <span>Export Backup JSON</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset all data back to the 20 fictional demo members? Any new changes will be replaced.')) {
                  onResetDemoData();
                }
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 text-sm font-semibold border border-rose-500/30 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset 20 Demo Members</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
