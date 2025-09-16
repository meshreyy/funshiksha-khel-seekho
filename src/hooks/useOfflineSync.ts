import { useState, useEffect } from 'react';
import { funshikshaDB } from '@/lib/database';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingItems, setPendingItems] = useState(0);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      await syncPendingData();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    // Check for pending items on mount
    checkPendingItems();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for service worker messages
    navigator.serviceWorker?.addEventListener('message', (event) => {
      if (event.data?.type === 'QUIZ_SYNC_COMPLETE') {
        checkPendingItems();
      }
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkPendingItems = async () => {
    try {
      const queue = await funshikshaDB.getOfflineQueue();
      setPendingItems(queue.length);
    } catch (error) {
      console.error('Error checking pending items:', error);
    }
  };

  const syncPendingData = async () => {
    if (!isOnline || isSyncing) return;

    try {
      setIsSyncing(true);
      
      const queue = await funshikshaDB.getOfflineQueue();
      
      for (const item of queue) {
        try {
          // Here you would typically sync with your backend
          // For now, we'll just simulate the sync process
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Remove successful items from queue
          await funshikshaDB.removeFromOfflineQueue(item.id);
          
          console.log(`Synced ${item.type}:`, item.data);
        } catch (error) {
          console.error(`Failed to sync ${item.type}:`, error);
          // Could implement retry logic here
        }
      }
      
      await checkPendingItems();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const addToQueue = async (type: 'quiz_attempt' | 'progress_update' | 'user_update', data: any) => {
    try {
      await funshikshaDB.addToOfflineQueue(type, data);
      await checkPendingItems();
      
      // If online, try to sync immediately
      if (isOnline) {
        syncPendingData();
      }
    } catch (error) {
      console.error('Failed to add to offline queue:', error);
    }
  };

  return {
    isOnline,
    isSyncing,
    pendingItems,
    syncPendingData,
    addToQueue,
  };
};