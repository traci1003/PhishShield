# PhishShield AI

PhishShield AI is an advanced mobile cybersecurity application designed to proactively detect and prevent phishing attempts across various digital communication channels.

## Features

- **AI-Powered Scanning**: Uses Perplexity API to analyze messages and links for potential threats
- **Multi-Channel Protection**: Supports email, SMS, and social media platforms
- **Real-Time Threat Detection**: Identifies phishing attempts before users click risky links
- **Plugin Architecture**: Flexible system for extending protection to different communication channels
- **Cross-Platform**: Available for iOS, Android, and Web platforms using Capacitor
- **Subscription Tiers**:
  - Basic (Free): Core phishing detection
  - Premium ($7.99/month): Enhanced protection with social media integration
  - Family ($14.99/month): Protection for multiple users

## Technology Stack

- React Native for cross-platform mobile development
- TypeScript for type-safe code
- Capacitor for native mobile integration
- Perplexity API for AI threat detection
- PostgreSQL database for data storage
- Stripe for subscription management
- Accessibility features with high-contrast visualizations

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the application: `npm run dev`

## Environment Variables

The application requires the following environment variables:
- `PERPLEXITY_API_KEY`: API key for AI-powered threat detection
- `STRIPE_SECRET_KEY`: For subscription management
- `VITE_STRIPE_PUBLIC_KEY`: For client-side Stripe integration
- `DATABASE_URL`: PostgreSQL database connection

## License

[MIT License](LICENSE)