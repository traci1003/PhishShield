import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  Clock,
  Users,
  Star,
  Bell,
  MessageSquare,
  RefreshCcw 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define subscription status type
interface SubscriptionStatus {
  status: string;
  plan: string;
  currentPeriodEnd: string | null;
}

// Use real Stripe price IDs (these should be provided by the Stripe dashboard)
const PRICE_IDS = {
  premium: 'price_1OuYNjKhPHjzYrXRoTf71hQj', // Premium monthly plan price ID
  family: 'price_1OuYOIKhPHjzYrXR8bQfkjI9'   // Family monthly plan price ID
};

export default function Subscription() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'cards' | 'comparison'>('cards');
  
  // Fetch subscription status
  const { data: subscriptionStatus, isLoading } = useQuery<SubscriptionStatus>({
    queryKey: ['/api/subscription'],
    refetchOnWindowFocus: false
  });
  
  // Plans with features and detailed descriptions
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 0,
      description: 'Essential protection for individuals getting started with digital security',
      features: [
        'SMS Phishing Protection',
        'Email Phishing Detection',
        'Manual Link Scanning',
        '7-day History Retention',
        'Basic Threat Analysis',
        'Web Interface Access'
      ],
      limitations: [
        'No Social Media Protection',
        'Limited to 10 scans per day',
        'Standard Support Only',
        'No Real-time Alerts'
      ],
      icon: Shield,
      color: 'gray'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 7.99,
      description: 'Advanced protection with AI-powered features for comprehensive security',
      features: [
        'Everything in Basic',
        'Social Media Protection',
        'Advanced AI Threat Detection',
        'Unlimited Scans',
        'On-Device Scanning',
        'Priority Customer Support',
        '30-day History Retention',
        'Real-time Threat Alerts',
        'Weekly Security Reports'
      ],
      highlights: [
        { icon: Zap, text: 'AI-powered scanning engine' },
        { icon: Bell, text: 'Real-time threat alerts' },
        { icon: MessageSquare, text: 'Priority support' }
      ],
      icon: ShieldCheck,
      color: 'primary',
      popular: true
    },
    {
      id: 'family',
      name: 'Family',
      price: 14.99,
      description: 'Complete protection for up to 5 family members with parental controls',
      features: [
        'Everything in Premium',
        'Up to 5 Family Members',
        'Family Dashboard',
        'Parental Controls',
        'Location Sharing',
        '90-day History Retention',
        'Cross-device Protection',
        'Family Activity Reports',
        'Enhanced Privacy Protection'
      ],
      highlights: [
        { icon: Users, text: 'Protection for 5 members' },
        { icon: Clock, text: '90-day history retention' },
        { icon: Star, text: 'Premium support' }
      ],
      icon: ShieldAlert,
      color: 'fuchsia'
    }
  ];

  // Feature comparison for the comparison table
  const featureComparison = [
    { 
      feature: 'SMS Protection', 
      basic: true, 
      premium: true, 
      family: true,
      description: 'Detect and alert on phishing attempts via SMS messages'
    },
    { 
      feature: 'Email Protection', 
      basic: true, 
      premium: true, 
      family: true,
      description: 'Analyze email content for phishing indicators'
    },
    { 
      feature: 'Social Media Protection', 
      basic: false, 
      premium: true, 
      family: true,
      description: 'Scan social media messages and links for threats'
    },
    { 
      feature: 'Advanced AI Detection', 
      basic: false, 
      premium: true, 
      family: true,
      description: 'Enhanced threat detection with our AI engine'
    },
    { 
      feature: 'History Retention', 
      basic: '7 days', 
      premium: '30 days', 
      family: '90 days',
      description: 'How long scanned messages are stored for review'
    },
    { 
      feature: 'Real-time Alerts', 
      basic: false, 
      premium: true, 
      family: true,
      description: 'Immediate notifications for detected threats'
    },
    { 
      feature: 'Customer Support', 
      basic: 'Standard', 
      premium: 'Priority', 
      family: 'Premium',
      description: 'Level of support access and response time'
    },
    { 
      feature: 'Scans Per Day', 
      basic: '10', 
      premium: 'Unlimited', 
      family: 'Unlimited',
      description: 'Number of manual scans allowed per day'
    },
    { 
      feature: 'Family Dashboard', 
      basic: false, 
      premium: false, 
      family: true,
      description: 'Central dashboard to monitor family security'
    },
    { 
      feature: 'Parental Controls', 
      basic: false, 
      premium: false, 
      family: true,
      description: 'Content filtering and activity monitoring for children'
    },
    { 
      feature: 'Location Sharing', 
      basic: false, 
      premium: false, 
      family: true,
      description: 'Secure location sharing between family members'
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

  // Determine current plan (handle undefined subscriptionStatus)
  const currentPlan = (subscriptionStatus && 'plan' in subscriptionStatus) 
    ? subscriptionStatus.plan 
    : 'basic';

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary-600 to-fuchsia-600 bg-clip-text text-transparent">
          Upgrade Your Protection
        </h1>
        
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose the plan that works best for you and your family's digital security needs. 
          All plans include our core protection features.
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {subscriptionStatus && subscriptionStatus.status === 'active' && (
            <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
                <h3 className="font-semibold text-green-800 text-lg">
                  You are currently subscribed to the {subscriptionStatus.plan.charAt(0).toUpperCase() + subscriptionStatus.plan.slice(1)} plan
                </h3>
              </div>
              {subscriptionStatus.currentPeriodEnd && (
                <p className="text-sm text-green-700">
                  Your subscription renews on {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString()}
                </p>
              )}
              <div className="mt-3">
                <Button 
                  variant="outline" 
                  className="text-green-700 bg-green-50 border-green-200 hover:bg-green-100"
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Manage Subscription
                </Button>
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <Tabs defaultValue="cards" className="w-full" onValueChange={(value) => setViewMode(value as 'cards' | 'comparison')}>
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="cards">Plan Cards</TabsTrigger>
                <TabsTrigger value="comparison">Feature Comparison</TabsTrigger>
              </TabsList>
              <TabsContent value="cards">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  {plans.map((plan) => {
                    const isPlanCurrent = currentPlan === plan.id;
                    const PlanIcon = plan.icon;
                    
                    return (
                      <Card 
                        key={plan.id} 
                        className={`p-6 relative ${plan.popular ? 'ring-2 ring-primary-500 shadow-lg' : ''} 
                                  ${isPlanCurrent ? 'bg-gray-50 border-primary' : ''}`}
                      >
                        {plan.popular && (
                          <div className="absolute -top-3 left-0 right-0 flex justify-center">
                            <span className="px-3 py-1 bg-primary-500 text-white text-xs font-semibold rounded-full shadow-md">
                              Most Popular
                            </span>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-start mt-3">
                          <div className="flex items-center">
                            <PlanIcon className={`h-6 w-6 mr-2 ${plan.id === 'basic' ? 'text-gray-500' : 
                              plan.id === 'premium' ? 'text-primary-500' : 'text-fuchsia-500'}`} />
                            <h2 className="text-xl font-bold">{plan.name}</h2>
                          </div>
                        </div>
                        
                        <div className="mt-4 mb-2">
                          <span className="text-3xl font-bold">${plan.price}</span>
                          <span className="text-gray-500">/month</span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                        
                        {plan.highlights && (
                          <div className="mb-4 space-y-2">
                            {plan.highlights.map((highlight, idx) => {
                              const HIcon = highlight.icon;
                              return (
                                <div key={idx} className="flex items-center p-2 bg-gray-50 rounded-lg">
                                  <HIcon className={`h-4 w-4 mr-2 ${plan.id === 'premium' ? 'text-primary-500' : 'text-fuchsia-500'}`} />
                                  <span className="text-sm font-medium">{highlight.text}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        
                        <div className="border-t border-gray-200 my-4 pt-4">
                          <h4 className="text-sm font-semibold mb-2">Features:</h4>
                          <ul className="space-y-2 mb-6">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {plan.limitations && (
                          <div className="border-t border-gray-200 my-4 pt-4">
                            <h4 className="text-sm font-semibold mb-2">Limitations:</h4>
                            <ul className="space-y-2 mb-6">
                              {plan.limitations.map((limitation, index) => (
                                <li key={index} className="flex items-start">
                                  <AlertCircle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-gray-600">{limitation}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <Button 
                          className={`w-full ${isPlanCurrent ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 
                            plan.id === 'premium' ? 'bg-gradient-to-r from-primary-600 to-fuchsia-600 hover:from-primary-700 hover:to-fuchsia-700' : 
                            plan.id === 'family' ? 'bg-fuchsia-600 hover:bg-fuchsia-700' : ''}`}
                          disabled={isPlanCurrent || isProcessing || (plan.id === 'basic' && currentPlan !== 'basic')}
                          onClick={() => handleUpgrade(plan.id)}
                        >
                          {isProcessing ? (
                            <span className="flex items-center">
                              <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                              Processing...
                            </span>
                          ) : isPlanCurrent ? 'Current Plan' : plan.id === 'basic' ? 'Free Plan' : 'Upgrade'}
                        </Button>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
              
              <TabsContent value="comparison">
                <div className="overflow-x-auto mt-6">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-3 font-semibold">Feature</th>
                        <th className="py-4 px-3 font-semibold text-gray-600">Basic</th>
                        <th className="py-4 px-3 font-semibold text-primary-600">Premium</th>
                        <th className="py-4 px-3 font-semibold text-fuchsia-600">Family</th>
                      </tr>
                    </thead>
                    <tbody>
                      {featureComparison.map((item, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                          <td className="py-3 px-3 flex flex-col">
                            <span className="font-medium">{item.feature}</span>
                            <span className="text-xs text-gray-500">{item.description}</span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            {typeof item.basic === 'boolean' ? 
                              (item.basic ? 
                                <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /> : 
                                <div className="h-5 w-5 mx-auto">—</div>
                              ) : 
                              <span className="text-sm">{item.basic}</span>
                            }
                          </td>
                          <td className="py-3 px-3 text-center">
                            {typeof item.premium === 'boolean' ? 
                              (item.premium ? 
                                <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /> : 
                                <div className="h-5 w-5 mx-auto">—</div>
                              ) : 
                              <span className="text-sm font-medium">{item.premium}</span>
                            }
                          </td>
                          <td className="py-3 px-3 text-center">
                            {typeof item.family === 'boolean' ? 
                              (item.family ? 
                                <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /> : 
                                <div className="h-5 w-5 mx-auto">—</div>
                              ) : 
                              <span className="text-sm font-medium">{item.family}</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <Button 
                      key={plan.id}
                      className={`${plan.id === 'basic' ? 'bg-gray-600 hover:bg-gray-700' : 
                                    plan.id === 'premium' ? 'bg-gradient-to-r from-primary-600 to-fuchsia-600 hover:from-primary-700 hover:to-fuchsia-700' : 
                                    'bg-fuchsia-600 hover:bg-fuchsia-700'}`}
                      disabled={(currentPlan === plan.id) || isProcessing || (plan.id === 'basic' && currentPlan !== 'basic')}
                      onClick={() => handleUpgrade(plan.id)}
                    >
                      {plan.id === 'basic' ? 'Free Plan' : 
                       currentPlan === plan.id ? 'Current Plan' : 
                       `Upgrade to ${plan.name} ($${plan.price}/mo)`}
                    </Button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
      
      <div className="mt-12 p-6 bg-gray-50 rounded-lg shadow-sm">
        <h3 className="font-semibold text-lg mb-3 text-center">Why Upgrade to Premium?</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-3">
              <Zap className="h-6 w-6 text-primary-600" />
            </div>
            <h4 className="font-medium mb-2">Advanced AI Protection</h4>
            <p className="text-sm text-gray-600">
              Our AI-powered detection engine identifies even the most sophisticated phishing attempts 
              with industry-leading accuracy.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-3">
              <Bell className="h-6 w-6 text-primary-600" />
            </div>
            <h4 className="font-medium mb-2">Real-time Alerts</h4>
            <p className="text-sm text-gray-600">
              Receive instant notifications when threats are detected, allowing you to respond immediately to
              potential security risks.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-3">
              <MessageSquare className="h-6 w-6 text-primary-600" />
            </div>
            <h4 className="font-medium mb-2">Priority Support</h4>
            <p className="text-sm text-gray-600">
              Get fast responses from our security experts who can help you with any questions or
              concerns about potential threats.
            </p>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-600 mb-4">
          All plans include a 14-day money-back guarantee. You can cancel your subscription at any time.
        </div>
        
        <div className="text-xs text-gray-500 flex justify-center space-x-4">
          <Link href="/faq">
            <a className="hover:text-primary-600 transition-colors">FAQ</a>
          </Link>
          <span>•</span>
          <Link href="/privacy-policy">
            <a className="hover:text-primary-600 transition-colors">Privacy Policy</a>
          </Link>
          <span>•</span>
          <Link href="/terms-of-service">
            <a className="hover:text-primary-600 transition-colors">Terms of Service</a>
          </Link>
        </div>
      </div>
    </div>
  );
}