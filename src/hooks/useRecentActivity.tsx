
import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';

interface ActivityNotification {
  id: string;
  type: 'review' | 'reward';
  message: string;
  wallet: string;
}

interface RecentActivityContextType {
  notifications: ActivityNotification[];
  pushNotification: (notification: Omit<ActivityNotification, 'id'>) => void;
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;
}

const RecentActivityContext = createContext<RecentActivityContextType | undefined>(undefined);

export const useRecentActivity = () => {
  const context = useContext(RecentActivityContext);
  if (!context) {
    throw new Error('useRecentActivity must be used within a RecentActivityProvider');
  }
  return context;
};

export const RecentActivityProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<ActivityNotification[]>([]);

  const pushNotification = useCallback((notification: Omit<ActivityNotification, 'id'>) => {
    const id = `${notification.type}-${Date.now()}-${Math.random()}`;
    const fullNotification = { ...notification, id };
    
    console.log('Adding notification:', id);
    setNotifications(prev => [...prev, fullNotification]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const addNotification = useCallback((notification: ActivityNotification) => {
    console.log('Adding notification:', notification.id);
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 4000);
  }, []);

  useEffect(() => {
    const DEMO_COMPANIES = ['QuickSwap', 'Uniswap', 'OpenSea', 'Axie Infinity', 'SushiSwap', 'PancakeSwap'];
    const DEMO_WALLETS = ['0xA12b...F38C', '0xE54b...4a0d', '0x93ad...FbD1'];

    const getRandomRating = () => Math.floor(Math.random() * 5) + 1;
    const getRandomCompany = () => DEMO_COMPANIES[Math.floor(Math.random() * DEMO_COMPANIES.length)];
    const getRandomWallet = () => DEMO_WALLETS[Math.floor(Math.random() * DEMO_WALLETS.length)];
    const getRandomReward = () => (Math.random() * 5 + 1).toFixed(2);

    const generateNotification = (type: 'review' | 'reward'): ActivityNotification => {
      const id = `${type}-${Date.now()}-${Math.random()}`;
      
      if (type === 'review') {
        const rating = getRandomRating();
        const company = getRandomCompany();
        const wallet = getRandomWallet();
        return {
          id,
          type,
          message: `⭐ ${rating}/5 review for ${company}`,
          wallet,
        };
      } else {
        const amount = getRandomReward();
        const wallet = getRandomWallet();
        return {
          id,
          type,
          message: `You earned ${amount} $TRT tokens 💰`,
          wallet,
        };
      }
    };

    const pushNotificationDemo = (type: 'review' | 'reward') => {
      console.log(`Pushing demo ${type} notification...`);
      const notification = generateNotification(type);
      addNotification(notification);
    };

    // Initial notifications
    setTimeout(() => pushNotificationDemo('review'), 3000);
    setTimeout(() => pushNotificationDemo('reward'), 15000);

    // Set up intervals for continuous notifications
    const reviewInterval = setInterval(() => {
      pushNotificationDemo('review');
    }, 45000);

    const rewardInterval = setInterval(() => {
      pushNotificationDemo('reward');
    }, 30000);

    return () => {
      clearInterval(reviewInterval);
      clearInterval(rewardInterval);
    };
  }, [addNotification]);

  const contextValue: RecentActivityContextType = {
    notifications,
    pushNotification,
    dismissNotification,
    clearNotifications,
  };

  return (
    <RecentActivityContext.Provider value={contextValue}>
      {children}
    </RecentActivityContext.Provider>
  );
};
