import React from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
        Privacy Policy
      </h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-8">
          Last Updated: April 7, 2025
        </p>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Introduction</h2>
          <p>
            PhishShield AI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website (collectively, the "Service").
          </p>
          <p>
            Please read this Privacy Policy carefully. By using the Service, you agree to the collection and use of information in accordance with this policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Information We Collect</h2>
          <p>We collect several types of information for various purposes to provide and improve our Service to you:</p>
          
          <h3 className="text-lg font-medium mt-6 mb-3">Personal Data</h3>
          <p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to:</p>
          <ul className="list-disc ml-6 mb-4">
            <li>Email address</li>
            <li>Username</li>
            <li>Payment information (for premium subscriptions)</li>
            <li>Device information</li>
          </ul>

          <h3 className="text-lg font-medium mt-6 mb-3">Message Content</h3>
          <p>
            To provide our phishing detection services, we analyze the content of messages that you submit to our Service. This content may include:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li>SMS messages</li>
            <li>Email messages</li>
            <li>URLs and website content</li>
            <li>Social media communications</li>
          </ul>
          <p>
            <strong>Important:</strong> We take your privacy seriously and implement strict security measures to protect the content you submit. Message content is only used for threat analysis and is never shared with third parties for marketing purposes.
          </p>

          <h3 className="text-lg font-medium mt-6 mb-3">Usage Data</h3>
          <p>
            We may also collect information that your browser or device sends whenever you visit our Service or access it through a mobile device ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
          <p>We use the collected data for various purposes:</p>
          <ul className="list-disc ml-6 mb-4">
            <li>To provide and maintain our Service</li>
            <li>To detect and prevent phishing attempts and cybersecurity threats</li>
            <li>To notify you about changes to our Service</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our Service</li>
            <li>To monitor the usage of our Service</li>
            <li>To detect, prevent and address technical issues</li>
            <li>To process payments and manage your subscription (if applicable)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Data Retention</h2>
          <p>
            We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.
          </p>
          <p>
            Message content analyzed for phishing detection is stored for a limited period based on your subscription level:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li>Basic plan: 7 days</li>
            <li>Premium plan: 30 days</li>
            <li>Family plan: 90 days</li>
          </ul>
          <p>
            You can delete your message history at any time through the application.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Data Security</h2>
          <p>
            The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
          </p>
          <p>
            We implement a variety of security measures to maintain the safety of your personal information:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li>All sensitive data is encrypted using industry-standard encryption protocols</li>
            <li>Message content is stored in secure, isolated environments</li>
            <li>We regularly monitor our systems for possible vulnerabilities and attacks</li>
            <li>We employ strict access controls for our personnel</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Service Providers</h2>
          <p>
            We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), provide the Service on our behalf, perform Service-related services, or assist us in analyzing how our Service is used.
          </p>
          <p>
            These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </p>
          <p>
            Our Service Providers include:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li>Payment processors (Stripe)</li>
            <li>Analytics providers</li>
            <li>Cloud infrastructure providers</li>
            <li>Threat intelligence services</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Data Protection Rights</h2>
          <p>
            You have the following data protection rights:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
            <li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
            <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</li>
            <li><strong>The right to restrict processing:</strong> You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
            <li><strong>The right to object to processing:</strong> You have the right to object to our processing of your personal data, under certain conditions.</li>
            <li><strong>The right to data portability:</strong> You have the right to request that we transfer the data we have collected to another organization, or directly to you, under certain conditions.</li>
          </ul>
          <p>
            If you wish to exercise any of these rights, please contact us at privacy@phishshield.ai.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Children's Privacy</h2>
          <p>
            Our Service is not intended for use by children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us so that we can take necessary actions.
          </p>
          <p>
            For the Family Plan, which may involve children, all settings and accounts must be managed by a parent or guardian over the age of 18.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li>By email: privacy@phishshield.ai</li>
            <li>By visiting the contact page on our website: phishshield.ai/contact</li>
          </ul>
        </section>
      </div>
    </div>
  );
}