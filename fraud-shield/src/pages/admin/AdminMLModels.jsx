import { useState } from 'react';
import { Brain, Activity, TrendingUp, TrendingDown, RefreshCw, BarChart2, AlertTriangle, CheckCircle, Play, Clock } from 'lucide-react';
import { RadialBarChart, RadialBar, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Navigation from '../../components/Navigation';

const MODELS = [
  { id: 'M001', name: 'FraudNet v3.2 (Production)', type: 'XGBoost Ensemble', accuracy: 97.8, precision: 96.2, recall: 93.8, f1: 95.0, auc: 0.994, status: 'active', deployed: 'Apr 1, 2026', predictions: '2.4M', latency: '0.3s' },
  { id: 'M002', name: 'FraudNet v3.3 (Staging)', type: 'LightGBM + Neural Net', accuracy: 98.1, precision: 97.0, recall: 94.5, f1: 95.7, auc: 0.996, status: 'staging', deployed: 'Apr 14, 2026', predictions: '120K', latency: '0.4s' },
  { id: 'M003', name: 'FraudNet v3.1 (Archive)', type: 'Random Forest', accuracy: 95.2, precision: 94.0, recall: 91.2, f1: 92.6, auc: 0.981, status: 'archived', deployed: 'Jan 10, 2026', predictions: '8.1M', latency: '0.6s' },
];

const featureImportance = [
  { feature: 'Transaction amount', importance: 92 },
  { feature: 'Location deviation', importance: 87 },
  { feature: 'Velocity (1h)', importance: 81 },
  { feature: 'Merchant risk score', importance: 76 },
  { feature: 'Device fingerprint', importance: 71 },
  { feature: 'Time of day', importance: 58 },
  { feature: 'Card age', importance: 44 },
  { feature: 'Tx type', importance: 38 },
];

const driftData = [
  { date: 'Apr 10', score_dist: 0.02, amount_dist: 0.01, location_dist: 0.03 },
  { date: 'Apr 12', score_dist: 0.03, amount_dist: 0.02, location_dist: 0.04 },
  { date: 'Apr 14', score_dist: 0.05, amount_dist: 0.02, location_dist: 0.06 },
  { date: 'Apr 16', score_dist: 0.08, amount_dist: 0.03, location_dist: 0.09 },
  { date: 'Apr 18', score_dist: 0.12, amount_dist: 0.04, location_dist: 0.11 },
];

const statusCfg = {
  active:   { cls: 'badge-success', label: 'Production' },
  staging:  { cls: 'badge-warning', label: 'Staging (A/B)' },
  archived: { cls: 'bg-gray-100 dark:bg-gray-700 text-gray-500 text-xs font-medium px-2 py-0.5 rounded-full', label: 'Archived' },
};

function MetricGauge({ label, value, color }) {
  return (
    <div className="text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}%</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
      <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-1.5">
        <div className={`h-1.5 rounded-full ${color === 'text-green-500' ? 'bg-green-500' : color === 'text-blue-500' ? 'bg-blue-500' : 'bg-purple-500'}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function AdminMLModels() {
  const [selected, setSelected] = useState(MODELS[0]);
  const [retraining, setRetraining] = useState(false);

  const triggerRetrain = () => {
    setRetraining(true);
    setTimeout(() => setRetraining(false), 3000);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">ML Model Management</h1>
            <p className="text-sm text-gray-500">Monitor model performance, drift, and retraining</p>
          </div>
          <button onClick={triggerRetrain} disabled={retraining}
            className="btn-primary flex items-center gap-2 text-sm disabled:opacity-60">
            {retraining ? <><RefreshCw size={14} className="animate-spin" /> Retraining...</> : <><RefreshCw size={14} /> Trigger Retrain</>}
          </button>
        </div>

        {/* Model cards */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {MODELS.map(m => {
            const cfg = statusCfg[m.status];
            const isSelected = selected.id === m.id;
            return (
              <div key={m.id} onClick={() => setSelected(m)}
                className={`card p-4 cursor-pointer transition-all ${isSelected ? 'border-2 border-blue-500' : 'border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Brain size={16} className="text-purple-500" />
                  </div>
                  <span className={cfg.cls}>{cfg.label}</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{m.name}</p>
                <p className="text-xs text-gray-400 mb-3">{m.type}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-gray-400">Accuracy</span><p className="font-bold text-green-500">{m.accuracy}%</p></div>
                  <div><span className="text-gray-400">AUC-ROC</span><p className="font-bold text-blue-500">{m.auc}</p></div>
                  <div><span className="text-gray-400">Predictions</span><p className="font-semibold text-gray-700 dark:text-gray-300">{m.predictions}</p></div>
                  <div><span className="text-gray-400">Latency</span><p className="font-semibold text-gray-700 dark:text-gray-300">{m.latency}</p></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-5 mb-5">
          {/* Metrics */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Activity size={14} /> {selected.name} — Metrics
            </h3>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <MetricGauge label="Accuracy" value={selected.accuracy} color="text-green-500" />
              <MetricGauge label="Precision" value={selected.precision} color="text-blue-500" />
              <MetricGauge label="Recall" value={selected.recall} color="text-purple-500" />
              <MetricGauge label="F1 Score" value={selected.f1} color="text-green-500" />
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-xs text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <Clock size={12} /> Deployed: {selected.deployed} · Total predictions: {selected.predictions} · Avg latency: {selected.latency}
            </div>
            {selected.status === 'staging' && (
              <button className="btn-primary text-xs py-1.5 w-full mt-3 flex items-center justify-center gap-2">
                <Play size={12} /> Promote to Production
              </button>
            )}
          </div>

          {/* Feature importance */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart2 size={14} /> Feature Importance
            </h3>
            <div className="space-y-2">
              {featureImportance.map(({ feature, importance }) => (
                <div key={feature}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{importance}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <div className="h-1.5 bg-blue-500 rounded-full transition-all" style={{ width: `${importance}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drift detection */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-500" /> Data Drift Detection
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs text-amber-600 dark:text-amber-400">Location drift detected — review recommended</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={driftData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
              <Tooltip formatter={(v) => `${(v * 100).toFixed(1)}%`} />
              <Legend />
              <Line type="monotone" dataKey="score_dist" stroke="#3B82F6" strokeWidth={2} dot={false} name="Risk score" />
              <Line type="monotone" dataKey="amount_dist" stroke="#10B981" strokeWidth={2} dot={false} name="Amount" />
              <Line type="monotone" dataKey="location_dist" stroke="#F59E0B" strokeWidth={2} dot={false} name="Location" strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 mt-2">PSI (Population Stability Index) — values above 10% indicate significant drift</p>
        </div>
      </main>
    </div>
  );
}
