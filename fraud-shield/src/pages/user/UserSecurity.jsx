import { useState } from 'react';
import { Shield, Smartphone, Lock, Key, AlertTriangle, CheckCircle, Trash2, Eye, EyeOff, Star, Zap } from 'lucide-react';
import Navigation from '../../components/Navigation';
import { useAuth } from '../../context/AuthContext';

const ACTIVE_SESSIONS = [
  { id: 1, device: 'iPhone 14 Pro', location: 'Mumbai, India', lastSeen: '2 minutes ago', current: true, ip: '103.21.x.x' },
  { id: 2, device: 'MacBook Pro', location: 'Mumbai, India', lastSeen: '1 hour ago', current: false, ip: '103.21.x.x' },
  { id: 3, device: 'Chrome / Windows', location: 'Delhi, India', lastSeen: '3 days ago', current: false, ip: '45.113.x.x' },
];

const SECURITY_TIPS = [
  { id: 1, title: 'Enable MFA', desc: 'Add a second layer of login verification', points: 30, done: false },
  { id: 2, title: 'Verified phone number', desc: 'Allows SMS alerts and MFA', points: 20, done: true },
  { id: 3, title: 'Strong password', desc: 'Use 12+ characters with symbols', points: 20, done: true },
  { id: 4, title: 'Review trusted devices', desc: 'Remove devices you no longer use', points: 15, done: false },
  { id: 5, title: 'Set alert preferences', desc: 'Configure what triggers notifications', points: 15, done: true },
];

export default function UserSecurity() {
  const { user } = useAuth();
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [showMfaSetup, setShowMfaSetup] = useState(false);
  const [sessions, setSessions] = useState(ACTIVE_SESSIONS);
  const [tips, setTips] = useState(SECURITY_TIPS);

  const securityScore = tips.filter(t => t.done).reduce((s, t) => s + t.points, 0);
  const scoreColor = securityScore >= 80 ? 'text-green-500' : securityScore >= 50 ? 'text-amber-500' : 'text-red-500';
  const scoreBar = securityScore >= 80 ? 'bg-green-500' : securityScore >= 50 ? 'bg-amber-500' : 'bg-red-500';

  const terminateSession = (id) => setSessions(s => s.filter(x => x.id !== id));

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Security Centre</h1>
          <p className="text-sm text-gray-500">Manage your account security settings</p>
        </div>

        <div className="grid grid-cols-3 gap-5">
          {/* Security Score */}
          <div className="card p-5 col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Star size={16} className="text-amber-500" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Security Score</h3>
            </div>
            <div className="text-center mb-4">
              <p className={`text-5xl font-bold ${scoreColor}`}>{securityScore}</p>
              <p className="text-xs text-gray-400 mt-1">out of 100</p>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full mt-3">
                <div className={`h-2 rounded-full transition-all ${scoreBar}`} style={{ width: `${securityScore}%` }} />
              </div>
            </div>
            <div className="space-y-2">
              {tips.map(tip => (
                <div key={tip.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 dark:border-gray-700 last:border-0">
                  <div className="flex items-center gap-2">
                    {tip.done
                      ? <CheckCircle size={13} className="text-green-500 shrink-0" />
                      : <div className="w-3 h-3 rounded-full border-2 border-gray-300 shrink-0" />}
                    <span className={`text-xs ${tip.done ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300'}`}>{tip.title}</span>
                  </div>
                  <span className="text-xs text-amber-500 font-medium">+{tip.points}pts</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-2 space-y-5">
            {/* MFA */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Key size={16} className="text-blue-500" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Two-Factor Authentication (MFA)</h3>
                </div>
                <button
                  onClick={() => { setMfaEnabled(!mfaEnabled); setShowMfaSetup(!mfaEnabled); }}
                  className={`relative w-10 h-5 rounded-full transition-colors ${mfaEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${mfaEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {!mfaEnabled && (
                <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-700 dark:text-amber-400">MFA is disabled. Your account is less secure. Enable it to protect against account takeover.</p>
                </div>
              )}

              {showMfaSetup && (
                <div className="mt-4 p-4 border border-blue-100 dark:border-blue-800 rounded-xl bg-blue-50/50 dark:bg-blue-900/10">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">Choose MFA method:</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: Smartphone, label: 'Authenticator app', sub: 'Google/Authy', recommended: true },
                      { icon: Lock, label: 'SMS OTP', sub: 'Via phone number' },
                      { icon: Key, label: 'Email OTP', sub: 'Via email address' },
                    ].map(({ icon: Icon, label, sub, recommended }) => (
                      <button key={label} className="p-3 border-2 border-blue-200 dark:border-blue-700 hover:border-blue-500 rounded-xl text-left transition-colors relative">
                        {recommended && <span className="absolute -top-2 left-2 badge-info text-[10px]">Recommended</span>}
                        <Icon size={16} className="text-blue-500 mb-1" />
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</p>
                        <p className="text-xs text-gray-400">{sub}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {mfaEnabled && !showMfaSetup && (
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle size={14} className="text-green-500" />
                  <p className="text-xs text-green-600 dark:text-green-400">MFA active via Authenticator app</p>
                </div>
              )}
            </div>

            {/* Active Sessions */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-purple-500" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Active Sessions</h3>
                </div>
                <button className="text-xs text-red-500 hover:text-red-600 font-medium">Terminate all others</button>
              </div>
              <div className="space-y-2">
                {sessions.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${s.current ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{s.device}</p>
                          {s.current && <span className="badge-success text-[10px]">Current</span>}
                        </div>
                        <p className="text-xs text-gray-400">{s.location} · {s.ip} · {s.lastSeen}</p>
                      </div>
                    </div>
                    {!s.current && (
                      <button onClick={() => terminateSession(s.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-500">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Block */}
            <div className="card p-5 border-red-100 dark:border-red-900/30">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} className="text-red-500" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Emergency Block</h3>
              </div>
              <p className="text-xs text-gray-500 mb-3">Instantly block ALL outgoing transactions if you suspect your account is compromised. Contact support to reverse.</p>
              <button className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                <Zap size={14} /> Quick Block All Transactions
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
