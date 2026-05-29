import { useState } from 'react';
import { Save, Bell, Shield, Activity, Settings } from 'lucide-react';
import Navigation from '../../components/Navigation';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [settings, setSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    slackIntegration: true,
    alertThreshold: 'medium',
    twoFactor: true,
    sessionTimeout: '30',
    autoBlock: '85',
    autoFlag: '60',
  });

  const toggle = (key) => setSettings(p => ({ ...p, [key]: !p[key] }));

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'detection', label: 'Detection', icon: Activity },
    { id: 'system', label: 'System', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">System Settings</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Configure system-wide preferences and security settings</p>
          </div>
          <button className="btn-primary flex items-center gap-2 text-sm">
            <Save size={14} /> Save Changes
          </button>
        </div>

        <div className="card overflow-hidden">
          <div className="flex border-b border-gray-100 dark:border-gray-700">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors border-b-2 ${activeTab === id ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                <Icon size={14} />{label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notification Preferences</h3>
                {[
                  { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive fraud alerts via email' },
                  { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Receive critical alerts via SMS' },
                  { key: 'slackIntegration', label: 'Slack Integration', desc: 'Send alerts to Slack channels' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                      <p className="text-xs text-gray-400">{desc}</p>
                    </div>
                    <button onClick={() => toggle(key)} className={`relative w-10 h-5 rounded-full transition-colors ${settings[key] ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Alert Threshold</p>
                  <select value={settings.alertThreshold} onChange={e => setSettings(p => ({ ...p, alertThreshold: e.target.value }))} className="input text-sm w-64">
                    <option value="low">Low - All alerts</option>
                    <option value="medium">Medium - Important alerts</option>
                    <option value="high">High - Critical only</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-1">Minimum severity level for notifications</p>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Security Settings</h3>
                {[
                  { key: 'twoFactor', label: 'Two-Factor Authentication', desc: 'Require 2FA for all admin logins' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                      <p className="text-xs text-gray-400">{desc}</p>
                    </div>
                    <button onClick={() => toggle(key)} className={`relative w-10 h-5 rounded-full transition-colors ${settings[key] ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Session Timeout (minutes)</p>
                  <input type="number" className="input text-sm w-32" value={settings.sessionTimeout} onChange={e => setSettings(p => ({ ...p, sessionTimeout: e.target.value }))} />
                </div>
              </div>
            )}

            {activeTab === 'detection' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Fraud Detection Settings</h3>
                {[
                  { key: 'autoBlock', label: 'Auto-Block Threshold (%)', desc: 'Automatically block transactions above this risk score' },
                  { key: 'autoFlag', label: 'Auto-Flag Threshold (%)', desc: 'Automatically flag transactions above this risk score' },
                ].map(({ key, label, desc }) => (
                  <div key={key}>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{label}</p>
                    <p className="text-xs text-gray-400 mb-2">{desc}</p>
                    <div className="flex items-center gap-3">
                      <input type="range" min="0" max="100" value={settings[key]} onChange={e => setSettings(p => ({ ...p, [key]: e.target.value }))} className="w-48" />
                      <span className="text-sm font-bold text-gray-900 dark:text-white w-10">{settings[key]}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">System Information</h3>
                {[
                  ['Version', '1.0.0'], ['Environment', 'Production'], ['Database', 'PostgreSQL 15'], ['Cache', 'Redis 7.0'], ['Last Backup', 'April 17, 2026 02:00 AM'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2.5 border-b border-gray-50 dark:border-gray-700">
                    <span className="text-sm text-gray-500">{k}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
