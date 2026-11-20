import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, UserPlus, CreditCard, CalendarClock } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationsCenterProps {
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
}

export const NotificationsCenter: React.FC<NotificationsCenterProps> = ({
  notifications,
  onMarkAllAsRead,
  onClearNotifications,
}) => {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Owner Notification Center</h2>
          <p className="text-zinc-400 text-sm">Real-time alerts for payments, renewals, expiries and member registrations.</p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onMarkAllAsRead}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors"
          >
            Mark All as Read
          </button>
          <button
            onClick={onClearNotifications}
            className="px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 text-xs font-semibold border border-rose-500/30 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="divide-y divide-zinc-800/60">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-zinc-500 text-sm">
              No notifications at this time.
            </div>
          ) : (
            notifications.map(notif => (
              <div 
                key={notif.id} 
                className={`p-4 flex items-start space-x-4 transition-colors ${notif.read ? 'bg-zinc-900' : 'bg-zinc-950/80 border-l-4 border-l-orange-500'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  notif.type === 'payment' ? 'bg-emerald-500/10 text-emerald-400' :
                  notif.type === 'expiry' ? 'bg-amber-500/10 text-amber-400' :
                  notif.type === 'registration' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-orange-500/10 text-orange-400'
                }`}>
                  {notif.type === 'payment' && <CreditCard className="w-5 h-5" />}
                  {notif.type === 'expiry' && <CalendarClock className="w-5 h-5" />}
                  {notif.type === 'registration' && <UserPlus className="w-5 h-5" />}
                  {notif.type !== 'payment' && notif.type !== 'expiry' && notif.type !== 'registration' && <Bell className="w-5 h-5" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{notif.title}</h4>
                    <span className="text-xs text-zinc-500">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-zinc-300 mt-1">{notif.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
