import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// Import NLP and URL analyzer functions directly from the file
import { aiAssistant } from "./ai-service";
import { notificationService } from "./notification-service";
import { stripeService } from "./stripe-service";
import { emailService } from "./email-service";
import { 
  scanTextSchema, 
  scanUrlSchema, 
  insertMessageSchema,
  chatMessageSchema,
  deviceTokenSchema,
  contactFormSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoints for PhishShield AI
  const apiRouter = express.Router();

  // Get protection settings
  apiRouter.get("/protection-settings", async (req: Request, res: Response) => {
    // In a real app, we'd get the userId from authentication
    const userId = 1; // Demo user ID
    
    const settings = await storage.getProtectionSettings(userId);
    if (!settings) {
      return res.status(404).json({ message: "Protection settings not found" });
    }
    
    res.json(settings);
  });

  // Update protection settings
  apiRouter.patch("/protection-settings", async (req: Request, res: Response) => {
    // In a real app, we'd get the userId from authentication
    const userId = 1; // Demo user ID
    
    try {
      const updatedSettings = await storage.updateProtectionSettings(userId, req.body);
      if (!updatedSettings) {
        return res.status(404).json({ message: "Protection settings not found" });
      }
      
      res.json(updatedSettings);
    } catch (error) {
      res.status(400).json({ message: "Invalid protection settings data" });
    }
  });

  // Get recent messages/alerts
  apiRouter.get("/messages", async (req: Request, res: Response) => {
    // In a real app, we'd get the userId from authentication
    const userId = 1; // Demo user ID
    
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const messages = await storage.getMessages(userId, limit);
    
    res.json(messages);
  });

  // Get message stats (for dashboard)
  apiRouter.get("/message-stats", async (req: Request, res: Response) => {
    // In a real app, we'd get the userId from authentication
    const userId = 1; // Demo user ID
    
    const days = req.query.days ? parseInt(req.query.days as string) : 30;
    const stats = await storage.getMessageStats(userId, days);
    
    res.json(stats);
  });

  // Scan text for phishing
  apiRouter.post("/scan/text", async (req: Request, res: Response) => {
    try {
      // Validate the request data
      const data = scanTextSchema.parse(req.body);
      
      // In a real app, we'd get the userId from authentication
      const userId = 1; // Demo user ID
      
      // Analyze text for phishing indicators
      const analysisResult = await analyzeTextForPhishing(data.content);
      
      // Create a message record
      const message = await storage.createMessage({
        userId,
        content: data.content,
        sender: data.sender || "Manual Scan",
        threatLevel: analysisResult.threatLevel,
        threatDetails: {
          reasons: analysisResult.reasons
        },
        source: data.source
      });
      
      // If phishing or suspicious, send push notification
      if (analysisResult.threatLevel === 'phishing' || analysisResult.threatLevel === 'suspicious') {
        // Get user's protection settings to check if notifications are enabled
        const settings = await storage.getProtectionSettings(userId);
        
        if (settings) {
          // Only send notifications if the relevant protection is enabled
          const shouldNotify = 
            (data.source === 'sms' && settings.smsProtection) ||
            (data.source === 'email' && settings.emailProtection) ||
            (data.source === 'social' && settings.socialMediaProtection) ||
            (data.source === 'manual'); // Always notify for manual scans
          
          if (shouldNotify) {
            // Send notification asynchronously - don't wait for it to complete
            notificationService.sendPhishingAlert(userId, message)
              .then(success => {
                if (success) {
                  console.log(`Push notification sent for message ${message.id}`);
                } else {
                  console.log(`Failed to send push notification for message ${message.id}`);
                }
              })
              .catch(error => {
                console.error(`Error sending push notification: ${error}`);
              });
          }
        }
      }
      
      // Return the analysis result and the created message
      res.json({
        analysis: analysisResult,
        message
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error scanning text" });
    }
  });

  // Scan URL for threats
  apiRouter.post("/scan/url", async (req: Request, res: Response) => {
    try {
      // Validate the request data
      const data = scanUrlSchema.parse(req.body);
      
      // Analyze URL for threats
      const analysisResult = await analyzeUrlForThreats(data.url);
      
      // Return the analysis result
      res.json(analysisResult);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error scanning URL" });
    }
  });

  // Mark message as read
  apiRouter.patch("/messages/:id/read", async (req: Request, res: Response) => {
    const messageId = parseInt(req.params.id);
    
    try {
      const updatedMessage = await storage.updateMessage(messageId, { isRead: true });
      if (!updatedMessage) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      res.json(updatedMessage);
    } catch (error) {
      res.status(500).json({ message: "Error updating message" });
    }
  });

  // Delete message
  apiRouter.delete("/messages/:id", async (req: Request, res: Response) => {
    const messageId = parseInt(req.params.id);
    
    try {
      const success = await storage.deleteMessage(messageId);
      if (!success) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error deleting message" });
    }
  });
  
  // AI Virtual Assistant endpoint
  apiRouter.post("/assistant/chat", async (req: Request, res: Response) => {
    try {
      // Validate the request data
      const data = chatMessageSchema.parse(req.body);
      
      // Get response from AI assistant
      const answer = await aiAssistant.getResponse(data.query);
      
      // Return the AI response
      res.json({
        answer,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("AI Assistant error:", error);
      res.status(500).json({ message: "Error processing your question" });
    }
  });
  
  // Device token registration for push notifications
  apiRouter.post("/device-tokens", async (req: Request, res: Response) => {
    try {
      // Validate the request data
      const data = deviceTokenSchema.parse(req.body);
      
      // In a real app, we'd get the userId from authentication
      const userId = 1; // Demo user ID
      
      // Create or update device token
      const deviceToken = await storage.createDeviceToken({
        userId,
        token: data.token,
        platform: data.platform
      });
      
      res.json({ success: true, deviceToken });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Device token registration error:", error);
      res.status(500).json({ message: "Error registering device token" });
    }
  });
  
  // Delete device token (for when user logs out or uninstalls app)
  apiRouter.delete("/device-tokens/:token", async (req: Request, res: Response) => {
    try {
      const token = req.params.token;
      
      const success = await storage.deleteDeviceToken(token);
      if (!success) {
        return res.status(404).json({ message: "Device token not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Device token deletion error:", error);
      res.status(500).json({ message: "Error deleting device token" });
    }
  });
  
  // Get user's subscription status
  apiRouter.get("/subscription", async (req: Request, res: Response) => {
    try {
      // For now, we'll use user ID 1 (demo user)
      const userId = 1;
      
      // Get subscription details from Stripe service
      const subscriptionDetails = await stripeService.getSubscriptionDetails(userId);
      
      // Return subscription details
      res.json(subscriptionDetails);
    } catch (error) {
      console.error("Subscription status error:", error);
      res.status(500).json({ message: "Error retrieving subscription status" });
    }
  });
  
  // Create a Stripe checkout session for subscription
  apiRouter.post("/create-checkout-session", async (req: Request, res: Response) => {
    try {
      // For now, we'll use user ID 1 (demo user)
      const userId = 1;
      
      // Get price ID from request body
      const { priceId } = req.body;
      
      if (!priceId) {
        return res.status(400).json({ message: "Price ID is required" });
      }
      
      // Create checkout session URL
      const sessionUrl = await stripeService.createCheckoutSession(userId, priceId);
      
      // Return the URL to redirect the user to Stripe checkout
      res.json({ url: sessionUrl });
    } catch (error) {
      console.error("Checkout session error:", error);
      res.status(500).json({ message: "Error creating checkout session" });
    }
  });
  
  // Contact support form submission
  apiRouter.post("/contact-support", async (req: Request, res: Response) => {
    try {
      // Validate the request data
      const data = contactFormSchema.parse(req.body);
      
      // Log the support request for record-keeping
      console.log("Support request received:", {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message.substring(0, 50) + (data.message.length > 50 ? '...' : '')
      });
      
      // Try to send email
      let emailSent = false;
      
      if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith('SG.')) {
        emailSent = await emailService.sendSupportEmail(
          data.name,
          data.email,
          data.subject,
          data.message
        );
      } else {
        console.warn("SendGrid API key is missing or invalid. Emails will not be sent.");
      }
      
      // Always return success to the client, but log if email failed
      if (!emailSent) {
        console.log("Email notification failed, but support request was logged successfully");
      }
      
      // Return success response to client
      res.json({ 
        success: true, 
        message: "Support request received successfully",
        emailSent
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Contact support error:", error);
      res.status(500).json({ message: "Error submitting support request" });
    }
  });
  
  // Stripe webhook endpoint
  apiRouter.post("/webhook", express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
    try {
      // Get Stripe signature from headers
      const signature = req.headers['stripe-signature'] as string;
      
      if (!signature) {
        return res.status(400).json({ message: "Missing Stripe signature" });
      }
      
      // Process webhook event
      await stripeService.handleWebhookEvent(req.body, signature);
      
      // Return success
      res.status(200).end();
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(400).end();
    }
  });

  // Mount the API router
  app.use("/api", apiRouter);

  // Create the NLP and URL analyzer modules
  app.use(express.static("public"));

  // Create server
  const httpServer = createServer(app);

  return httpServer;
}

// Simple NLP analysis for phishing detection
function analyzeTextForPhishing(text: string) {
  const lowerText = text.toLowerCase();
  
  // Common phishing indicators
  const urgencyTerms = ['urgent', 'immediate', 'alert', 'attention', 'act now', 'action required', 'immediately', 'quickly'];
  const rewardTerms = ['won', 'winner', 'prize', 'gift card', 'reward', 'free', 'congratulations'];
  const threatTerms = ['suspended', 'compromised', 'verify', 'secure', 'unusual activity', 'suspicious', 'breached'];
  const sensitiveTerms = ['password', 'login', 'credit card', 'account', 'bank', 'ssn', 'social security'];
  
  // Check for suspicious URLs
  const hasTyposquattingUrl = /amaz[0o]n|g[0o]{2}gle|faceb[0o]{2}k|appl[e3]|payp[a@]l|netfl[i1]x/i.test(text);
  const hasSuspiciousUrl = /bit\.ly|tinyurl|goo\.gl|t\.co|is\.gd|cli\.gs|ow\.ly|buff\.ly|adf\.ly|bit\.do/i.test(text);
  
  // Analyze the text
  const reasons: string[] = [];
  
  if (urgencyTerms.some(term => lowerText.includes(term))) {
    reasons.push('Urgency language detected');
  }
  
  if (rewardTerms.some(term => lowerText.includes(term))) {
    reasons.push('Reward scam patterns detected');
  }
  
  if (threatTerms.some(term => lowerText.includes(term))) {
    reasons.push('Security threat language detected');
  }
  
  if (sensitiveTerms.some(term => lowerText.includes(term))) {
    reasons.push('Requests for sensitive information');
  }
  
  if (hasTyposquattingUrl) {
    reasons.push('Brand impersonation detected');
  }
  
  if (hasSuspiciousUrl) {
    reasons.push('Suspicious URL shortener detected');
  }
  
  // Look for "click here" or similar phrases
  if (/click here|tap here|click the link|tap this link/i.test(text)) {
    reasons.push('Suspicious link instructions');
  }
  
  // Check for artificial time pressure
  if (/\d+\s*(hour|hr|minute|min|day|sec|second)s?|expires|limited time/i.test(text)) {
    reasons.push('Artificial time pressure');
  }
  
  // Determine threat level based on number of indicators
  let threatLevel = 'safe';
  if (reasons.length >= 3) {
    threatLevel = 'phishing';
  } else if (reasons.length >= 1) {
    threatLevel = 'suspicious';
  }
  
  return {
    threatLevel,
    reasons,
    content: text
  };
}

// URL analysis for threat detection
async function analyzeUrlForThreats(url: string) {
  // In a real app, this would:
  // 1. Check against known phishing databases
  // 2. Analyze domain age
  // 3. Look for suspicious patterns in URL
  // 4. Potentially use external threat intelligence APIs
  
  const lowerUrl = url.toLowerCase();
  
  const reasons: string[] = [];
  
  // Check for typosquatting of popular domains
  if (/amaz[0o]n|g[0o]{2}gle|faceb[0o]{2}k|appl[e3]|payp[a@]l|netfl[i1]x/i.test(lowerUrl)) {
    reasons.push('Brand impersonation detected in URL');
  }
  
  // Check for URL shorteners (potentially hiding malicious URLs)
  if (/bit\.ly|tinyurl|goo\.gl|t\.co|is\.gd|cli\.gs|ow\.ly|buff\.ly|adf\.ly|bit\.do/i.test(lowerUrl)) {
    reasons.push('URL shortener detected (could mask malicious destination)');
  }
  
  // Check for suspicious TLDs
  if (/\.(xyz|top|club|online|site|fun|rest|icu|loan)$/i.test(lowerUrl)) {
    reasons.push('Suspicious top-level domain (.xyz, .club, etc.)');
  }
  
  // Check for IP addresses in URLs (often suspicious)
  if (/https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/i.test(lowerUrl)) {
    reasons.push('IP address used in URL instead of domain name');
  }
  
  // Check for excessive subdomains (can be a red flag)
  const subdomainCount = (lowerUrl.match(/\./g) || []).length;
  if (subdomainCount >= 3) {
    reasons.push('Excessive subdomains in URL');
  }
  
  // Check for "secure" or "login" in the URL (common in phishing)
  if (/secure|login|signin|verify|account|password|auth/i.test(lowerUrl)) {
    reasons.push('Security-related terms in URL');
  }
  
  // Determine threat level based on number of indicators
  let threatLevel = 'safe';
  if (reasons.length >= 2) {
    threatLevel = 'phishing';
  } else if (reasons.length >= 1) {
    threatLevel = 'suspicious';
  }
  
  return {
    url,
    threatLevel,
    reasons
  };
}
