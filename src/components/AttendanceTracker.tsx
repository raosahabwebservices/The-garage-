import React, { useState } from 'react';
import { UserCheck, CheckCircle2, Clock, Search, UserX, Calendar } from 'lucide-react';
import { Member, AttendanceRecord, GymSettings } from '../types';

interface AttendanceTrackerProps {
  members: Member[];
  attendance: AttendanceRecord[];
  settings: GymSettings;
  onCheckIn: (memberId: string) => void;
  onCheckOut: (attendanceId: string) => void;
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  members,
  attendance,
  settings,
  onCheckIn,
  onCheckOut,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const todayStr = new Date().toISOString().split('T')[0];

  const todaysCheckIns = attendance.filter(a => a.date === todayStr);
  const checkedInMemberIds = new Set(todaysCheckIns.map(a => a.memberId));

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.phone.includes(searchTerm) ||
    m.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Attendance & Daily Check-In</h2>
          <p className="text-zinc-400 text-sm">Track daily gym entries, present rosters, and prevent duplicate check-ins for {settings.gymName}.</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl flex items-center space-x-3">
          <UserCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-[10px] uppercase text-zinc-500 font-semibold">Today's Present</div>
            <div className="text-lg font-black text-white">{todaysCheckIns.length} Members</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Quick Check-In Roster */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center">
            <UserCheck className="w-5 h-5 text-orange-400 mr-2" />
            Member Check-In Roster
          </h3>

          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search member to check-in..."
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
            {filteredMembers.map(member => {
              const isCheckedIn = checkedInMemberIds.has(member.id);

              return (
                <div key={member.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white">{member.name}</span>
                      <span className="text-xs text-zinc-500">({member.id})</span>
                    </div>
                    <div className="text-xs text-zinc-400">Status: <span className={member.membershipStatus === 'Active' ? 'text-emerald-400' : 'text-rose-400'}>{member.membershipStatus}</span></div>
                  </div>

                  <div>
                    {isCheckedIn ? (
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Checked-In
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          if (member.membershipStatus === 'Expired') {
                            if (!confirm(`Warning: ${member.name}'s membership is expired. Check in anyway?`)) return;
                          }
                          onCheckIn(member.id);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-sm transition-colors"
                      >
                        Check-In
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Log & Check-Out */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center">
            <Clock className="w-5 h-5 text-orange-400 mr-2" />
            Today's Check-In Log ({todayStr})
          </h3>

          <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
            {todaysCheckIns.length === 0 ? (
              <div className="text-center py-16 text-zinc-500 text-sm">
                No check-ins recorded yet today. Use the roster on the left to check in members.
              </div>
            ) : (
              todaysCheckIns.map(att => (
                <div key={att.id} className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div>
                    <div className="text-sm font-bold text-white">{att.memberName}</div>
                    <div className="text-xs text-emerald-400 mt-0.5 flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" /> Check-in time: {att.checkInTime}
                    </div>
                  </div>

                  <div>
                    {att.checkOutTime ? (
                      <span className="text-xs text-zinc-400 font-medium bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
                        Out: {att.checkOutTime}
                      </span>
                    ) : (
                      <button
                        onClick={() => onCheckOut(att.id)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors"
                      >
                        Record Check-Out
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
