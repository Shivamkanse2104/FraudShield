import { useState } from 'react';
import { Search, ChevronDown, Shield, CreditCard, Smartphone, Bell, FileText, HelpCircle, Lock, Eye } from 'lucide-react';
import Navigation from '../../components/Navigation';

const CATEGORIES = [
  {
    id: 'account', label: 'Account Security', icon: Lock,
    faqs: [
      { q: 'How does the fraud detection system protect my account?', a: 'Our system uses real-time ML models to analyze every transaction, checking for unusual patterns, suspicious locations, and high-risk merchants. Alerts are sent instantly when threats are detected.' },
      { q: 'What should I do if my transaction is blocked?', a: 'If a legitimate transaction is blocked, you can contact support or use the Manual Check feature to submit a review. Our team typically responds within 2 hours.' },
      { q: 'How do I enable two-factor authentication?', a: 'Go to Settings > Security and toggle on Two-Factor Authentication. You will receive a code via SMS or email each time you log in.' },
    ],
  },
  {
    id: 'transactions', label: 'Transactions', icon: CreditCard,
    faqs: [
      { q: 'Why was my transaction flagged as suspicious?', a: 'Transactions are flagged based on multiple factors: unusual amounts, new merchants, foreign locations, or patterns that deviate from your normal behavior.' },
      { q: 'How long does it take to review a flagged transaction?', a: 'Most flagged transactions are reviewed automatically within seconds. Manual reviews by our team take up to 4 hours.' },
      { q: 'Can I manually check a transaction before making it?', a: 'Yes! Use the "Check Transaction" feature in the sidebar. Enter the transaction details and our system will instantly assess the fraud risk.' },
    ],
  },
  {
    id: 'risk', label: 'Risk Scores', icon: Shield,
    faqs: [
      { q: 'What is a risk score?', a: 'A risk score (0–100%) measures how likely a transaction is to be fraudulent. Below 30% is low risk, 30–60% is medium, 60–80% is high, and above 80% is critical.' },
      { q: 'How is my risk score calculated?', a: 'Risk scores factor in transaction amount, merchant reputation, location, device, time of day, and your personal spending patterns using our ML model.' },
    ],
  },
  {
    id: 'devices', label: 'Devices', icon: Smartphone,
    faqs: [
      { q: 'How do I add a trusted device?', a: 'Go to My Devices and click "Add Device". Enter the device name, type, and OS. Trusted devices reduce friction for future transactions.' },
      { q: 'What happens if I log in from a new device?', a: 'New device logins trigger an alert and may temporarily increase transaction scrutiny. You can trust the device from the My Devices page.' },
    ],
  },
  {
    id: 'notifications', label: 'Notifications', icon: Bell,
    faqs: [
      { q: 'How do I receive fraud alerts?', a: 'Alerts are sent via email by default. You can also enable SMS and push notifications in your account settings.' },
      { q: 'Can I customize my alert preferences?', a: 'Yes, go to Settings > Notifications to set the minimum alert severity level and choose your preferred notification channels.' },
    ],
  },
  {
    id: 'reports', label: 'Reports & History', icon: FileText,
    faqs: [
      { q: 'How can I view my transaction history?', a: 'Go to My Transactions in the sidebar. You can filter by status, search by merchant, and view full details for each transaction.' },
      { q: 'Can I download my transaction reports?', a: 'Yes, click the Export button on the My Transactions page to download a CSV or PDF report of your transaction history.' },
    ],
  },
  {
    id: 'privacy', label: 'Privacy', icon: Eye,
    faqs: [
      { q: 'Is my personal and financial data secure?', a: 'All data is encrypted using AES-256 and stored in compliance with PCI DSS and GDPR standards. We never share your data with third parties without consent.' },
    ],
  },
  {
    id: 'support', label: 'Support', icon: HelpCircle,
    faqs: [
      { q: 'How do I contact support?', a: 'Email us at support@fraudshield.com or use the live chat feature. Our team is available 24/7 for critical fraud cases and business hours for general queries.' },
    ],
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-50 dark:border-gray-700 last:border-0">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full py-3 text-left">
        <span className="text-sm text-gray-700 dark:text-gray-300 pr-4">{q}</span>
        <ChevronDown size={15} className={`text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="text-xs text-gray-500 dark:text-gray-400 pb-3 leading-relaxed">{a}</p>}
    </div>
  );
}

export default function UserFAQ() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = CATEGORIES.map(cat => ({
    ...cat,
    faqs: cat.faqs.filter(f =>
      !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => (activeCategory === 'all' || cat.id === activeCategory) && cat.faqs.length > 0);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h1>
          <p className="text-sm text-gray-500">Find answers to common questions about fraud detection and account security</p>
        </div>

        <div className="card p-5">
          <div className="relative mb-4">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-9 text-sm" placeholder="Search for questions..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            <button onClick={() => setActiveCategory('all')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>All Categories</button>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeCategory === cat.id ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                {cat.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filtered.map(cat => {
              const Icon = cat.icon;
              return (
                <div key={cat.id} className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-700/50">
                    <Icon size={14} className="text-blue-500" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{cat.label}</span>
                    <span className="text-xs text-gray-400 ml-auto">{cat.faqs.length} question{cat.faqs.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="px-4">
                    {cat.faqs.map(faq => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-10 text-sm text-gray-400">No results found for "{search}"</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
