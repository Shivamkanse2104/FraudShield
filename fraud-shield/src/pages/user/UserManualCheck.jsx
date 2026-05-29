import { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, Loader } from 'lucide-react';
import Navigation from '../../components/Navigation';
import { useAuth } from '../../context/AuthContext';
import { useUserData } from '../../context/UserDataContext';

function calcRisk(amount, location, type, category) {
  let score = 0;
  if (amount > 50000) score += 35;
  else if (amount > 20000) score += 25;
  else if (amount > 10000) score += 15;
  else if (amount > 5000) score += 8;
  if (location.toLowerCase().includes('us') || location.toLowerCase().includes('uk') || location.toLowerCase().includes('ng')) score += 20;
  else score += 5;
  if (type === 'ATM') score += 15;
  else if (type === 'Online') score += 8;
  if (category === 'Crypto') score += 20;
  else if (category === 'Gaming') score += 10;
  score += Math.floor(Math.random() * 15);
  return Math.min(score, 99);
}

export default function UserManualCheck() {
  const { user } = useAuth();
  const { addTransaction } = useUserData();
  const [form, setForm] = useState({ amount: '', merchant: '', location: '', card: '', type: 'Online', category: 'Retail' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!form.amount || !form.merchant || !form.location) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    const risk = calcRisk(Number(form.amount), form.location, form.type, form.category);
    const status = risk >= 80 ? 'blocked' : risk >= 60 ? 'flagged' : 'approved';
    const tx = {
      id: `TXN-${Date.now()}`,
      amount: Number(form.amount),
      merchant: form.merchant,
      category: form.category,
      location: form.location,
      date: new Date().toISOString().split('T')[0],
      status,
      riskScore: risk,
      cardLast4: form.card || '0000',
    };
    addTransaction(user.id, tx);
    setResult({ risk, status, tx });
    setLoading(false);
  };

  const reset = () => { setResult(null); setForm({ amount: '', merchant: '', location: '', card: '', type: 'Online', category: 'Retail' }); };

  const riskBreakdown = result ? [
    { label: 'Transaction Amount', risk: result.tx.amount > 20000 ? 'High' : result.tx.amount > 5000 ? 'Medium' : 'Low' },
    { label: 'Merchant Category', risk: form.category === 'Crypto' ? 'High' : form.category === 'Gaming' ? 'Medium' : 'Low' },
    { label: 'Transaction Type', risk: form.type === 'ATM' ? 'Medium' : 'Low' },
    { label: 'Location', risk: form.location.toLowerCase().includes('us') || form.location.toLowerCase().includes('ng') ? 'High' : 'Low' },
    { label: 'Card Verification', risk: form.card ? 'Low' : 'Medium' },
  ] : [];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Manual Transaction Check</h1>
          <p className="text-sm text-gray-500">Verify transaction details for potential fraud</p>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* Form */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Transaction Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Transaction Amount (₹)</label>
                <input type="number" className="input text-sm" placeholder="0.00" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Merchant Name</label>
                <input type="text" className="input text-sm" placeholder="Amazon, Walmart, etc." value={form.merchant} onChange={e => setForm(p => ({ ...p, merchant: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Transaction Location</label>
                <input type="text" className="input text-sm" placeholder="New York, US" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Card Last 4 Digits</label>
                <input type="text" maxLength={4} className="input text-sm" placeholder="1234" value={form.card} onChange={e => setForm(p => ({ ...p, card: e.target.value.replace(/\D/g,'') }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Transaction Type</label>
                <select className="input text-sm" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                  {['Online', 'In-store', 'ATM'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Merchant Category</label>
                <select className="input text-sm" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {['Retail', 'Electronics', 'Food', 'Travel', 'Gaming', 'Crypto', 'Healthcare'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <button onClick={handleCheck} disabled={loading || !form.amount || !form.merchant || !form.location} className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <><Loader size={15} className="animate-spin" /> Analyzing...</> : <><Shield size={15} /> Check Transaction</>}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Analysis Results</h3>
            {!result && !loading && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-3">
                  <Shield size={24} className="text-gray-300 dark:text-gray-500" />
                </div>
                <p className="text-sm text-gray-400">Enter transaction details and click "Check Transaction" to see fraud analysis</p>
              </div>
            )}
            {loading && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Loader size={32} className="text-blue-500 animate-spin mb-3" />
                <p className="text-sm text-gray-400">Analyzing transaction...</p>
              </div>
            )}
            {result && (
              <div>
                <div className={`p-4 rounded-xl mb-4 text-center ${result.risk < 70 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                  {result.risk < 70
                    ? <CheckCircle size={32} className="text-green-500 mx-auto mb-2" />
                    : <AlertTriangle size={32} className="text-red-500 mx-auto mb-2" />}
                  <h3 className={`text-base font-bold mb-1 ${result.risk < 70 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                    {result.risk < 70 ? 'Transaction Appears Safe' : 'High Risk Transaction'}
                  </h3>
                  <span className={result.risk >= 80 ? 'badge-danger' : result.risk >= 60 ? 'badge-warning' : 'badge-success'}>
                    Risk Score: {result.risk}%
                  </span>
                  <p className="text-xs text-gray-500 mt-2">{result.risk < 70 ? 'Safe to proceed with this transaction' : 'Manual review recommended before proceeding'}</p>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Risk Level</span>
                    <span className={`font-bold ${result.risk >= 80 ? 'text-red-500' : result.risk >= 60 ? 'text-amber-500' : 'text-green-500'}`}>{result.risk}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-2 rounded-full transition-all ${result.risk >= 80 ? 'bg-red-500' : result.risk >= 60 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${result.risk}%` }} />
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Risk Analysis Breakdown</p>
                  {riskBreakdown.map(({ label, risk }) => (
                    <div key={label} className="flex justify-between items-center py-1 border-b border-gray-50 dark:border-gray-700">
                      <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
                      <span className={`text-xs font-medium ${risk === 'High' ? 'text-red-500' : risk === 'Medium' ? 'text-amber-500' : 'text-green-500'}`}>{risk}</span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-green-600 dark:text-green-400 mb-3">✓ Transaction saved to your history</p>

                <div className="flex gap-2">
                  <button onClick={reset} className="btn-secondary text-xs flex-1">Check Another</button>
                  <button className="btn-primary text-xs flex-1">View History</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
