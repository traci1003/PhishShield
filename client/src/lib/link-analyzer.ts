import { apiRequest } from "./queryClient";

export interface UrlAnalysisResult {
  url: string;
  threatLevel: string;
  reasons: string[];
}

/**
 * Analyzes URL for threats by sending a request to the backend
 */
export async function analyzeUrl(url: string): Promise<UrlAnalysisResult> {
  const response = await apiRequest(
    'POST',
    '/api/scan/url',
    { url }
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
