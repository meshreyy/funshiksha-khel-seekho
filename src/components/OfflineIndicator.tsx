import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { t } = useLanguage();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Badge 
      variant={isOnline ? "default" : "secondary"}
      className={`gap-1 transition-all duration-300 ${
        isOnline 
          ? 'bg-success text-success-foreground' 
          : 'bg-warning text-warning-foreground'
      }`}
    >
      {isOnline ? (
        <Wifi className="h-3 w-3" />
      ) : (
        <WifiOff className="h-3 w-3" />
      )}
      <span className="text-xs">
        {isOnline ? t('online') : t('offline')}
      </span>
    </Badge>
  );
};