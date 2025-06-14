
import React, { createContext, useContext, useState, useCallback } from 'react';

interface Notification {
  id: string;
  type: 'review' | 'reward';
  message: string;
  wallet: string;
}

interface RecentActivityContextType {
  notifications: Notification[];
  pushNotification: (notification: Omit<Notification, 'id'>) => void;
  clearNotifications: () => void;
}

const RecentActivityContext = createContext<RecentActivityContextType | undefined>(undefined);

export const RecentActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const pushNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <RecentActivityContext.Provider value={{ notifications, pushNotification, clearNotifications }}>
      {children}
    </RecentActivityContext.Provider>
  );
};

export const useRecentActivity = () => {
  const context = useContext(RecentActivityContext);
  if (!context) {
    throw new Error('useRecentActivity must be used within a RecentActivityProvider');
  }
  return context;
};
