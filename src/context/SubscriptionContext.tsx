import React, { createContext, useContext, useState, ReactNode } from 'react';
import { HOME_SUBSCRIPTIONS, UPCOMING_SUBSCRIPTIONS } from '@/constants/data';
import dayjs from "dayjs";

interface SubscriptionContextType {
  subscriptions: Subscription[];
  addSubscription: (newSub: Subscription) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  ...HOME_SUBSCRIPTIONS,
  ...UPCOMING_SUBSCRIPTIONS.map(upcoming => ({
    id: upcoming.id,
    name: upcoming.name,
    price: upcoming.price,
    currency: upcoming.currency || 'USD',
    icon: upcoming.icon,
    billing: 'Monthly', // Default to Monthly for migration
    status: 'active',
    renewalDate: dayjs().add(upcoming.daysLeft, 'day').toISOString(),
  }))
];

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);

  const addSubscription = (newSub: Subscription) => {
    setSubscriptions((prev) => [newSub, ...prev]);
  };

  return (
    <SubscriptionContext.Provider value={{ subscriptions, addSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptions = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscriptions must be used within a SubscriptionProvider');
  }
  return context;
};
