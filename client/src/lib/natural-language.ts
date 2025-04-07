import { apiRequest } from "./queryClient";
import { ThreatData } from "@shared/schema";

export interface PhishingAnalysisResult {
  threatLevel: string;
  reasons: string[];
  content: string;
  threatData?: ThreatData;
}

export interface MessageScanResult {
  analysis: PhishingAnalysisResult;
  message: {
    id: number;
    content: string;
    sender: string;
    threatLevel: string;
    threatDetails: {
      reasons: string[];
      threatData?: ThreatData;
    };
    scanDate: string;
  };
}

/**
 * Analyzes text for phishing indicators by sending a request to the backend
 * @param content The text content to analyze
 * @param sender The sender of the message (optional)
 * @param source The source of the message (e.g., "sms", "email", etc.)
 * @param useEnhancedAnalysis Whether to use advanced threat intelligence
 * @param saveToHistory Whether to save the result to scan history
 */
export async function analyzeText(
  content: string, 
  sender?: string, 
  source: 'sms' | 'email' | 'social' | 'manual' = 'manual',
  useEnhancedAnalysis: boolean = false,
  saveToHistory: boolean = true
): Promise<MessageScanResult> {
  const response = await apiRequest(
    'POST',
    '/api/scan/text',
    { 
      content, 
      sender, 
      source,
      enhancedAnalysis: useEnhancedAnalysis,
      saveToHistory
    }
  );
  
  return response.json();
}

/**
 * Helper function to highlight suspicious parts of a message
 */
export function highlightSuspiciousParts(content: string, reasons: string[]): string {
  let highlightedContent = content;
  
  // Define patterns to look for based on the reasons
  const patterns: Record<string, RegExp[]> = {
    'Urgency language detected': [
      /urgent/gi,
      /immediate/gi,
      /alert/gi,
      /attention/gi,
      /act now/gi,
      /action required/gi,
      /immediately/gi,
    ],
    'Reward scam patterns detected': [
      /won/gi,
      /winner/gi,
      /prize/gi,
      /gift card/gi,
      /reward/gi,
      /free/gi,
      /congratulations/gi,
    ],
    'Security threat language detected': [
      /suspended/gi,
      /compromised/gi,
      /verify/gi,
      /secure/gi,
      /unusual activity/gi,
      /suspicious/gi,
    ],
    'Suspicious link instructions': [
      /click here/gi,
      /tap here/gi,
      /click the link/gi,
      /tap this link/gi,
    ],
    'Artificial time pressure': [
      /\d+\s*(hour|hr|minute|min|day|sec|second)s?/gi,
      /expires/gi,
      /limited time/gi,
    ],
    'Suspicious URL detected': [
      /https?:\/\/[^\s]+/gi,
      /www\.[^\s]+/gi,
      /bit\.ly\/[^\s]+/gi,
      /tinyurl\.com\/[^\s]+/gi,
    ],
  };
  
  // Create JSX with highlighted parts
  const parts: string[] = [];
  const indices: { start: number; end: number }[] = [];
  
  // For each reason, find all matching patterns in the content
  reasons.forEach(reason => {
    const reasonPatterns = patterns[reason];
    if (reasonPatterns) {
      reasonPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          indices.push({ start: match.index, end: match.index + match[0].length });
        }
      });
    }
  });
  
  // Also highlight URLs (which might be malicious)
  const urlPattern = /https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+/gi;
  let match;
  while ((match = urlPattern.exec(content)) !== null) {
    indices.push({ start: match.index, end: match.index + match[0].length });
  }
  
  // Sort indices by start position and merge overlapping ranges
  indices.sort((a, b) => a.start - b.start);
  const mergedIndices: { start: number; end: number }[] = [];
  
  for (const range of indices) {
    if (mergedIndices.length === 0 || range.start > mergedIndices[mergedIndices.length - 1].end) {
      mergedIndices.push(range);
    } else {
      mergedIndices[mergedIndices.length - 1].end = Math.max(
        mergedIndices[mergedIndices.length - 1].end,
        range.end
      );
    }
  }
  
  // Create text parts with highlights
  let lastEnd = 0;
  for (const range of mergedIndices) {
    if (range.start > lastEnd) {
      parts.push(content.substring(lastEnd, range.start));
    }
    parts.push(`<span class="bg-warning-100 text-warning-600 px-1 rounded">${content.substring(range.start, range.end)}</span>`);
    lastEnd = range.end;
  }
  
  if (lastEnd < content.length) {
    parts.push(content.substring(lastEnd));
  }
  
  return parts.join("");
}
