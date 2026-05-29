import { useState } from 'react';
import { Smartphone, Laptop, Monitor, Tablet, Plus, X, Clock, MapPin, CheckCircle, Trash2 } from 'lucide-react';
import Navigation from '../../components/Navigation';
import { useAuth } from '../../context/AuthContext';
import { useUserData } from '../../context/UserDataContext';

const DeviceIcon = ({ type }) => {
  const cls = "text-gray-500";
  if (type === 'Mobile') return <Smartphone size={18} className={cls} />;
  if (type === 'Laptop') return <Laptop size={18} className={cls} />;
  if (type === 'Tablet') return <Tablet size={18} className={cls} />;
  return <Monitor size={18} className={cls} />;
};

export default function UserDevices() {
  const { user } = useAuth();
  const { getUserData, addDevice, removeDevice } = useUserData();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'Mobile', os: '', location: '' });

  const data = getUserData(user?.id);
  const devices = data.devices;

  const handleAdd = () => {
    if (!form.name || !form.os || !form.location) return;
    addDevice(user.id, {
      id: `DEV-${Date.now()}`,
      ...form,
      lastUsed: 'Just now',
      trusted: true,
    });
    setForm({ name: '', type: 'Mobile', os: '', location: '' });
    setShowModal(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Devices</h1>
            <p className="text-sm text-gray-500">Manage devices linked to your account</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={14} /> Add Device
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card p-4">
            <p className="text-xs text-gray-400 mb-1">Active Devices</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{devices.length}</p>
            <p className="text-xs text-green-500 mt-1">All devices trusted</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-gray-400 mb-1">Last Activity</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">2m</p>
            <p className="text-xs text-gray-400 mt-1">ago from iPhone</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-gray-400 mb-1">New Device Alerts</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
            <p className="text-xs text-green-500 mt-1">No suspicious activity</p>
          </div>
        </div>

        {devices.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Smartphone size={24} className="text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">No Devices Added</h3>
            <p className="text-sm text-gray-400 mb-4">Add your trusted devices to enhance account security</p>
            <button onClick={() => setShowModal(true)} className="btn-primary text-sm">Add Your First Device</button>
          </div>
        ) : (
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Linked Devices</h3>
            <div className="space-y-3">
              {devices.map(device => (
                <div key={device.id} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                      <DeviceIcon type={device.type} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{device.name}</p>
                        {device.trusted && <span className="badge-success flex items-center gap-1"><CheckCircle size={9} />Trusted</span>}
                        <span className="text-xs text-green-500 font-medium">• Active</span>
                      </div>
                      <p className="text-xs text-gray-400">{device.os}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                        <span className="flex items-center gap-1"><Clock size={10} />Last seen {device.lastUsed}</span>
                        <span className="flex items-center gap-1"><MapPin size={10} />{device.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-xs text-blue-500 hover:text-blue-600 font-medium px-2 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">View Activity</button>
                    <button onClick={() => removeDevice(user.id, device.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="card p-6 w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Add New Device</h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400"><X size={16} /></button>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Device Name', key: 'name', placeholder: 'My iPhone 14', type: 'text' },
                  { label: 'Operating System', key: 'os', placeholder: 'iOS 17.2', type: 'text' },
                  { label: 'Location', key: 'location', placeholder: 'Mumbai, India', type: 'text' },
                ].map(({ label, key, placeholder, type }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                    <input type={type} className="input text-sm" placeholder={placeholder} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Device Type</label>
                  <select className="input text-sm" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                    {['Mobile', 'Laptop', 'Desktop', 'Tablet'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={() => setShowModal(false)} className="btn-secondary text-sm flex-1">Cancel</button>
                <button onClick={handleAdd} className="btn-primary text-sm flex-1">Add Device</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
