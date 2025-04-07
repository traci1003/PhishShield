import React from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8 flex items-center">
        <Link href="/">
          <a className="flex items-center text-primary hover:text-primary-600 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </a>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-fuchsia-600 bg-clip-text text-transparent">
        Frequently Asked Questions
      </h1>
      
      <p className="text-gray-600 mb-8">
        Find answers to common questions about PhishShield AI and how it protects you from digital threats.
      </p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">General Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="what-is-phishshield">
              <AccordionTrigger className="text-left">What is PhishShield AI?</AccordionTrigger>
              <AccordionContent>
                PhishShield AI is an advanced cybersecurity application that uses artificial intelligence to detect and prevent phishing attempts across various digital communication channels. It helps protect you from scams, identity theft, and other cyber threats by analyzing messages, emails, and links for suspicious content.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="how-it-works">
              <AccordionTrigger className="text-left">How does PhishShield AI work?</AccordionTrigger>
              <AccordionContent>
                PhishShield AI uses sophisticated machine learning algorithms to analyze digital communications for signs of phishing. When you scan a message or link, our AI examines multiple factors including language patterns, sender information, URL structure, and known threat indicators. It then provides a threat assessment ranging from safe to high-risk, along with specific reasons for the rating.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="which-platforms">
              <AccordionTrigger className="text-left">Which platforms is PhishShield AI available on?</AccordionTrigger>
              <AccordionContent>
                PhishShield AI is available on iOS, Android, and as a web application. This cross-platform approach ensures you're protected on all your devices. The mobile apps offer additional features like real-time scanning of SMS messages and push notifications for immediate threat alerts.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="data-privacy">
              <AccordionTrigger className="text-left">How does PhishShield AI handle my data privacy?</AccordionTrigger>
              <AccordionContent>
                We take privacy seriously. The content you submit for scanning is used only for threat analysis and is never shared with third parties for marketing purposes. Message content is stored securely and only for the duration specified in your subscription plan. You can delete your scan history at any time. For complete details, please review our <Link href="/privacy-policy"><a className="text-primary hover:underline">Privacy Policy</a></Link>.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="message-scanning">
              <AccordionTrigger className="text-left">How do I scan a message for phishing?</AccordionTrigger>
              <AccordionContent>
                To scan a message, navigate to the Scan page in the app, paste the message text into the designated field, and tap the "Scan" button. Our AI will analyze the content and provide a threat assessment with detailed information about any suspicious elements detected.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="url-scanning">
              <AccordionTrigger className="text-left">Can PhishShield AI check if a link is safe?</AccordionTrigger>
              <AccordionContent>
                Yes! On the Scan page, there's a URL scanning option. Enter the suspicious URL and PhishShield AI will analyze it for signs of phishing, malware, or other security risks. The system checks against known malicious websites, analyzes URL patterns, and examines the destination for suspicious content.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="protection-toggle">
              <AccordionTrigger className="text-left">What are the protection toggles on the Dashboard?</AccordionTrigger>
              <AccordionContent>
                The protection toggles allow you to enable or disable different protection features. The basic plan includes SMS and Email protection, while premium plans add Social Media protection. When enabled, these features provide real-time scanning and alerts for incoming messages on those channels.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="ai-assistant">
              <AccordionTrigger className="text-left">What can the AI Assistant help me with?</AccordionTrigger>
              <AccordionContent>
                Our AI Assistant can answer questions about cybersecurity, explain phishing techniques, provide tips on staying safe online, and help you understand how to use PhishShield AI more effectively. It's available to all users and can be accessed from the Account page.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="scan-history">
              <AccordionTrigger className="text-left">Can I review my previous scans?</AccordionTrigger>
              <AccordionContent>
                Yes, the History page maintains a record of all your previous scans. You can filter by threat level to quickly identify past high-risk messages or URLs. Each entry shows the content scanned, the threat assessment, and specific reasons for the rating. The storage duration depends on your subscription plan.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4">Subscription and Billing</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="subscription-plans">
              <AccordionTrigger className="text-left">What subscription plans are available?</AccordionTrigger>
              <AccordionContent>
                PhishShield AI offers three plans:
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li><strong>Basic (Free):</strong> Includes SMS and Email protection, manual scanning, and 7-day history.</li>
                  <li><strong>Premium ($7.99/month):</strong> Adds social media protection, on-device scanning, advanced threat detection, priority support, 30-day history, and real-time alerts.</li>
                  <li><strong>Family ($14.99/month):</strong> Covers up to 5 family members with all Premium features plus family dashboard, parental controls, location sharing, and 90-day history.</li>
                </ul>
                You can view complete plan details on the <Link href="/subscription"><a className="text-primary hover:underline">Subscription</a></Link> page.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="change-plan">
              <AccordionTrigger className="text-left">How do I upgrade, downgrade, or cancel my subscription?</AccordionTrigger>
              <AccordionContent>
                To upgrade your subscription, go to the Subscription page and select your desired plan. To downgrade or cancel, visit the Account page and navigate to the Subscription section, where you'll find options to manage your plan. You can also contact our customer support for assistance with subscription changes.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="payment-methods">
              <AccordionTrigger className="text-left">What payment methods are accepted?</AccordionTrigger>
              <AccordionContent>
                We accept all major credit and debit cards including Visa, Mastercard, American Express, and Discover. Payment processing is handled securely through Stripe, ensuring your payment information is protected.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="refund-policy">
              <AccordionTrigger className="text-left">What is your refund policy?</AccordionTrigger>
              <AccordionContent>
                If you're not satisfied with your premium subscription, you can request a refund within 14 days of purchase. Please contact our customer support team with your account information and reason for the refund request. Refund requests are handled on a case-by-case basis according to our <Link href="/terms-of-service"><a className="text-primary hover:underline">Terms of Service</a></Link>.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4">Technical Support</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="technical-issues">
              <AccordionTrigger className="text-left">I'm experiencing technical issues with the app. What should I do?</AccordionTrigger>
              <AccordionContent>
                For common technical issues, try these steps:
                <ol className="list-decimal ml-6 mt-2 space-y-1">
                  <li>Restart the application</li>
                  <li>Ensure your device has a stable internet connection</li>
                  <li>Update to the latest version of the app</li>
                  <li>Clear the app cache (in your device settings)</li>
                </ol>
                If issues persist, please contact our technical support team with details about your device, operating system, and a description of the problem.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="false-positive">
              <AccordionTrigger className="text-left">The app flagged a legitimate message as suspicious. What should I do?</AccordionTrigger>
              <AccordionContent>
                While our AI is highly accurate, false positives can occasionally occur. If you believe a message was incorrectly flagged, you can report it through the History page by selecting the message and using the "Report False Positive" option. Your feedback helps improve our detection algorithms.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="false-negative">
              <AccordionTrigger className="text-left">I received a phishing message but the app didn't detect it. What should I do?</AccordionTrigger>
              <AccordionContent>
                If you believe you've encountered a phishing attempt that wasn't detected, please report it immediately. You can do this through the History page by selecting the scan and using the "Report Missed Threat" option. Your report will be analyzed by our security team to improve our detection capabilities.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="contact-support">
              <AccordionTrigger className="text-left">How do I contact customer support?</AccordionTrigger>
              <AccordionContent>
                You can contact our customer support team through:
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Email: support@phishshield.ai</li>
                  <li>In-app chat: Available in the Account section</li>
                  <li>The AI Assistant: For quick answers to common questions</li>
                </ul>
                Premium and Family plan subscribers receive priority support with faster response times.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4">Security Best Practices</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="recognize-phishing">
              <AccordionTrigger className="text-left">How can I recognize common phishing attempts?</AccordionTrigger>
              <AccordionContent>
                Common signs of phishing include:
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Urgent requests for personal information</li>
                  <li>Messages with poor grammar or spelling errors</li>
                  <li>Suspicious links or attachments</li>
                  <li>Requests to verify account information</li>
                  <li>Offers that seem too good to be true</li>
                  <li>Messages claiming to be from official organizations but using generic greetings</li>
                </ul>
                PhishShield AI is designed to detect these and many other indicators automatically.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="additional-security">
              <AccordionTrigger className="text-left">What additional security measures should I take besides using PhishShield AI?</AccordionTrigger>
              <AccordionContent>
                While PhishShield AI provides strong protection against phishing, we recommend these additional security measures:
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Use strong, unique passwords for each account</li>
                  <li>Enable two-factor authentication when available</li>
                  <li>Keep your devices and software updated</li>
                  <li>Be cautious about sharing personal information online</li>
                  <li>Regularly back up important data</li>
                  <li>Use a reputable antivirus program</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="phishing-victim">
              <AccordionTrigger className="text-left">What should I do if I've already fallen victim to a phishing attack?</AccordionTrigger>
              <AccordionContent>
                If you believe you've been a victim of phishing:
                <ol className="list-decimal ml-6 mt-2 space-y-1">
                  <li>Change passwords immediately for any affected accounts</li>
                  <li>Contact your financial institutions if financial information was compromised</li>
                  <li>Monitor your accounts for suspicious activity</li>
                  <li>Report the phishing attempt to the appropriate authorities (like the FTC in the US)</li>
                  <li>Consider placing a fraud alert on your credit reports</li>
                </ol>
                Our AI Assistant can also provide guidance specific to your situation.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
      
      <div className="mt-12 p-6 bg-gray-50 rounded-lg text-center">
        <h3 className="font-semibold mb-2">Still have questions?</h3>
        <p className="text-gray-600 mb-4">
          Our customer support team is ready to help with any additional questions you may have.
        </p>
        <Link href="/account">
          <a className="inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
            Contact Support
          </a>
        </Link>
      </div>
    </div>
  );
}