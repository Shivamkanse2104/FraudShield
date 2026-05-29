import { useState } from 'react';
import { Shield, CheckCircle, XCircle, Trophy, ChevronRight, RefreshCw, Brain } from 'lucide-react';
import Navigation from '../../components/Navigation';

const QUIZ = [
  {
    q: 'You receive an SMS saying your bank account is suspended. It asks you to click a link and enter your OTP. What do you do?',
    options: ['Click the link and enter OTP to restore access', 'Call the number in the SMS', 'Ignore and call your bank\'s official number', 'Forward the SMS to family'],
    correct: 2,
    explanation: 'Banks never ask for OTPs via SMS links. Always call the official number on the back of your card or on the bank\'s official website.',
    category: 'Phishing',
  },
  {
    q: 'A merchant website is offering a branded smartphone at 90% off. It asks for full payment upfront. What should you do?',
    options: ['Pay immediately — deals don\'t last', 'Check reviews and verify the site is legitimate before paying', 'Pay half now, half on delivery', 'Share the deal with friends first'],
    correct: 1,
    explanation: 'Deals that seem too good to be true usually are. Always verify a merchant\'s legitimacy through reviews, HTTPS, and known payment platforms.',
    category: 'Online Scams',
  },
  {
    q: 'Which of these is the safest password for your banking app?',
    options: ['your date of birth (e.g. 01011990)', 'Password@123', 'Tr0ub4dor&3!xQ', 'Your pet\'s name + birth year'],
    correct: 2,
    explanation: 'A strong password uses a random mix of uppercase, lowercase, numbers, and symbols with no personal information. Use a password manager to remember complex passwords.',
    category: 'Password Safety',
  },
  {
    q: 'You notice an unfamiliar transaction of ₹500 on your account. What\'s the right action?',
    options: ['Ignore it — it\'s only ₹500', 'Wait to see if more transactions appear', 'Immediately report it and dispute the transaction', 'Cancel your card without reporting'],
    correct: 2,
    explanation: 'Fraudsters often test with small amounts first. Report immediately — even ₹500 disputes help banks track fraud patterns and protect you.',
    category: 'Transaction Fraud',
  },
  {
    q: 'Your friend sends you a UPI link asking you to "accept" ₹5,000 they owe you. You need to enter your PIN to receive it. What do you do?',
    options: ['Enter your PIN — you\'re receiving money', 'Decline — entering your PIN approves a payment, not a receipt', 'Call your friend to confirm', 'Enter a wrong PIN to test it'],
    correct: 1,
    explanation: 'You NEVER need a PIN to receive money via UPI. If you\'re asked for a PIN or OTP to "receive" money, it\'s a scam — you\'re actually approving a payment OUT of your account.',
    category: 'UPI Fraud',
  },
  {
    q: 'Which Wi-Fi network is safest for online banking?',
    options: ['Free airport Wi-Fi', 'Café public Wi-Fi', 'Your personal mobile hotspot', 'Hotel guest Wi-Fi'],
    correct: 2,
    explanation: 'Public Wi-Fi networks can be intercepted. Always use your personal mobile data or a trusted VPN for financial transactions.',
    category: 'Network Safety',
  },
  {
    q: 'A caller claims to be from your bank\'s fraud team and asks for your card number to "verify your identity." What do you do?',
    options: ['Provide your card number — they said they\'re from the bank', 'Provide just the last 4 digits', 'Hang up and call your bank\'s official helpline', 'Give the number but not the CVV'],
    correct: 2,
    explanation: 'Legitimate bank employees will NEVER ask for your full card number, CVV, or OTP over the phone. Hang up and call the number on your card.',
    category: 'Social Engineering',
  },
  {
    q: 'What does two-factor authentication (2FA) protect against?',
    options: ['Viruses on your device', 'Account access even if your password is stolen', 'Phishing emails', 'Slow internet connections'],
    correct: 1,
    explanation: '2FA adds a second verification step (OTP, app approval, biometric) so even if someone steals your password, they still can\'t access your account without the second factor.',
    category: 'Account Security',
  },
];

const BADGES = [
  { min: 0, max: 3, label: 'Beginner', color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-700', icon: '🎓' },
  { min: 4, max: 5, label: 'Aware', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: '🛡️' },
  { min: 6, max: 7, label: 'Savvy', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30', icon: '⭐' },
  { min: 8, max: 8, label: 'Expert', color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30', icon: '🏆' },
];

export default function UserFraudQuiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [done, setDone] = useState(false);

  const q = QUIZ[current];
  const badge = BADGES.find(b => score >= b.min && score <= b.max) || BADGES[0];
  const pct = Math.round((score / QUIZ.length) * 100);

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correct) {
      setScore(s => s + 1);
    } else {
      setWrongAnswers(w => [...w, { question: q.q, correct: q.options[q.correct], yours: q.options[idx], category: q.category }]);
    }
  };

  const next = () => {
    if (current + 1 >= QUIZ.length) {
      setDone(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const reset = () => {
    setCurrent(0); setSelected(null); setAnswered(false);
    setScore(0); setWrongAnswers([]); setDone(false);
  };

  if (done) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <Navigation />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            <div className="card p-8 text-center mb-5">
              <div className={`w-20 h-20 ${badge.bg} rounded-full flex items-center justify-center mx-auto mb-4 text-4xl`}>
                {badge.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Quiz Complete!</h2>
              <p className={`text-lg font-semibold ${badge.color} mb-2`}>{badge.label}</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{score} / {QUIZ.length}</p>
              <p className="text-sm text-gray-400 mb-6">{pct}% correct</p>
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-6">
                <div className={`h-3 rounded-full transition-all ${pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
              </div>
              {score === QUIZ.length && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl mb-4">
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">🎉 Perfect score! You're a fraud prevention expert.</p>
                </div>
              )}
              <button onClick={reset} className="btn-primary flex items-center gap-2 mx-auto">
                <RefreshCw size={14} /> Retake Quiz
              </button>
            </div>

            {wrongAnswers.length > 0 && (
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Brain size={14} className="text-amber-500" /> Review Incorrect Answers
                </h3>
                <div className="space-y-4">
                  {wrongAnswers.map((w, i) => (
                    <div key={i} className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl">
                      <span className="badge-info text-xs mb-2 inline-block">{w.category}</span>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{w.question}</p>
                      <div className="space-y-1">
                        <p className="text-xs"><span className="text-red-500 font-medium">Your answer:</span> <span className="text-gray-600 dark:text-gray-400">{w.yours}</span></p>
                        <p className="text-xs"><span className="text-green-600 font-medium">Correct answer:</span> <span className="text-gray-600 dark:text-gray-400">{w.correct}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Fraud Awareness Quiz</h1>
            <p className="text-sm text-gray-500">Test your knowledge — earn your security badge</p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>Question {current + 1} of {QUIZ.length}</span>
            <span className="font-medium text-blue-500">{score} correct so far</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full mb-6">
            <div className="h-2 bg-blue-500 rounded-full transition-all" style={{ width: `${((current) / QUIZ.length) * 100}%` }} />
          </div>

          <div className="card p-6 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="badge-info">{q.category}</span>
            </div>
            <p className="text-base font-medium text-gray-900 dark:text-white mb-5 leading-relaxed">{q.q}</p>

            <div className="space-y-3">
              {q.options.map((opt, idx) => {
                let cls = 'border border-gray-200 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 cursor-pointer';
                if (answered) {
                  if (idx === q.correct) cls = 'border-2 border-green-500 bg-green-50 dark:bg-green-900/20';
                  else if (idx === selected) cls = 'border-2 border-red-500 bg-red-50 dark:bg-red-900/20';
                  else cls = 'border border-gray-100 dark:border-gray-700 opacity-50';
                } else if (selected === idx) {
                  cls = 'border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20';
                }
                return (
                  <div key={idx} onClick={() => handleSelect(idx)} className={`flex items-center gap-3 p-4 rounded-xl transition-all ${cls}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${answered && idx === q.correct ? 'bg-green-500 text-white' : answered && idx === selected ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                      {answered && idx === q.correct ? <CheckCircle size={14} /> : answered && idx === selected ? <XCircle size={14} /> : String.fromCharCode(65 + idx)}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{opt}</p>
                  </div>
                );
              })}
            </div>

            {answered && (
              <div className={`mt-4 p-4 rounded-xl flex items-start gap-3 ${selected === q.correct ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                {selected === q.correct
                  ? <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                  : <XCircle size={16} className="text-red-500 mt-0.5 shrink-0" />}
                <div>
                  <p className={`text-xs font-semibold mb-1 ${selected === q.correct ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                    {selected === q.correct ? 'Correct!' : 'Incorrect'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            )}
          </div>

          {answered && (
            <button onClick={next} className="btn-primary w-full flex items-center justify-center gap-2">
              {current + 1 >= QUIZ.length ? <><Trophy size={14} /> See Results</> : <>Next Question <ChevronRight size={14} /></>}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
