import { MailService } from '@sendgrid/mail';
import type { MailDataRequired } from '@sendgrid/mail';

// Initialize SendGrid service
const mailService = new MailService();

// Only set API key if it exists in environment variables and has the correct format
if (process.env.SENDGRID_API_KEY) {
  // Check if the API key has the correct format (starts with SG.)
  if (!process.env.SENDGRID_API_KEY.startsWith('SG.')) {
    console.error('API key does not start with "SG.". Please provide a valid SendGrid API key.');
  } else {
    mailService.setApiKey(process.env.SENDGRID_API_KEY as string);
    console.log('SendGrid API key configured successfully');
  }
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export class EmailService {
  /**
   * Send an email using SendGrid
   */
  async sendEmail(params: EmailParams): Promise<boolean> {
    try {
      // Check if SendGrid API key is available and properly formatted
      if (!process.env.SENDGRID_API_KEY) {
        console.error('SendGrid API key not found in environment variables');
        return false;
      }
      
      // Validate the API key format
      if (!process.env.SENDGRID_API_KEY.startsWith('SG.')) {
        console.error('Invalid SendGrid API key format. Must start with "SG."');
        return false;
      }

      // Create email data according to SendGrid's required format
      const msg: MailDataRequired = {
        to: params.to,
        from: params.from,
        subject: params.subject,
        content: [
          {
            type: params.html ? 'text/html' : 'text/plain',
            value: params.html || params.text || ''
          }
        ]
      };
      
      await mailService.send(msg);
      console.log(`Email sent successfully to ${params.to}`);
      
      return true;
    } catch (error) {
      console.error('SendGrid email error:', error);
      return false;
    }
  }

  /**
   * Send a support email
   */
  async sendSupportEmail(
    name: string,
    email: string,
    subject: string,
    message: string
  ): Promise<boolean> {
    const supportEmail = 'support@phishshield.example.com'; // Replace with actual support email
    
    // Email to support team
    const supportEmailParams: EmailParams = {
      to: supportEmail,
      from: supportEmail, // This should be a verified sender in SendGrid
      subject: `Support Request: ${subject}`,
      html: `
        <h2>New Support Request</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h3>Message:</h3>
        <p>${message}</p>
      `,
    };
    
    // Confirmation email to user
    const userConfirmationParams: EmailParams = {
      to: email,
      from: supportEmail, // This should be a verified sender in SendGrid
      subject: 'We received your support request - PhishShield AI',
      html: `
        <h2>Thank you for contacting PhishShield AI Support</h2>
        <p>Dear ${name},</p>
        <p>We have received your support request with the subject: <strong>${subject}</strong></p>
        <p>Our team will review your inquiry and respond as soon as possible. Your request has been assigned a tracking number.</p>
        <p>For reference, here is a copy of your message:</p>
        <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${message}
        </p>
        <p>Thank you for using PhishShield AI.</p>
        <p>Best regards,<br>The PhishShield AI Team</p>
      `,
    };
    
    // Send both emails
    try {
      const supportEmailSent = await this.sendEmail(supportEmailParams);
      const confirmationEmailSent = await this.sendEmail(userConfirmationParams);
      
      return supportEmailSent && confirmationEmailSent;
    } catch (error) {
      console.error('Error sending support emails:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();