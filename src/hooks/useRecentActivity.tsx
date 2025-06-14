
import React, { createContext, useContext, useState, useCallback } from 'react';

export type ActivityType = 'review' | 'reward';

export interface ActivityNotification {
  id: string;
  type: ActivityType;
  message: string;
  wallet?: string;
  timestamp: number;
}

interface RecentActivityContextProps {
  notifications: ActivityNotification[];
  pushNotification: (notification: Omit<ActivityNotification, 'id' | 'timestamp'>) => void;
}

const RecentActivityContext = createContext<RecentActivityContextProps | undefined>(undefined);

export const RecentActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<ActivityNotification[]>([]);

  const pushNotification = useCallback(
    (notification: Omit<ActivityNotification, 'id' | 'timestamp'>) => {
      const id = `notif-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      setNotifications((prev) => [
        ...prev,
        { ...notification, id, timestamp: Date.now() }
      ]);
      // Remove after 6 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((item) => item.id !== id));
      }, 6000);
    },
    []
  );

  return (
    <RecentActivityContext.Provider value={{ notifications, pushNotification }}>
      {children}
    </RecentActivityContext.Provider>
  );
};

export const useRecentActivity = () => {
  const ctx = useContext(RecentActivityContext);
  if (!ctx) throw new Error('useRecentActivity must be used within RecentActivityProvider');
  return ctx;
};
