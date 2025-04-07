import { 
  users, type User, type InsertUser,
  messages, type Message, type InsertMessage,
  protectionSettings, type ProtectionSettings, type InsertProtectionSettings
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Message operations
  getMessage(id: number): Promise<Message | undefined>;
  getMessages(userId: number, limit?: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessage(id: number, updates: Partial<Message>): Promise<Message | undefined>;
  deleteMessage(id: number): Promise<boolean>;
  getMessagesByThreatLevel(userId: number, threatLevel: string): Promise<Message[]>;
  getMessageStats(userId: number, days?: number): Promise<{ safe: number, suspicious: number, phishing: number }>;

  // Protection settings operations
  getProtectionSettings(userId: number): Promise<ProtectionSettings | undefined>;
  createProtectionSettings(settings: InsertProtectionSettings): Promise<ProtectionSettings>;
  updateProtectionSettings(userId: number, updates: Partial<ProtectionSettings>): Promise<ProtectionSettings | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private messages: Map<number, Message>;
  private protectionSettings: Map<number, ProtectionSettings>;
  userCurrentId: number;
  messageCurrentId: number;
  protectionSettingsCurrentId: number;

  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.protectionSettings = new Map();
    this.userCurrentId = 1;
    this.messageCurrentId = 1;
    this.protectionSettingsCurrentId = 1;

    // Create a demo user for quick testing
    this.createUser({ username: "demo", password: "demo" });
    
    // Create default protection settings for demo user
    this.createProtectionSettings({
      userId: 1,
      smsProtection: true,
      emailProtection: true,
      socialMediaProtection: false,
      onDeviceScanning: false
    });

    // Add some sample messages for the demo user
    this.createMessage({
      userId: 1,
      content: "URGENT: Your account has been compromised. Click here to verify your information and secure your account: http://amaz0n-secure.com/verify",
      sender: "Unknown Sender",
      threatLevel: "phishing",
      threatDetails: {
        reasons: [
          "Urgency language detected",
          "Suspicious URL detected",
          "Brand impersonation"
        ]
      },
      source: "sms"
    });

    this.createMessage({
      userId: 1,
      content: "You've won a $100 gift card! Claim your reward within 24hrs: bit.ly/gft-crd-123",
      sender: "SMS Short Code",
      threatLevel: "suspicious",
      threatDetails: {
        reasons: [
          "Reward scam patterns detected",
          "Artificial time pressure"
        ]
      },
      source: "sms"
    });

    // Add a few safe messages for stats
    for (let i = 0; i < 5; i++) {
      this.createMessage({
        userId: 1,
        content: `This is a safe message ${i}`,
        sender: "Safe Sender",
        threatLevel: "safe",
        threatDetails: null,
        source: "email"
      });
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Message methods
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessages(userId: number, limit?: number): Promise<Message[]> {
    const userMessages = Array.from(this.messages.values())
      .filter(msg => msg.userId === userId)
      .sort((a, b) => {
        // Sort by date, newest first
        const dateA = new Date(a.scanDate).getTime();
        const dateB = new Date(b.scanDate).getTime();
        return dateB - dateA;
      });
    
    return limit ? userMessages.slice(0, limit) : userMessages;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.messageCurrentId++;
    const newMessage: Message = { 
      ...message, 
      id, 
      scanDate: message.scanDate || new Date(),
      isRead: false
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async updateMessage(id: number, updates: Partial<Message>): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, ...updates };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }

  async deleteMessage(id: number): Promise<boolean> {
    return this.messages.delete(id);
  }

  async getMessagesByThreatLevel(userId: number, threatLevel: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(msg => msg.userId === userId && msg.threatLevel === threatLevel)
      .sort((a, b) => {
        // Sort by date, newest first
        const dateA = new Date(a.scanDate).getTime();
        const dateB = new Date(b.scanDate).getTime();
        return dateB - dateA;
      });
  }

  async getMessageStats(userId: number, days = 30): Promise<{ safe: number, suspicious: number, phishing: number }> {
    const now = new Date();
    const pastDate = new Date(now);
    pastDate.setDate(pastDate.getDate() - days);
    
    const userMessages = Array.from(this.messages.values())
      .filter(msg => {
        return msg.userId === userId && new Date(msg.scanDate) >= pastDate;
      });
    
    return {
      safe: userMessages.filter(msg => msg.threatLevel === "safe").length,
      suspicious: userMessages.filter(msg => msg.threatLevel === "suspicious").length,
      phishing: userMessages.filter(msg => msg.threatLevel === "phishing").length
    };
  }

  // Protection settings methods
  async getProtectionSettings(userId: number): Promise<ProtectionSettings | undefined> {
    return Array.from(this.protectionSettings.values())
      .find(settings => settings.userId === userId);
  }

  async createProtectionSettings(settings: InsertProtectionSettings): Promise<ProtectionSettings> {
    const id = this.protectionSettingsCurrentId++;
    const newSettings: ProtectionSettings = { ...settings, id };
    this.protectionSettings.set(id, newSettings);
    return newSettings;
  }

  async updateProtectionSettings(userId: number, updates: Partial<ProtectionSettings>): Promise<ProtectionSettings | undefined> {
    const settings = Array.from(this.protectionSettings.values())
      .find(settings => settings.userId === userId);
    
    if (!settings) return undefined;
    
    const updatedSettings = { ...settings, ...updates };
    this.protectionSettings.set(settings.id, updatedSettings);
    return updatedSettings;
  }
}

export const storage = new MemStorage();
