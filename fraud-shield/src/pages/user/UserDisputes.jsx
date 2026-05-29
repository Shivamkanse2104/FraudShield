import { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, FileText, ChevronRight, ShoppingBag } from 'lucide-react';
import Navigation from '../../components/Navigation';
import { useAuth } from '../../context/AuthContext';
import { useUserData } from '../../context/UserDataContext';

const DISPUTE_REASONS = [
  { value: 'not_me', label: "This wasn't me", desc: 'I did not make this transaction' },
  { value: 'wrong_amount', label: 'Wrong amount', desc: 'The amount charged is incorrect' },
  { value: 'duplicate', label: 'Duplicate charge', desc: 'I was charged more than once' },
  { value: 'no_goods', label: 'Goods not received', desc: 'I paid but never received the product/service' },
  { value: 'other', label: 'Other reason', desc: 'Something else is wrong' },
];

const statusConfig = {
  open: { cls: 'badge-warning', icon: Clock, label: 'Open' },
  under_review: { cls: 'badge-info', icon: AlertTriangle, label: 'Under Review' },
  resolved: { cls: 'badge-success', icon: CheckCircle, label: 'Resolved' },
  rejected: { cls: 'badge-danger', icon: AlertTriangle, label: 'Rejected' },
};

const EXISTING_DISPUTES = [
  { id: 'DSP-001', txId: 'TXN-003', merchant: 'Swiggy', amount: 8500, reason: 'wrong_amount', status: 'under_review', created: 'Apr 15, 2026' },
];

export default function UserDisputes() {
  const { user } = useAuth();
  const { getUserData } = useUserData();
  const data = getUserData(user?.id);
  const [step, setStep] = useState(0); // 0=list, 1=select tx, 2=reason, 3=confirm, 4=done
  const [selectedTx, setSelectedTx] = useState(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');
  const [disputes, setDisputes] = useState(EXISTING_DISPUTES);

  const undisputedTxs = data.transactions.filter(t => !t.disputed);

  const submitDispute = () => {
    const newDispute = {
      id: `DSP-00${disputes.length + 2}`,
      txId: selectedTx.id,
      merchant: selectedTx.merchant,
      amount: selectedTx.amount,
      reason: selectedReason,
      status: 'open',
      created: new Date().toLocaleDateString('en-IN'),
    };
    setDisputes(d => [newDispute, ...d]);
    setStep(4);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dispute a Transaction</h1>
            <p className="text-sm text-gray-500">Flag unauthorised or incorrect charges</p>
          </div>
          {step === 0 && (
            <button onClick={() => setStep(1)} className="btn-primary text-sm flex items-center gap-2">
              <AlertTriangle size={14} /> File New Dispute
            </button>
          )}
        </div>

        {/* Existing disputes */}
        {step === 0 && (
          <div className="space-y-5">
            {disputes.length > 0 && (
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Your Disputes</h3>
                <div className="space-y-3">
                  {disputes.map(d => {
                    const cfg = statusConfig[d.status];
                    const Icon = cfg.icon;
                    return (
                      <div key={d.id} className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <FileText size={14} className="text-gray-500" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{d.merchant}</p>
                              <span className={cfg.cls}><Icon size={10} className="inline mr-1" />{cfg.label}</span>
                            </div>
                            <p className="text-xs text-gray-400">₹{d.amount.toLocaleString()} · {DISPUTE_REASONS.find(r => r.value === d.reason)?.label} · {d.created}</p>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-gray-400">{d.id}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {disputes.length === 0 && (
              <div className="card p-12 text-center">
                <CheckCircle size={32} className="text-green-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">No disputes filed</p>
                <p className="text-xs text-gray-400 mt-1">All your transactions look clean!</p>
              </div>
            )}
          </div>
        )}

        {/* Step 1: Select transaction */}
        {step === 1 && (
          <div className="card p-5 max-w-2xl">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Which transaction do you want to dispute?</h3>
            <div className="space-y-2">
              {undisputedTxs.map(tx => (
                <div key={tx.id} onClick={() => { setSelectedTx(tx); setStep(2); }}
                  className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-xl hover:border-blue-400 dark:hover:border-blue-600 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <ShoppingBag size={13} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{tx.merchant}</p>
                      <p className="text-xs text-gray-400">{tx.date} · {tx.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">₹{tx.amount.toLocaleString()}</span>
                    <ChevronRight size={14} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(0)} className="btn-secondary text-sm mt-4">Cancel</button>
          </div>
        )}

        {/* Step 2: Select reason */}
        {step === 2 && selectedTx && (
          <div className="card p-5 max-w-2xl">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs text-gray-400">Disputing:</p>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{selectedTx.merchant} — ₹{selectedTx.amount.toLocaleString()}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">What is the reason for your dispute?</h3>
            <div className="space-y-2 mb-4">
              {DISPUTE_REASONS.map(r => (
                <div key={r.value} onClick={() => setSelectedReason(r.value)}
                  className={`p-3 border-2 rounded-xl cursor-pointer transition-colors ${selectedReason === r.value ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-gray-700 hover:border-blue-300'}`}>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{r.label}</p>
                  <p className="text-xs text-gray-400">{r.desc}</p>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Additional details (optional)</label>
              <textarea className="input text-sm resize-none" rows={3} placeholder="Provide any extra context..." value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="btn-secondary text-sm flex-1">Back</button>
              <button onClick={() => setStep(3)} disabled={!selectedReason} className="btn-primary text-sm flex-1 disabled:opacity-60">Review Dispute</button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && selectedTx && (
          <div className="card p-5 max-w-2xl">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Review & Submit</h3>
            <div className="space-y-3 mb-5">
              {[
                ['Transaction', `${selectedTx.merchant} — ₹${selectedTx.amount.toLocaleString()}`],
                ['Date', selectedTx.date],
                ['Reason', DISPUTE_REASONS.find(r => r.value === selectedReason)?.label],
                ['Description', description || 'No additional details'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-700">
                  <span className="text-xs text-gray-400">{k}</span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white text-right max-w-xs">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="btn-secondary text-sm flex-1">Back</button>
              <button onClick={submitDispute} className="btn-primary text-sm flex-1">Submit Dispute</button>
            </div>
          </div>
        )}

        {/* Step 4: Done */}
        {step === 4 && (
          <div className="card p-10 max-w-2xl text-center">
            <CheckCircle size={40} className="text-green-500 mx-auto mb-4" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">Dispute Filed Successfully</h3>
            <p className="text-sm text-gray-500 mb-5">Our team will review your case within 2–5 business days. You will receive an email with updates.</p>
            <button onClick={() => setStep(0)} className="btn-primary text-sm px-6">Back to Disputes</button>
          </div>
        )}
      </main>
    </div>
  );
}
