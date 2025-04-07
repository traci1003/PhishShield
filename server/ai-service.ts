import { PERPLEXITY_MODELS } from '@shared/schema';
import fetch from 'node-fetch';
import { log } from './vite';

// Type for Perplexity API request
interface PerplexityRequest {
  model: string;
  messages: {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

// Type for Perplexity API response
interface PerplexityResponse {
  id: string;
  model: string;
  object: string;
  created: number;
  choices: {
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  citations?: {
    text: string;
    url: string;
  }[];
}

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

/**
 * AI Assistant class for handling customer service inquiries
 */
export class AIAssistant {
  private apiKey: string;
  private model: string;

  constructor(model: string = PERPLEXITY_MODELS.SMALL) {
    this.apiKey = process.env.PERPLEXITY_API_KEY || '';
    this.model = model;
    
    if (!this.apiKey) {
      log('WARNING: PERPLEXITY_API_KEY not set. AI Assistant will not function correctly.', 'ai-service');
    }
  }

  /**
   * Get a response from the AI assistant
   */
  async getResponse(query: string): Promise<string> {
    try {
      if (!this.apiKey) {
        return "Sorry, I'm not available right now. Please try again later.";
      }

      const response = await this.callPerplexityAPI(query);
      return response.choices[0].message.content;
    } catch (error) {
      log(`Error getting AI response: ${error}`, 'ai-service');
      return "I apologize, but I'm having trouble processing your request. Please try again later.";
    }
  }

  /**
   * Call the Perplexity API
   */
  private async callPerplexityAPI(query: string): Promise<PerplexityResponse> {
    const requestData: PerplexityRequest = {
      model: this.model,
      messages: [
        {
          role: 'system',
          content: PHISHSHIELD_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: query,
        },
      ],
      temperature: 0.2,
      max_tokens: 300,
      stream: false,
    };

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Perplexity API error (${response.status}): ${errorText}`);
    }

    return await response.json() as PerplexityResponse;
  }
}

// Create and export a singleton instance
export const aiAssistant = new AIAssistant();