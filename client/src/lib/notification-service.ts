import { Capacitor } from '@capacitor/core';
import { 
  PushNotifications, 
  PushNotificationSchema, 
  ActionPerformed, 
  Token 
} from '@capacitor/push-notifications';
import { apiRequest } from './queryClient';

class NotificationService {
  private initialized = false;

  /**
   * Initialize push notifications
   */
  async initialize(): Promise<boolean> {
    if (this.initialized) {
      return true;
    }
    
    // Check if we can use notifications
    if (!this.canUseNotifications()) {
      console.log('Push notifications not available on this platform');
      return false;
    }
    
    try {
      // Request permission
      const permissionStatus = await PushNotifications.requestPermissions();
      
      if (permissionStatus.receive !== 'granted') {
        console.log('Push notification permission not granted');
        return false;
      }
      
      // Register with the native platform
      await PushNotifications.register();
      
      // Set up listeners
      this.setupEventListeners();
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing push notifications:', error);
      return false;
    }
  }
  
  /**
   * Check if device can use notifications
   */
  canUseNotifications(): boolean {
    // Only available on native platforms
    return Capacitor.isNativePlatform() && 
           (Capacitor.getPlatform() === 'ios' || 
            Capacitor.getPlatform() === 'android');
  }
  
  /**
   * Set up event listeners for push notifications
   */
  private setupEventListeners() {
    // On registration success, send the token to our server
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success:', token.value);
      this.sendTokenToServer(token.value);
    });
    
    // For push notification received when app is open
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push notification received:', notification);
        // You can show in-app toast/alert here for notifications 
        // when the app is in foreground
      }
    );
    
    // For push notification action (user tapped on notification)
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (action: ActionPerformed) => {
        console.log('Push notification action performed:', action);
        this.handleNotificationAction(action);
      }
    );
  }
  
  /**
   * Send token to server for storing with user's account
   */
  private async sendTokenToServer(token: string) {
    try {
      const platform = Capacitor.getPlatform();
      
      await apiRequest('POST', '/api/device-tokens', {
        token,
        platform
      });
      
      console.log('Device token registered with server');
    } catch (error) {
      console.error('Error registering device token with server:', error);
    }
  }
  
  /**
   * Handle notification action (when user taps notification)
   */
  private handleNotificationAction(action: ActionPerformed) {
    const data = action.notification.data;
    
    // Navigate to the appropriate screen based on notification type
    if (data && data.type === 'phishing_alert' && data.messageId) {
      // Redirect to message details
      window.location.href = `/history?messageId=${data.messageId}`;
    } else if (data && data.type === 'security_update') {
      // Redirect to dashboard
      window.location.href = '/';
    }
  }
  
  /**
   * Get device token (if available)
   */
  async getDeviceToken(): Promise<string | null> {
    if (!this.canUseNotifications()) {
      return null;
    }
    
    try {
      // This is not currently available in Capacitor Push Notifications plugin
      // You would need to store the token when registration event fires
      // and retrieve it from there
      return null;
    } catch (error) {
      console.error('Error getting device token:', error);
      return null;
    }
  }
  
  /**
   * Remove all delivered notifications
   */
  async removeAllDeliveredNotifications(): Promise<void> {
    if (!this.canUseNotifications()) {
      return;
    }
    
    try {
      await PushNotifications.removeAllDeliveredNotifications();
    } catch (error) {
      console.error('Error removing delivered notifications:', error);
    }
  }
}

// Export as singleton
export const notificationService = new NotificationService();