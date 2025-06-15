
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
  const [recentMessages, setRecentMessages] = useState<Set<string>>(new Set());

  const pushNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    // Create a unique key for the notification to prevent duplicates
    const notificationKey = `${notification.type}-${notification.message}-${notification.wallet}`;
    
    // Check if we've already shown this notification recently (within 30 seconds)
    if (recentMessages.has(notificationKey)) {
      console.log('Duplicate notification blocked:', notificationKey);
      return;
    }
    
    const id = Math.random().toString(36).substring(7);
    const newNotification = { ...notification, id };
    
    console.log('Adding notification:', notificationKey);
    setNotifications(prev => [...prev, newNotification]);
    setRecentMessages(prev => new Set(prev).add(notificationKey));
    
    // Auto-remove notification after 4 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
    
    // Remove from recent messages after 30 seconds to allow future notifications
    setTimeout(() => {
      setRecentMessages(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationKey);
        return newSet;
      });
    }, 30000);
  }, [recentMessages]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setRecentMessages(new Set());
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
