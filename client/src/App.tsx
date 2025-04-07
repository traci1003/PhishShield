import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Scan from "@/pages/Scan";
import History from "@/pages/History";
import Account from "@/pages/Account";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import AppLayout from "@/components/layout/app-layout";
import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { notificationService } from "./lib/notification-service";

function App() {
  const [isCapacitor, setIsCapacitor] = useState(false);
  
  useEffect(() => {
    // Detect if running in Capacitor environment
    const platform = Capacitor.getPlatform();
    setIsCapacitor(platform === 'ios' || platform === 'android');
    
    // Add mobile-specific event listeners
    if (platform === 'ios' || platform === 'android') {
      document.addEventListener('backbutton', () => {
        // Handle back button for Android
        console.log('Back button pressed');
      });
      
      document.addEventListener('pause', () => {
        // App sent to background
        console.log('App paused');
      });
      
      document.addEventListener('resume', () => {
        // App brought back to foreground
        console.log('App resumed');
      });
      
      // Initialize push notifications
      const initNotifications = async () => {
        try {
          const initialized = await notificationService.initialize();
          console.log(`Push notifications ${initialized ? 'initialized' : 'not available'}`);
        } catch (error) {
          console.error('Error initializing push notifications:', error);
        }
      };
      
      initNotifications();
    }
    
    // Prevent pull-to-refresh on mobile
    document.body.style.overscrollBehavior = 'none';
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className={isCapacitor ? 'capacitor-environment' : ''}>
        <AppContent isCapacitor={isCapacitor} />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

function AppContent({ isCapacitor }: { isCapacitor: boolean }) {
  const [location] = useLocation();
  
  // Add safe area insets for mobile notches and rounded corners
  const safeAreaClass = isCapacitor ? 'safe-area-insets' : '';
  
  return (
    <AppLayout>
      <div className={safeAreaClass}>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/scan" component={Scan} />
          <Route path="/history" component={History} />
          <Route path="/account" component={Account} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </AppLayout>
  );
}

export default App;
