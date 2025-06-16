
import { useState, useEffect, useCallback } from 'react';

interface ActivityNotification {
  id: string;
  type: 'review' | 'reward';
  message: string;
  wallet: string;
}

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
      message: `You earned ${amount} $NOCAP tokens 💰`,
      wallet,
    };
  }
};

export const useRecentActivity = () => {
  const [notifications, setNotifications] = useState<ActivityNotification[]>([]);

  const addNotification = useCallback((notification: ActivityNotification) => {
    console.log('Adding notification:', notification.id);
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 4000);
  }, []);

  useEffect(() => {
    const pushNotification = (type: 'review' | 'reward') => {
      console.log(`Pushing demo ${type} notification...`);
      const notification = generateNotification(type);
      addNotification(notification);
    };

    // Initial notifications
    setTimeout(() => pushNotification('review'), 3000);
    setTimeout(() => pushNotification('reward'), 15000);

    // Set up intervals for continuous notifications
    const reviewInterval = setInterval(() => {
      pushNotification('review');
    }, 45000);

    const rewardInterval = setInterval(() => {
      pushNotification('reward');
    }, 30000);

    return () => {
      clearInterval(reviewInterval);
      clearInterval(rewardInterval);
    };
  }, [addNotification]);

  return { notifications };
};
