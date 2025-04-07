import { apiRequest } from "./queryClient";
import { ThreatData } from "@shared/schema";

export interface UrlAnalysisResult {
  threatLevel: string;
  reasons: string[];
  content: string;
  threatData?: ThreatData;
}

/**
 * Analyzes URL for threats by sending a request to the backend
 * @param url The URL to analyze
 * @param useEnhancedAnalysis Whether to use advanced threat intelligence
 * @param saveToHistory Whether to save the result to scan history
 * @param source Source of the URL (e.g., "sms", "email", etc.)
 */
export async function analyzeUrl(
  url: string, 
  useEnhancedAnalysis: boolean = false,
  saveToHistory: boolean = false,
  source: 'sms' | 'email' | 'social' | 'manual' = 'manual'
): Promise<UrlAnalysisResult> {
  const response = await apiRequest(
    'POST',
    '/api/scan/url',
    { 
      url, 
      enhancedAnalysis: useEnhancedAnalysis,
      saveToHistory,
      source
    }
  );
  
  return response.json();
}

/**
 * Extracts URLs from text
 */
export function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.[a-zA-Z]{2,}(\/[^\s]*)?)/gi;
  const matches = text.match(urlRegex) || [];
  return matches;
}

/**
 * Gets threat color based on level
 */
export function getThreatColor(threatLevel: string): string {
  switch (threatLevel) {
    case 'phishing':
      return 'danger';
    case 'suspicious':
      return 'caution';
    case 'safe':
      return 'success';
    default:
      return 'primary';
  }
}

/**
 * Gets threat icon based on level
 */
export function getThreatIcon(threatLevel: string): string {
  switch (threatLevel) {
    case 'phishing':
      return 'warning';
    case 'suspicious':
      return 'help_outline';
    case 'safe':
      return 'check_circle';
    default:
      return 'info';
  }
}
