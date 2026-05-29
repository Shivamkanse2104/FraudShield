import { FileText, Download, Calendar, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import Navigation from '../../components/Navigation';

const REPORTS = [
  { id: 'R001', name: 'Monthly Fraud Analysis Report', type: 'Fraud Analysis', date: 'April 1, 2026', size: '2.4 MB', status: 'completed' },
  { id: 'R002', name: 'Transaction Volume Report', type: 'Transactions', date: 'April 10, 2026', size: '1.8 MB', status: 'completed' },
  { id: 'R003', name: 'User Activity Summary', type: 'Users', date: 'April 12, 2026', size: '890 KB', status: 'completed' },
  { id: 'R004', name: 'Risk Score Distribution', type: 'Analytics', date: 'April 14, 2026', size: '—', status: 'processing' },
  { id: 'R005', name: 'Weekly Performance Metrics', type: 'Performance', date: 'April 15, 2026', size: '—', status: 'scheduled' },
];

const statusConfig = {
  completed: { label: 'completed', cls: 'badge-success', icon: CheckCircle },
  processing: { label: 'processing', cls: 'badge-warning', icon: Clock },
  scheduled: { label: 'scheduled', cls: 'badge-info', icon: Calendar },
};

export default function AdminReports() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Generate and download system reports</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Reports', value: 24, icon: FileText, color: 'bg-blue-500' },
            { label: 'Completed', value: 18, icon: CheckCircle, color: 'bg-green-500' },
            { label: 'Scheduled', value: 3, icon: Calendar, color: 'bg-amber-500' },
            { label: 'Downloads', value: 156, icon: Download, color: 'bg-purple-500' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon size={16} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-medium">Filters:</span>
            </div>
            <select className="input text-xs py-1.5 w-36">
              <option>Last 30 days</option><option>Last 7 days</option><option>All time</option>
            </select>
            <select className="input text-xs py-1.5 w-36">
              <option>All Types</option><option>Fraud Analysis</option><option>Transactions</option>
            </select>
            <button className="btn-primary text-xs py-1.5 ml-auto flex items-center gap-2">
              <FileText size={14} /> Generate Report
            </button>
          </div>

          <div className="space-y-3">
            {REPORTS.map(report => {
              const cfg = statusConfig[report.status];
              const Icon = cfg.icon;
              return (
                <div key={report.id} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <FileText size={16} className="text-blue-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{report.name}</span>
                        <span className={cfg.cls}>{cfg.label}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                        <span>Type: {report.type}</span>
                        <span className="flex items-center gap-1"><Calendar size={11} />{report.date}</span>
                        {report.size !== '—' && <span>Size: {report.size}</span>}
                      </div>
                    </div>
                  </div>
                  {report.status === 'completed' && (
                    <button className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5">
                      <Download size={13} /> Download
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
