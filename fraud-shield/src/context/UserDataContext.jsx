import { createContext, useContext, useState } from 'react';

const UserDataContext = createContext(null);

// Fallback demo data used when backend is not connected
const DEMO_TRANSACTIONS = [
  { id: 'TXN-001', amount: 2500,  merchant: 'Amazon India',    category: 'Retail',      location: 'Mumbai, India', date: '2026-04-17', status: 'approved', riskScore: 15, cardLast4: '3847' },
  { id: 'TXN-002', amount: 15000, merchant: 'Flipkart',         category: 'Electronics', location: 'Delhi, India',  date: '2026-04-16', status: 'approved', riskScore: 22, cardLast4: '2941' },
  { id: 'TXN-003', amount: 8500,  merchant: 'Swiggy',           category: 'Food',        location: 'Mumbai, India', date: '2026-04-15', status: 'flagged',  riskScore: 65, cardLast4: '5623' },
  { id: 'TXN-004', amount: 45000, merchant: 'Unknown Merchant', category: 'Retail',      location: 'New York, US',  date: '2026-04-14', status: 'blocked',  riskScore: 92, cardLast4: '7834' },
];

const DEMO_DEVICES = [
  { id: 'DEV-001', name: 'iPhone 14 Pro', type: 'Mobile',  os: 'iOS 17.2',     lastUsed: '2 hours ago', location: 'Mumbai, India', trusted: true },
  { id: 'DEV-002', name: 'MacBook Pro',   type: 'Laptop',  os: 'macOS Sonoma', lastUsed: '1 day ago',   location: 'Mumbai, India', trusted: true },
  { id: 'DEV-003', name: 'Chrome Browser',type: 'Desktop', os: 'Windows 11',   lastUsed: '3 days ago',  location: 'Delhi, India',  trusted: false },
];

export function UserDataProvider({ children }) {
  const [userDataMap, setUserDataMap] = useState({
    'user-001': { transactions: DEMO_TRANSACTIONS, devices: DEMO_DEVICES, riskScore: 28 },
  });

  const getUserData = (userId) => userDataMap[userId] || { transactions: [], devices: [], riskScore: 0 };
  const isDemoAccount = (userId) => userId === 'user-001';

  const addTransaction = (userId, transaction) => {
    setUserDataMap(prev => {
      const existing = prev[userId] || { transactions: [], devices: [], riskScore: 0 };
      return { ...prev, [userId]: { ...existing, transactions: [transaction, ...existing.transactions] } };
    });
  };

  const addDevice = (userId, device) => {
    setUserDataMap(prev => {
      const existing = prev[userId] || { transactions: [], devices: [], riskScore: 0 };
      return { ...prev, [userId]: { ...existing, devices: [...existing.devices, device] } };
    });
  };

  const removeDevice = (userId, deviceId) => {
    setUserDataMap(prev => {
      const existing = prev[userId] || { transactions: [], devices: [], riskScore: 0 };
      return { ...prev, [userId]: { ...existing, devices: existing.devices.filter(d => d.id !== deviceId) } };
    });
  };

  return (
    <UserDataContext.Provider value={{ getUserData, isDemoAccount, addTransaction, addDevice, removeDevice }}>
      {children}
    </UserDataContext.Provider>
  );
}

export const useUserData = () => useContext(UserDataContext);
