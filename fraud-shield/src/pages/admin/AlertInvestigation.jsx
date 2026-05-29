import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, MapPin, Activity, User, Clock, CheckCircle, XCircle } from 'lucide-react';
import Navigation from '../../components/Navigation';

export default function AlertInvestigation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get('id') || 'ALT-001';

  const alerts = {
    'ALT-001': { title: 'Multiple high-risk transactions detected', type: 'High Risk', priority: 'High', desc: '5 transactions from same IP address in 10 minutes', user: 'Robert Brown', userId: 'user-005', riskScore: 88, amount: 45000, time: '2 minutes ago', status: 'new' },
    'ALT-003': { title: 'Impossible travel pattern', type: 'Location', priority: 'High', desc: 'Card used in NY and CA within 30 minutes', user: 'Mike Johnson', userId: 'user-003', riskScore: 92, amount: 21000, time: '15 minutes ago', status: 'investigating' },
  };
  const alert = alerts[id] || alerts['ALT-001'];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-6">
        <button onClick={() => navigate('/admin/alerts')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-5">
          <ArrowLeft size={16} /> Back to Alerts
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Alert Investigation</h1>
              <span className="badge-danger">{alert.priority} Priority</span>
              <span className="badge-warning">{alert.status}</span>
            </div>
            <p className="text-sm text-gray-500">{alert.title}</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary text-sm flex items-center gap-2"><CheckCircle size={14} /> Mark False Positive</button>
            <button className="btn-secondary text-sm flex items-center gap-2 text-red-600"><XCircle size={14} /> Confirm Fraud</button>
            <button className="btn-primary text-sm">Close Investigation</button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="card p-5 col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertTriangle size={14} className="text-red-500" /> Alert Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Alert ID', id], ['Type', alert.type], ['Risk Score', `${alert.riskScore}%`],
                ['Amount', `₹${alert.amount.toLocaleString()}`], ['Time', alert.time], ['Status', alert.status],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-gray-400 mb-0.5">{k}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-400 mb-1">Description</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{alert.desc}</p>
            </div>

            {/* Risk gauge */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-400">Risk Assessment</span>
                <span className="font-bold text-red-500">{alert.riskScore}%</span>
              </div>
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-3 rounded-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500" style={{ width: `${alert.riskScore}%` }} />
              </div>
              <div className="flex justify-between text-xs mt-1 text-gray-400">
                <span>Low</span><span>Medium</span><span>High</span><span>Critical</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <User size={14} /> User Profile
              </h3>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.user}</p>
              <p className="text-xs text-gray-400 mb-3">{alert.userId}</p>
              <button onClick={() => navigate(`/admin/user-details?id=${alert.userId}`)} className="btn-secondary text-xs py-1.5 w-full">View Full Profile</button>
            </div>

            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Resolution</h3>
              <div className="space-y-2">
                {['Legitimate transaction', 'Confirmed fraud', 'False positive', 'Pending verification', 'Escalated to authorities'].map(r => (
                  <label key={r} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="resolution" className="text-blue-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{r}</span>
                  </label>
                ))}
              </div>
              <button className="btn-primary text-xs py-1.5 w-full mt-3">Submit Resolution</button>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock size={14} /> Investigation Timeline
          </h3>
          <div className="space-y-3">
            {[
              { time: 'Just now', event: 'Investigation opened', icon: Activity, color: 'bg-blue-500' },
              { time: '2m ago', event: 'Alert triggered: 5 transactions from same IP in 10 minutes', icon: AlertTriangle, color: 'bg-red-500' },
              { time: '5m ago', event: 'High-risk transaction flagged: ₹45,000 at Unknown Merchant', icon: AlertTriangle, color: 'bg-amber-500' },
              { time: '10m ago', event: 'User logged in from new device (Berlin, Germany)', icon: MapPin, color: 'bg-purple-500' },
            ].map(({ time, event, icon: Icon, color }) => (
              <div key={event} className="flex items-start gap-3">
                <div className={`w-7 h-7 ${color} rounded-full flex items-center justify-center shrink-0`}>
                  <Icon size={12} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{event}</p>
                  <p className="text-xs text-gray-400">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
