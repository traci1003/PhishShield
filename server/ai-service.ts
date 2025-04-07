import { PERPLEXITY_MODELS } from '@shared/schema';
import { log } from './vite';

// System prompt for the AI assistant
const PHISHSHIELD_SYSTEM_PROMPT = `You are PhishShield AI's customer service assistant. Help users understand phishing threats, how to stay safe online, and how to use the PhishShield app. 

About PhishShield AI:
- It's an AI-powered app that detects phishing attempts in messages and links
- It protects users from email, SMS, and social media phishing
- It uses machine learning to identify suspicious content
- It provides real-time alerts and explanations for detected threats

When answering:
- Be helpful, concise, and friendly
- If unsure, don't make up information
- For technical problems, suggest contacting support@phishshield.ai
- Be knowledgeable about common phishing tactics and prevention measures
- Answer in 2-3 sentences maximum unless detailed explanation is necessary

Important: The app is available on iOS, Android, and Web.`;

// Mock responses for common questions
const MOCK_RESPONSES: Record<string, string> = {
  default: "I'm PhishShield AI's virtual assistant. I can help with questions about phishing protection, online safety, and using our app. What would you like to know?",
  hello: "Hello! I'm here to help with any questions about PhishShield AI or online security. How can I assist you today?",
  phishing: "Phishing is a type of cyber attack where criminals try to trick you into revealing sensitive information by pretending to be trustworthy entities. PhishShield AI helps detect these attempts by scanning messages and links for suspicious patterns.",
  features: "PhishShield AI offers real-time scanning of messages and links, threat intelligence lookup, customizable protection settings, and push notifications for threats. Premium subscribers also get social media protection and priority support.",
  subscription: "PhishShield AI offers three subscription tiers: Basic (free), Premium ($7.99/month), and Family ($14.99/month). Premium includes social media protection, advanced threat details, and priority support.",
  help: "I can answer questions about phishing protection, how to use the app, subscription options, or general online security. Just ask your question and I'll do my best to help!",
  contact: "For technical issues or billing questions, please email support@phishshield.ai or use the Contact Support form in the app. Our team typically responds within 24 hours.",
  "how it works": "PhishShield AI uses machine learning and threat intelligence to analyze messages and links. It checks for suspicious patterns, domain reputation, and known threats. When a potential threat is detected, you'll receive an alert with explanation of the risk.",
};

/**
 * AI Assistant class for handling customer service inquiries (console-based implementation)
 */
export class AIAssistant {
  private model: string;

  constructor(model: string = PERPLEXITY_MODELS.SMALL) {
    this.model = model;
    log('Using console-based AI Assistant - no API key required', 'ai-service');
  }

  /**
   * Get a response from the AI assistant
   */
  async getResponse(query: string): Promise<string> {
    try {
      console.log('\n========== AI QUERY ==========');
      console.log(`User Query: ${query}`);
      console.log('==============================\n');
      
      // Generate a mock response based on the query keywords
      const response = this.generateMockResponse(query);
      
      console.log('\n========== AI RESPONSE ==========');
      console.log(response);
      console.log('================================\n');
      
      return response;
    } catch (error) {
      log(`Error getting AI response: ${error}`, 'ai-service');
      return "I apologize, but I'm having trouble processing your request. Please try again later.";
    }
  }

  /**
   * Generate a mock response based on keywords in the query
   */
  private generateMockResponse(query: string): string {
    const normalizedQuery = query.toLowerCase();
    
    // Check for keyword matches
    for (const [keyword, response] of Object.entries(MOCK_RESPONSES)) {
      if (normalizedQuery.includes(keyword.toLowerCase())) {
        return response;
      }
    }
    
    // Return default response if no keywords match
    return MOCK_RESPONSES.default;
  }
}

// Create and export a singleton instance
export const aiAssistant = new AIAssistant();
