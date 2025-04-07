import fetch from 'node-fetch';

/**
 * ThreatIntelligence class provides integration with external threat intelligence APIs
 * and caches results for improved performance.
 */
export class ThreatIntelligence {
  private cache: Map<string, ThreatIntelResult>;
  private cacheExpiry: Map<string, number>;
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  constructor() {
    this.cache = new Map();
    this.cacheExpiry = new Map();
  }

  /**
   * Get threat intelligence data for a domain or URL
   */
  async queryUrl(url: string): Promise<ThreatIntelResult> {
    const domain = this.extractDomain(url);
    
    // Check cache first
    if (this.cache.has(domain)) {
      const expiryTime = this.cacheExpiry.get(domain) || 0;
      if (Date.now() < expiryTime) {
        return this.cache.get(domain)!;
      }
      // Cache expired, remove it
      this.cache.delete(domain);
      this.cacheExpiry.delete(domain);
    }
    
    try {
      // Gather threat intelligence from multiple sources
      const [virusTotalResult, phishingDbResult] = await Promise.all([
        this.checkVirusTotal(domain),
        this.checkPhishingDatabase(domain)
      ]);
      
      // Combine and evaluate results
      const result: ThreatIntelResult = {
        domain,
        malicious: virusTotalResult.malicious || phishingDbResult.malicious,
        suspicious: virusTotalResult.suspicious || phishingDbResult.suspicious,
        sources: [],
        lastChecked: new Date().toISOString(),
        details: {
          reputationScore: virusTotalResult.reputationScore,
          categories: [...(virusTotalResult.categories || []), ...(phishingDbResult.categories || [])],
          reportedTimes: virusTotalResult.reportedTimes || 0,
        }
      };
      
      // Add sources that provided data
      if (virusTotalResult.malicious || virusTotalResult.suspicious) {
        result.sources.push('VirusTotal');
      }
      
      if (phishingDbResult.malicious || phishingDbResult.suspicious) {
        result.sources.push('PhishingDB');
      }
      
      // Cache the result
      this.cache.set(domain, result);
      this.cacheExpiry.set(domain, Date.now() + this.CACHE_DURATION);
      
      return result;
    } catch (error) {
      console.error(`Error querying threat intelligence for ${domain}:`, error);
      
      // Return a default/fallback result in case of failure
      return {
        domain,
        malicious: false,
        suspicious: false,
        sources: [],
        lastChecked: new Date().toISOString(),
        details: {
          reputationScore: 0,
          categories: ['error-checking'],
          reportedTimes: 0,
        }
      };
    }
  }
  
  /**
   * Analyze email sender reputation
   */
  async analyzeEmailSender(email: string): Promise<SenderReputationResult> {
    const domain = email.split('@')[1] || '';
    
    try {
      // Get DMARC, SPF, and DKIM records for the domain
      // This would involve real DNS lookups in a production app
      const hasDmarc = await this.checkDmarcRecord(domain);
      const hasSpf = await this.checkSpfRecord(domain);
      const hasDkim = await this.checkDkimRecord(domain);
      
      // Calculate a reputation score based on email security standards
      let reputationScore = 0;
      if (hasDmarc) reputationScore += 33;
      if (hasSpf) reputationScore += 33;
      if (hasDkim) reputationScore += 34;
      
      return {
        email,
        domain,
        reputationScore,
        hasDmarc,
        hasSpf,
        hasDkim,
        suspiciousDomain: await this.isDomainSuspicious(domain),
        newDomain: await this.isDomainNew(domain),
        details: {
          securityLevel: reputationScore >= 80 ? 'high' : reputationScore >= 40 ? 'medium' : 'low',
          creationDate: await this.getDomainCreationDate(domain),
        }
      };
    } catch (error) {
      console.error(`Error analyzing email sender ${email}:`, error);
      
      return {
        email,
        domain,
        reputationScore: 0,
        hasDmarc: false,
        hasSpf: false,
        hasDkim: false,
        suspiciousDomain: false,
        newDomain: false,
        details: {
          securityLevel: 'unknown',
          creationDate: null,
        }
      };
    }
  }
  
  /**
   * Extract domain from URL
   */
  private extractDomain(url: string): string {
    try {
      // Remove protocol and path, leaving just the domain
      let domain = url.toLowerCase();
      
      // Remove protocol (http://, https://, ftp://, etc.)
      domain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
      
      // Remove path, query string, and fragment
      const domainParts = domain.split('/');
      domain = domainParts[0];
      
      return domain;
    } catch (error) {
      console.error('Error extracting domain:', error);
      return url;
    }
  }
  
  /**
   * Check VirusTotal API for domain reputation
   */
  private async checkVirusTotal(domain: string): Promise<{
    malicious: boolean;
    suspicious: boolean;
    reputationScore: number;
    categories?: string[];
    reportedTimes?: number;
  }> {
    try {
      // In a real implementation, this would make an actual API call to VirusTotal
      // For now, we're using a mock implementation based on domain keywords
      
      // VT_API_KEY would be process.env.VIRUSTOTAL_API_KEY in a real implementation
      // const response = await fetch(`https://www.virustotal.com/api/v3/domains/${domain}`, {
      //   headers: { 'x-apikey': process.env.VIRUSTOTAL_API_KEY || '' }
      // });
      // const data = await response.json();
      
      // For demo purposes, we'll use keywords to determine maliciousness
      const suspiciousKeywords = ['phish', 'scam', 'hack', 'secure', 'bank', 'account', 'verify', 'login'];
      const maliciousKeywords = ['phishing', 'malware', 'hack', 'exploit', 'virus'];
      
      const hasSuspiciousWord = suspiciousKeywords.some(keyword => domain.includes(keyword));
      const hasMaliciousWord = maliciousKeywords.some(keyword => domain.includes(keyword));
      
      // Create fake reputation score based on domain characteristics
      let reputationScore = 100;
      let categories: string[] = [];
      
      if (domain.includes('phish') || domain.includes('scam')) {
        reputationScore -= 90;
        categories.push('phishing');
      }
      
      if (domain.includes('bank') || domain.includes('secure') || domain.includes('login')) {
        reputationScore -= 20;
        categories.push('financial');
      }
      
      if (domain.includes('free') || domain.includes('prize')) {
        reputationScore -= 40;
        categories.push('suspicious');
      }
      
      // Random reputation reduction for some domains to introduce variety
      if (domain.length > 15) {
        const randomReduction = Math.floor(Math.random() * 30);
        reputationScore -= randomReduction;
      }
      
      // Ensure reputation score stays within bounds
      reputationScore = Math.max(0, Math.min(100, reputationScore));
      
      // Simulate reported times
      const reportedTimes = hasMaliciousWord ? Math.floor(Math.random() * 1000) + 10 : 
                           hasSuspiciousWord ? Math.floor(Math.random() * 10) + 1 : 0;
      
      return {
        malicious: hasMaliciousWord || reputationScore < 30,
        suspicious: hasSuspiciousWord || reputationScore < 60,
        reputationScore,
        categories,
        reportedTimes
      };
      
    } catch (error) {
      console.error(`Error checking VirusTotal for ${domain}:`, error);
      return { malicious: false, suspicious: false, reputationScore: 100 };
    }
  }
  
  /**
   * Check Phishing Database for domain reputation
   */
  private async checkPhishingDatabase(domain: string): Promise<{
    malicious: boolean;
    suspicious: boolean;
    categories?: string[];
  }> {
    // This would make a real API call in production
    // Example: OpenPhish, PhishTank, etc.
    
    // Simplified check for demonstration
    const knownPhishingDomains = [
      'phishing.com',
      'scam.com',
      'secure-bank.xyz',
      'login-verify.com',
      'account-update.info'
    ];
    
    const isMalicious = knownPhishingDomains.includes(domain);
    const isSuspicious = domain.includes('verify') || domain.includes('secure') || 
                         domain.includes('banking') || domain.includes('login') ||
                         domain.includes('update') || domain.includes('account');
    
    return {
      malicious: isMalicious,
      suspicious: isSuspicious && !isMalicious,
      categories: isMalicious ? ['phishing', 'fraud'] : 
                  isSuspicious ? ['suspicious'] : []
    };
  }
  
  /**
   * Check if domain has DMARC record
   */
  private async checkDmarcRecord(domain: string): Promise<boolean> {
    // In production, this would perform a real DNS lookup
    // For demo: common domains have DMARC, random or suspicious domains don't
    return !domain.includes('phish') && 
           !domain.includes('scam') && 
           domain.includes('.');
  }
  
  /**
   * Check if domain has SPF record
   */
  private async checkSpfRecord(domain: string): Promise<boolean> {
    // In production, this would perform a real DNS lookup
    // For demo: common domains have SPF, random or suspicious domains vary
    return !domain.includes('phish') && 
           domain.includes('.');
  }
  
  /**
   * Check if domain has DKIM record
   */
  private async checkDkimRecord(domain: string): Promise<boolean> {
    // In production, this would perform a real DNS lookup
    // For demo: common domains have DKIM, random or suspicious domains usually don't
    return domain.includes('com') || 
           domain.includes('org') || 
           domain.includes('net');
  }
  
  /**
   * Check if domain is suspicious (fake implementation for demo)
   */
  private async isDomainSuspicious(domain: string): Promise<boolean> {
    return domain.includes('phish') || 
           domain.includes('scam') || 
           domain.includes('free') || 
           domain.includes('verify') ||
           domain.length > 20;
  }
  
  /**
   * Check if domain is relatively new (fake implementation for demo)
   */
  private async isDomainNew(domain: string): Promise<boolean> {
    // In production, this would check WHOIS data
    // Random determination for demo purposes
    return domain.length > 15 || 
           domain.includes('xyz') || 
           domain.includes('info');
  }
  
  /**
   * Get domain creation date (fake implementation for demo)
   */
  private async getDomainCreationDate(domain: string): Promise<string | null> {
    // In production, this would check WHOIS data
    // Generate random creation date for demo purposes
    if (domain.includes('com') || domain.includes('org') || domain.includes('net')) {
      // Older domains
      const year = 2000 + Math.floor(Math.random() * 10);
      const month = 1 + Math.floor(Math.random() * 12);
      const day = 1 + Math.floor(Math.random() * 28);
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    } else if (domain.includes('io') || domain.includes('app')) {
      // Newer domains
      const year = 2015 + Math.floor(Math.random() * 7);
      const month = 1 + Math.floor(Math.random() * 12);
      const day = 1 + Math.floor(Math.random() * 28);
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    } else if (domain.includes('xyz') || domain.includes('info')) {
      // Very new domains
      const year = 2022 + Math.floor(Math.random() * 3);
      const month = 1 + Math.floor(Math.random() * 12);
      const day = 1 + Math.floor(Math.random() * 28);
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
    
    return null;
  }
}

// Define types
export interface ThreatIntelResult {
  domain: string;
  malicious: boolean;
  suspicious: boolean;
  sources: string[];
  lastChecked: string;
  details: {
    reputationScore: number;
    categories: string[];
    reportedTimes: number;
  };
}

export interface SenderReputationResult {
  email: string;
  domain: string;
  reputationScore: number;
  hasDmarc: boolean;
  hasSpf: boolean;
  hasDkim: boolean;
  suspiciousDomain: boolean;
  newDomain: boolean;
  details: {
    securityLevel: 'high' | 'medium' | 'low' | 'unknown';
    creationDate: string | null;
  };
}

// Export singleton instance
export const threatIntelligence = new ThreatIntelligence();