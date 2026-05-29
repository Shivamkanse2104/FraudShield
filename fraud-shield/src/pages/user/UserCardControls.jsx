import { useState } from 'react';
import { CreditCard, Globe, Monitor, Building, MapPin, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import Navigation from '../../components/Navigation';

export default function UserCardControls() {
  const [controls, setControls] = useState({
    frozen: false,
    daily_limit: 100000,
    per_tx_limit: 50000,
    international: false,
    online: false,
    atm: false,
    travel_mode: false,
    travel_countries: '',
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key) => setControls(p => ({ ...p, [key]: !p[key] }));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const Toggle = ({ k, label, desc, icon: Icon, danger }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${danger ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
          <Icon size={14} className={danger ? 'text-red-500' : 'text-gray-500'} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
          <p className="text-xs text-gray-400">{desc}</p>
        </div>
      </div>
      <button onClick={() => toggle(k)} className={`relative w-10 h-5 rounded-full transition-colors ${controls[k] ? (danger ? 'bg-red-500' : 'bg-blue-500') : 'bg-gray-300 dark:bg-gray-600'}`}>
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${controls[k] ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Card Controls</h1>
          <p className="text-sm text-gray-500">Manage card access and spending limits</p>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* Card status */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CreditCard size={15} /> Card Status
            </h3>
            <div className={`p-4 rounded-xl mb-4 flex items-center justify-between ${controls.frozen ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
              <div>
                <p className={`text-sm font-semibold ${controls.frozen ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                  {controls.frozen ? '🔒 Card Frozen' : '✓ Card Active'}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">••••  ••••  ••••  3847</p>
              </div>
              <button onClick={() => toggle('frozen')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${controls.frozen ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}>
                {controls.frozen ? 'Unfreeze' : 'Freeze'}
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Daily spending limit</span>
                  <span className="font-semibold text-gray-900 dark:text-white">₹{controls.daily_limit.toLocaleString()}</span>
                </div>
                <input type="range" min="5000" max="500000" step="5000" value={controls.daily_limit}
                  onChange={e => setControls(p => ({ ...p, daily_limit: Number(e.target.value) }))}
                  className="w-full accent-blue-500" />
                <div className="flex justify-between text-xs text-gray-400 mt-0.5"><span>₹5k</span><span>₹5L</span></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Per-transaction limit</span>
                  <span className="font-semibold text-gray-900 dark:text-white">₹{controls.per_tx_limit.toLocaleString()}</span>
                </div>
                <input type="range" min="1000" max="200000" step="1000" value={controls.per_tx_limit}
                  onChange={e => setControls(p => ({ ...p, per_tx_limit: Number(e.target.value) }))}
                  className="w-full accent-blue-500" />
                <div className="flex justify-between text-xs text-gray-400 mt-0.5"><span>₹1k</span><span>₹2L</span></div>
              </div>
            </div>
          </div>

          {/* Block toggles */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Globe size={15} /> Channel Controls
            </h3>
            <Toggle k="international" label="Block international transactions" desc="Decline any transaction outside India" icon={Globe} danger />
            <Toggle k="online" label="Block online transactions" desc="Decline all card-not-present payments" icon={Monitor} danger />
            <Toggle k="atm" label="Block ATM withdrawals" desc="Decline all cash withdrawal attempts" icon={Building} danger />
          </div>

          {/* Travel mode */}
          <div className="card p-5 col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-blue-500" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Travel Mode</h3>
              </div>
              <button onClick={() => toggle('travel_mode')} className={`relative w-10 h-5 rounded-full transition-colors ${controls.travel_mode ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${controls.travel_mode ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
            {controls.travel_mode && (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Countries (e.g. US, UK, AE)</label>
                  <input className="input text-sm" placeholder="US, UK, AE" value={controls.travel_countries}
                    onChange={e => setControls(p => ({ ...p, travel_countries: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Travel from</label>
                  <input type="date" className="input text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Travel to</label>
                  <input type="date" className="input text-sm" />
                </div>
              </div>
            )}
            {!controls.travel_mode && (
              <p className="text-xs text-gray-400">Enable travel mode before travelling abroad to prevent false fraud blocks on your foreign transactions.</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5">
          <button onClick={save} className="btn-primary text-sm px-6">Save Changes</button>
          {saved && <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400"><CheckCircle size={14} /> Saved successfully</span>}
        </div>
      </main>
    </div>
  );
}
