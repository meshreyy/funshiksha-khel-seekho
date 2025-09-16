import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      
      // Show install prompt after a short delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    const handleAppInstalled = () => {
      console.log('FUNSHIKSHA PWA was installed');
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    setDeferredPrompt(null);
  };

  if (!showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm shadow-strong border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-white text-sm font-bold">📚</span>
            </div>
            <div>
              <CardTitle className="text-sm">Install FUNSHIKSHA</CardTitle>
              <CardDescription className="text-xs">
                Get the app for offline learning
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleInstallClick}
            className="flex-1 gap-1"
          >
            <Download className="h-3 w-3" />
            Install App
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDismiss}
          >
            Not Now
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2">
          • Work offline without internet
          • Faster loading and better performance
          • Install directly to your home screen
        </p>
      </CardContent>
    </Card>
  );
};