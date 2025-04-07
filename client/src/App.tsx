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
import FAQ from "@/pages/FAQ";
import ContactSupport from "@/pages/ContactSupport";
import LiveChat from "@/pages/LiveChat";
import KnowledgeBase from "@/pages/KnowledgeBase";
import AppLayout from "@/components/layout/app-layout";
import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { notificationService } from "./lib/notification-service";
import { AccessibilityProvider } from "@/contexts/accessibility-context";
import Subscription from "@/pages/Subscription";

// SVG Filters for color blindness simulations and enhanced accessibility
const AccessibilityFilters = () => (
  <svg
    className="absolute opacity-0 pointer-events-none w-0 h-0"
    aria-hidden="true"
  >
    {/* Protanopia Filter (Red-Blind) - Enhanced for better threat detection */}
    <filter id="protanopia-filter">
      <feColorMatrix
        type="matrix"
        values="0.567, 0.433, 0,     0, 0
                0.558, 0.442, 0,     0, 0
                0,     0.242, 0.758, 0, 0
                0,     0,     0,     1, 0"
      />
      {/* Enhance contrast for protanopia */}
      <feComponentTransfer>
        <feFuncR type="gamma" exponent="0.9" />
        <feFuncG type="gamma" exponent="0.9" />
        <feFuncB type="gamma" exponent="0.9" />
      </feComponentTransfer>
    </filter>
    
    {/* Deuteranopia Filter (Green-Blind) - Enhanced for better threat detection */}
    <filter id="deuteranopia-filter">
      <feColorMatrix
        type="matrix"
        values="0.625, 0.375, 0,   0, 0
                0.7,   0.3,   0,   0, 0
                0,     0.3,   0.7, 0, 0
                0,     0,     0,   1, 0"
      />
      {/* Enhance contrast for deuteranopia */}
      <feComponentTransfer>
        <feFuncR type="gamma" exponent="0.9" />
        <feFuncG type="gamma" exponent="0.9" />
        <feFuncB type="gamma" exponent="0.9" />
      </feComponentTransfer>
    </filter>
    
    {/* Tritanopia Filter (Blue-Blind) - Enhanced for better threat detection */}
    <filter id="tritanopia-filter">
      <feColorMatrix
        type="matrix"
        values="0.95, 0.05,  0,     0, 0
                0,    0.433, 0.567, 0, 0
                0,    0.475, 0.525, 0, 0
                0,    0,     0,     1, 0"
      />
      {/* Enhance contrast for tritanopia */}
      <feComponentTransfer>
        <feFuncR type="gamma" exponent="0.9" />
        <feFuncG type="gamma" exponent="0.9" />
        <feFuncB type="gamma" exponent="0.9" />
      </feComponentTransfer>
    </filter>
    
    {/* Special filter for high-contrast threat visualization */}
    <filter id="high-contrast-threat-filter">
      {/* Increase contrast to maximum */}
      <feComponentTransfer>
        <feFuncR type="linear" slope="3" intercept="-0.5" />
        <feFuncG type="linear" slope="3" intercept="-0.5" />
        <feFuncB type="linear" slope="3" intercept="-0.5" />
      </feComponentTransfer>
    </filter>

    {/* Edge enhancement filter for high contrast mode */}
    <filter id="edge-enhance" x="-10%" y="-10%" width="120%" height="120%">
      <feConvolveMatrix 
        order="3" 
        kernelMatrix="0 -1 0 -1 5 -1 0 -1 0"
        preserveAlpha="true"
      />
    </filter>
  </svg>
);

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
      <AccessibilityProvider>
        <div className={isCapacitor ? 'capacitor-environment' : ''}>
          <AccessibilityFilters />
          <AppContent isCapacitor={isCapacitor} />
        </div>
        <Toaster />
      </AccessibilityProvider>
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
          <Route path="/subscription" component={Subscription} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route path="/faq" component={FAQ} />
          <Route path="/contact-support" component={ContactSupport} />
          <Route path="/live-chat" component={LiveChat} />
          <Route path="/knowledge-base" component={KnowledgeBase} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </AppLayout>
  );
}

export default App;
