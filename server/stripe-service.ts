import Stripe from 'stripe';
import { storage } from './storage';

// Initialize Stripe with the secret key from environment variables
// For now, this will be a mock implementation until we get the real API key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock';
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-03-31.basil',
});

class StripeService {
  /**
   * Creates a checkout session for subscription
   */
  async createCheckoutSession(userId: number, priceId: string): Promise<string> {
    try {
      // Get the user
      const user = await storage.getUser(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      // Mock implementation for testing without real Stripe keys
      if (stripeSecretKey === 'sk_test_mock') {
        return this.createMockCheckoutSession(priceId);
      }
      
      // Create a customer if it doesn't exist
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email || `user${userId}@example.com`,
          name: user.username || `User ${userId}`,
          metadata: {
            userId: userId.toString()
          }
        });
        
        customerId = customer.id;
        
        // Update user with customer ID
        await storage.updateUser(userId, { stripeCustomerId: customerId });
      }
      
      // Create a checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer: customerId,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.CLIENT_URL || 'http://localhost:5000'}/?success=true`,
        cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5000'}/subscription?canceled=true`,
      });
      
      return session.url || '';
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }
  
  /**
   * Mock checkout session for testing
   */
  private async createMockCheckoutSession(priceId: string): Promise<string> {
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock URL
    return `http://localhost:5000/subscription-success?session_id=mock_session_${priceId}`;
  }
  
  /**
   * Process webhook events from Stripe
   */
  async handleWebhookEvent(payload: Buffer, signature: string): Promise<void> {
    try {
      // Skip webhook verification in mock mode
      if (stripeSecretKey === 'sk_test_mock') {
        return;
      }
      
      // Verify webhook signature
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
      
      // Handle different event types
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
          break;
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Error handling webhook event:', error);
      throw error;
    }
  }
  
  /**
   * Handle checkout session completed event
   */
  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
    // Get the customer ID from the session
    const customerId = session.customer as string;
    
    // Get the subscription ID
    const subscriptionId = session.subscription as string;
    
    // Find the user with this customer ID
    const users = await storage.getUserByStripeCustomerId(customerId);
    if (!users || users.length === 0) {
      console.error(`No user found with Stripe customer ID: ${customerId}`);
      return;
    }
    
    const userId = users[0].id;
    
    // Update user with subscription ID
    await storage.updateUser(userId, { 
      stripeSubscriptionId: subscriptionId,
      subscriptionStatus: 'active',
      plan: 'premium'
    });
    
    // Update protection settings to enable premium features
    const settings = await storage.getProtectionSettings(userId);
    if (settings) {
      await storage.updateProtectionSettings(userId, {
        socialMediaProtection: true
      });
    }
  }
  
  /**
   * Handle subscription updated event
   */
  private async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
    // Get the customer ID from the subscription
    const customerId = subscription.customer as string;
    
    // Find the user with this customer ID
    const users = await storage.getUserByStripeCustomerId(customerId);
    if (!users || users.length === 0) {
      console.error(`No user found with Stripe customer ID: ${customerId}`);
      return;
    }
    
    const userId = users[0].id;
    
    // Update user with subscription status
    await storage.updateUser(userId, { 
      subscriptionStatus: subscription.status,
      plan: subscription.status === 'active' ? 'premium' : 'basic'
    });
    
    // If subscription is not active, disable premium features
    if (subscription.status !== 'active') {
      const settings = await storage.getProtectionSettings(userId);
      if (settings) {
        await storage.updateProtectionSettings(userId, {
          socialMediaProtection: false
        });
      }
    }
  }
  
  /**
   * Handle subscription deleted event
   */
  private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    // Get the customer ID from the subscription
    const customerId = subscription.customer as string;
    
    // Find the user with this customer ID
    const users = await storage.getUserByStripeCustomerId(customerId);
    if (!users || users.length === 0) {
      console.error(`No user found with Stripe customer ID: ${customerId}`);
      return;
    }
    
    const userId = users[0].id;
    
    // Update user with subscription status
    await storage.updateUser(userId, { 
      subscriptionStatus: 'canceled',
      plan: 'basic'
    });
    
    // Disable premium features
    const settings = await storage.getProtectionSettings(userId);
    if (settings) {
      await storage.updateProtectionSettings(userId, {
        socialMediaProtection: false
      });
    }
  }
  
  /**
   * Get subscription details for a user
   */
  async getSubscriptionDetails(userId: number): Promise<any> {
    try {
      // Get the user
      const user = await storage.getUser(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      // If no subscription ID, return basic details
      if (!user.stripeSubscriptionId) {
        return {
          status: 'inactive',
          plan: 'basic',
          currentPeriodEnd: null
        };
      }
      
      // Mock implementation for testing without real Stripe keys
      if (stripeSecretKey === 'sk_test_mock') {
        return {
          status: user.subscriptionStatus || 'active',
          plan: user.plan || 'premium',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };
      }
      
      // Get subscription details from Stripe
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      
      // Safely access current_period_end
      const currentPeriodEnd = subscription.current_period_end 
        ? new Date(subscription.current_period_end * 1000).toISOString() 
        : null;
      
      return {
        status: subscription.status,
        plan: subscription.status === 'active' ? 'premium' : 'basic',
        currentPeriodEnd
      };
    } catch (error) {
      console.error('Error getting subscription details:', error);
      return {
        status: 'error',
        plan: 'basic',
        currentPeriodEnd: null
      };
    }
  }
}

export const stripeService = new StripeService();