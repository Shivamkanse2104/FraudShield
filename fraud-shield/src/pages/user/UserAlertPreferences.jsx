import { useState } from 'react';
import { Bell, Mail, MessageSquare, Smartphone, CheckCircle } from 'lucide-react';
import Navigation from '../../components/Navigation';

export default function UserAlertPreferences() {
  const [prefs, setPrefs] = useState({
    email: true, sms: false, push: true,
    threshold: 10000, onForeign: true, onNewDevice: true,
    onLarge: true, onBlocked: true, minRisk: 60,
  });
  const [saved, setSaved] = useState(false);
  const toggle = (k) => setPrefs(p => ({ ...p, [k]: !p[k] }));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const Channel = ({ k, label, icon: Icon }) => (
    <div className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors ${prefs[k] ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
      onClick={() => toggle(k)}>
      <Icon size={20} className={prefs[k] ? 'text-blue-500' : 'text-gray-400'} />
      <span className={`text-xs font-medium ${prefs[k] ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>{label}</span>
      {prefs[k] && <CheckCircle size={12} className="text-blue-500" />}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Alert Preferences</h1>
          <p className="text-sm text-gray-500">Choose when and how you receive fraud alerts</p>
        </div>

        <div className="space-y-5 max-w-2xl">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Bell size={15}/> Notification Channels</h3>
            <div className="grid grid-cols-3 gap-3">
              <Channel k="email" label="Email" icon={Mail} />
              <Channel k="sms" label="SMS" icon={MessageSquare} />
              <Channel k="push" label="Push" icon={Smartphone} />
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Alert Triggers</h3>
            <div className="space-y-0">
              {[
                { k: 'onBlocked', label: 'Transaction blocked', desc: 'Alert every time a transaction is automatically blocked' },
                { k: 'onLarge', label: 'Large transaction', desc: `Alert when a single transaction exceeds your threshold` },
                { k: 'onForeign', label: 'Foreign transaction', desc: 'Alert when card is used outside India' },
                { k: 'onNewDevice', label: 'New device login', desc: 'Alert when account is accessed from a new device' },
              ].map(({ k, label, desc }) => (
                <div key={k} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                  <button onClick={() => toggle(k)} className={`relative w-10 h-5 rounded-full transition-colors ${prefs[k] ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${prefs[k] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Thresholds</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Large transaction threshold</span>
                  <span className="font-semibold text-gray-900 dark:text-white">₹{prefs.threshold.toLocaleString()}</span>
                </div>
                <input type="range" min="1000" max="100000" step="1000" value={prefs.threshold}
                  onChange={e => setPrefs(p => ({ ...p, threshold: Number(e.target.value) }))}
                  className="w-full accent-blue-500" />
                <div className="flex justify-between text-xs text-gray-400 mt-0.5"><span>₹1,000</span><span>₹1,00,000</span></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Minimum risk score to alert</span>
                  <span className={`font-semibold ${prefs.minRisk >= 80 ? 'text-red-500' : prefs.minRisk >= 60 ? 'text-amber-500' : 'text-green-500'}`}>{prefs.minRisk}%</span>
                </div>
                <input type="range" min="20" max="90" step="5" value={prefs.minRisk}
                  onChange={e => setPrefs(p => ({ ...p, minRisk: Number(e.target.value) }))}
                  className="w-full accent-blue-500" />
                <div className="flex justify-between text-xs text-gray-400 mt-0.5"><span>20% (all)</span><span>90% (critical only)</span></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={save} className="btn-primary text-sm px-6">Save Preferences</button>
            {saved && <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400"><CheckCircle size={14}/>Saved</span>}
          </div>
        </div>
      </main>
    </div>
  );
}
