
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

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
  // Use a ref to persist the recent messages across renders
  const recentMessagesRef = useRef<Set<string>>(new Set());
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const pushNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    // Create a unique key for the notification to prevent duplicates
    const notificationKey = `${notification.type}-${notification.message}-${notification.wallet}`;
    
    // Check if we've already shown this notification recently
    if (recentMessagesRef.current.has(notificationKey)) {
      console.log('Duplicate notification blocked:', notificationKey);
      return;
    }
    
    const id = Math.random().toString(36).substring(7);
    const newNotification = { ...notification, id };
    
    console.log('Adding notification:', notificationKey);
    setNotifications(prev => [...prev, newNotification]);
    recentMessagesRef.current.add(notificationKey);
    
    // Auto-remove notification after 4 seconds
    const removeNotificationTimeout = setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
    
    // Remove from recent messages after 30 seconds to allow future notifications
    const removeFromRecentTimeout = setTimeout(() => {
      recentMessagesRef.current.delete(notificationKey);
      timeoutsRef.current.delete(notificationKey);
    }, 30000);
    
    // Store the timeout reference to clean up if needed
    timeoutsRef.current.set(notificationKey, removeFromRecentTimeout);
    
    return () => {
      clearTimeout(removeNotificationTimeout);
      clearTimeout(removeFromRecentTimeout);
    };
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    recentMessagesRef.current.clear();
    
    // Clear all pending timeouts
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current.clear();
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
