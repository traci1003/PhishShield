import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Shield, ShieldCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

// Define subscription status type
interface SubscriptionStatus {
  status: string;
  plan: string;
  currentPeriodEnd: string | null;
}

// Define price IDs for Stripe
const PRICE_IDS = {
  premium: 'price_1PakqzJFUUCdTk7PYnVIwJMl', // Stripe price ID for premium plan
  family: 'price_1Pakr7JFUUCdTk7PTqbLyT3o'   // Stripe price ID for family plan
};

export default function Subscription() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Fetch subscription status
  const { data: subscriptionStatus, isLoading } = useQuery<SubscriptionStatus>({
    queryKey: ['/api/subscription'],
    refetchOnWindowFocus: false
  });
  
  // Plans with features
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 0,
      features: [
        'SMS Protection',
        'Email Protection',
        'Manual Scanning',
        '7-day History',
      ],
      icon: Shield,
      color: 'gray'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 7.99,
      features: [
        'Everything in Basic',
        'Social Media Protection',
        'On-Device Scanning',
        'Advanced Threat Detection',
        'Priority Customer Support',
        '30-day History',
        'Real-time Alerts'
      ],
      icon: ShieldCheck,
      color: 'primary',
      popular: true
    },
    {
      id: 'family',
      name: 'Family',
      price: 14.99,
      features: [
        'Everything in Premium',
        'Up to 5 Family Members',
        'Family Dashboard',
        'Parental Controls',
        'Location Sharing',
        '90-day History'
      ],
      icon: ShieldAlert,
      color: 'fuchsia'
    }
  ];

  // Handle plan upgrade through Stripe
  const handleUpgrade = async (planId: string) => {
    if (planId === 'basic') {
      toast({
        title: 'Basic plan',
        description: 'You are already on the free basic plan.',
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Get the price ID for the selected plan
      const priceId = planId === 'premium' ? PRICE_IDS.premium : PRICE_IDS.family;
      
      // Create checkout session via API
      const response = await apiRequest('POST', '/api/create-checkout-session', {
        priceId
      });
      
      const data = await response.json();
      
      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error upgrading:', error);
      toast({
        variant: 'destructive',
        title: 'Upgrade failed',
        description: 'There was an error creating your checkout session. Please try again.',
      });
      setIsProcessing(false);
    }
  };

  // Check for success/cancel URL parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('success')) {
      toast({
        title: 'Subscription successful!',
        description: 'Your subscription has been activated. Enjoy the premium features!',
      });
      window.history.replaceState({}, '', window.location.pathname);
    } else if (queryParams.get('canceled')) {
      toast({
        variant: 'destructive',
        title: 'Subscription canceled',
        description: 'Your subscription process was canceled.',
      });
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [toast]);

  // Determine current plan
  const currentPlan = subscriptionStatus?.plan || 'basic';

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-fuchsia-600 bg-clip-text text-transparent">
        Upgrade Your Protection
      </h1>
      
      <p className="text-gray-600 mb-8">
        Choose the plan that works best for you and your family's digital security needs.
      </p>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {subscriptionStatus?.status === 'active' && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="font-semibold text-green-800">
                  You are currently subscribed to the {subscriptionStatus.plan.charAt(0).toUpperCase() + subscriptionStatus.plan.slice(1)} plan
                </h3>
              </div>
              {subscriptionStatus.currentPeriodEnd && (
                <p className="text-sm text-green-700 mt-1">
                  Your subscription renews on {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isPlanCurrent = currentPlan === plan.id;
              const PlanIcon = plan.icon;
              
              return (
                <Card 
                  key={plan.id} 
                  className={`p-6 ${plan.popular ? 'ring-2 ring-primary-500 shadow-lg' : ''} 
                             ${isPlanCurrent ? 'bg-gray-50 border-primary' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <PlanIcon className={`h-6 w-6 mr-2 text-${plan.color}-500`} />
                      <h2 className="text-xl font-bold">{plan.name}</h2>
                    </div>
                    {plan.popular && (
                      <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-semibold rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-4 mb-6">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${isPlanCurrent ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 
                      plan.id === 'premium' ? 'bg-gradient-to-r from-primary-600 to-fuchsia-600 hover:from-primary-700 hover:to-fuchsia-700' : ''}`}
                    disabled={isPlanCurrent || isProcessing}
                    onClick={() => handleUpgrade(plan.id)}
                  >
                    {isProcessing ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                        Processing...
                      </span>
                    ) : isPlanCurrent ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </Card>
              );
            })}
          </div>
        </>
      )}
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Why Upgrade?</h3>
        <p className="text-sm text-gray-600">
          Premium subscribers get access to enhanced protection features including social media scanning, 
          priority support, and advanced threat detection for the most comprehensive digital security experience.
        </p>
      </div>
    </div>
  );
}