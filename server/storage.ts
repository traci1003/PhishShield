import { 
  users, type User, type InsertUser,
  messages, type Message, type InsertMessage,
  protectionSettings, type ProtectionSettings, type InsertProtectionSettings,
  deviceTokens, type DeviceToken, type InsertDeviceToken,
  pluginConnections, type PluginConnection, type InsertPluginConnection
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, desc, sql, count } from "drizzle-orm";

// Interface definition for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserByStripeCustomerId(customerId: string): Promise<User[]>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

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
  
  // Device token operations for push notifications
  getDeviceToken(token: string): Promise<DeviceToken | undefined>;
  getDeviceTokensByUser(userId: number): Promise<DeviceToken[]>;
  createDeviceToken(deviceToken: InsertDeviceToken): Promise<DeviceToken>;
  updateDeviceToken(token: string, updates: Partial<DeviceToken>): Promise<DeviceToken | undefined>;
  deleteDeviceToken(token: string): Promise<boolean>;
  
  // Plugin connection operations
  getPluginConnection(userId: number, pluginId: string): Promise<PluginConnection | undefined>;
  getPluginConnectionsByUser(userId: number, type?: string): Promise<PluginConnection[]>;
  createPluginConnection(connection: InsertPluginConnection): Promise<PluginConnection>;
  updatePluginConnection(userId: number, pluginId: string, updates: Partial<PluginConnection>): Promise<PluginConnection | undefined>;
  deletePluginConnection(userId: number, pluginId: string): Promise<boolean>;
  
  // Database setup
  seedDatabase(): Promise<void>;
}

// Database Storage Implementation using Drizzle ORM
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async getUserByStripeCustomerId(customerId: string): Promise<User[]> {
    return await db.select()
      .from(users)
      .where(eq(users.stripeCustomerId, customerId));
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db.update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
      
    return updatedUser;
  }

  // Message methods
  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message;
  }

  async getMessages(userId: number, limit?: number): Promise<Message[]> {
    // Create a base query
    let result = db.select()
      .from(messages)
      .where(eq(messages.userId, userId))
      .orderBy(desc(messages.scanDate));
    
    // If limit is provided, create a new query with the limit
    if (limit !== undefined) {
      return await db.select()
        .from(messages)
        .where(eq(messages.userId, userId))
        .orderBy(desc(messages.scanDate))
        .limit(limit);
    }
    
    return await result;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    // Create a new object with the required fields for insertion
    const insertData = {
      ...message,
      isRead: false,
      // Let PostgreSQL use default if scanDate is not provided
      scanDate: message.scanDate || undefined 
    };
    
    const [newMessage] = await db.insert(messages)
      .values(insertData)
      .returning();
      
    return newMessage;
  }

  async updateMessage(id: number, updates: Partial<Message>): Promise<Message | undefined> {
    const [updatedMessage] = await db.update(messages)
      .set(updates)
      .where(eq(messages.id, id))
      .returning();
      
    return updatedMessage;
  }

  async deleteMessage(id: number): Promise<boolean> {
    const result = await db.delete(messages).where(eq(messages.id, id)).returning();
    return result.length > 0;
  }

  async getMessagesByThreatLevel(userId: number, threatLevel: string): Promise<Message[]> {
    return await db.select()
      .from(messages)
      .where(and(
        eq(messages.userId, userId),
        eq(messages.threatLevel, threatLevel)
      ))
      .orderBy(desc(messages.scanDate));
  }

  async getMessageStats(userId: number, days = 30): Promise<{ safe: number, suspicious: number, phishing: number }> {
    const now = new Date();
    const pastDate = new Date(now);
    pastDate.setDate(pastDate.getDate() - days);
    
    // Query for safe messages count
    const [safeResult] = await db.select({ 
      count: count() 
    })
    .from(messages)
    .where(and(
      eq(messages.userId, userId),
      eq(messages.threatLevel, "safe"),
      gte(messages.scanDate, pastDate)
    ));
    
    // Query for suspicious messages count
    const [suspiciousResult] = await db.select({ 
      count: count() 
    })
    .from(messages)
    .where(and(
      eq(messages.userId, userId),
      eq(messages.threatLevel, "suspicious"),
      gte(messages.scanDate, pastDate)
    ));
    
    // Query for phishing messages count
    const [phishingResult] = await db.select({ 
      count: count() 
    })
    .from(messages)
    .where(and(
      eq(messages.userId, userId),
      eq(messages.threatLevel, "phishing"),
      gte(messages.scanDate, pastDate)
    ));
    
    return {
      safe: Number(safeResult?.count || 0),
      suspicious: Number(suspiciousResult?.count || 0),
      phishing: Number(phishingResult?.count || 0)
    };
  }

  // Protection settings methods
  async getProtectionSettings(userId: number): Promise<ProtectionSettings | undefined> {
    const [settings] = await db.select()
      .from(protectionSettings)
      .where(eq(protectionSettings.userId, userId));
      
    return settings;
  }

  async createProtectionSettings(settings: InsertProtectionSettings): Promise<ProtectionSettings> {
    const [newSettings] = await db.insert(protectionSettings)
      .values(settings)
      .returning();
      
    return newSettings;
  }

  async updateProtectionSettings(userId: number, updates: Partial<ProtectionSettings>): Promise<ProtectionSettings | undefined> {
    const [updatedSettings] = await db.update(protectionSettings)
      .set(updates)
      .where(eq(protectionSettings.userId, userId))
      .returning();
      
    return updatedSettings;
  }
  
  // Device token methods for push notifications
  async getDeviceToken(token: string): Promise<DeviceToken | undefined> {
    const [deviceToken] = await db.select()
      .from(deviceTokens)
      .where(eq(deviceTokens.token, token));
      
    return deviceToken;
  }
  
  async getDeviceTokensByUser(userId: number): Promise<DeviceToken[]> {
    return await db.select()
      .from(deviceTokens)
      .where(eq(deviceTokens.userId, userId));
  }
  
  async createDeviceToken(deviceToken: InsertDeviceToken): Promise<DeviceToken> {
    // Check if token already exists
    const existingToken = await this.getDeviceToken(deviceToken.token);
    
    if (existingToken) {
      // If token exists but for a different user, update it
      if (existingToken.userId !== deviceToken.userId) {
        const [updatedToken] = await db.update(deviceTokens)
          .set({
            userId: deviceToken.userId,
            lastActive: new Date()
          })
          .where(eq(deviceTokens.token, deviceToken.token))
          .returning();
          
        return updatedToken;
      }
      
      // If token exists for the same user, just update lastActive
      const [updatedToken] = await db.update(deviceTokens)
        .set({ lastActive: new Date() })
        .where(eq(deviceTokens.token, deviceToken.token))
        .returning();
        
      return updatedToken;
    }
    
    // Create new token
    const [newToken] = await db.insert(deviceTokens)
      .values(deviceToken)
      .returning();
      
    return newToken;
  }
  
  async updateDeviceToken(token: string, updates: Partial<DeviceToken>): Promise<DeviceToken | undefined> {
    const [updatedToken] = await db.update(deviceTokens)
      .set(updates)
      .where(eq(deviceTokens.token, token))
      .returning();
      
    return updatedToken;
  }
  
  async deleteDeviceToken(token: string): Promise<boolean> {
    const result = await db.delete(deviceTokens)
      .where(eq(deviceTokens.token, token))
      .returning();
      
    return result.length > 0;
  }
  
  // Plugin connection methods
  async getPluginConnection(userId: number, pluginId: string): Promise<PluginConnection | undefined> {
    const [connection] = await db.select()
      .from(pluginConnections)
      .where(sql`${pluginConnections.userId} = ${userId} AND ${pluginConnections.pluginId} = ${pluginId}`);
      
    return connection;
  }
  
  async getPluginConnectionsByUser(userId: number, type?: string): Promise<PluginConnection[]> {
    if (type) {
      // If type is provided, filter by type
      return await db
        .select()
        .from(pluginConnections)
        .where(sql`${pluginConnections.userId} = ${userId} AND ${pluginConnections.type} = ${type}`);
    } else {
      // Otherwise just filter by userId
      return await db
        .select()
        .from(pluginConnections)
        .where(sql`${pluginConnections.userId} = ${userId}`);
    }
  }
  
  async createPluginConnection(connection: InsertPluginConnection): Promise<PluginConnection> {
    // Make sure userId is a number (not null)
    const userId = connection.userId || 0;
    
    // Check if connection already exists
    const existingConnection = await this.getPluginConnection(userId, connection.pluginId);
    
    if (existingConnection) {
      // If connection exists, update it
      const [updatedConnection] = await db.update(pluginConnections)
        .set({
          isConnected: connection.isConnected,
          isProtectionEnabled: connection.isProtectionEnabled,
          authData: connection.authData,
          lastUpdated: new Date()
        })
        .where(sql`${pluginConnections.userId} = ${userId} AND ${pluginConnections.pluginId} = ${connection.pluginId}`)
        .returning();
        
      return updatedConnection;
    }
    
    // Create new connection
    const [newConnection] = await db.insert(pluginConnections)
      .values({
        ...connection,
        userId,
        lastUpdated: new Date()
      })
      .returning();
      
    return newConnection;
  }
  
  async updatePluginConnection(userId: number, pluginId: string, updates: Partial<PluginConnection>): Promise<PluginConnection | undefined> {
    const [updatedConnection] = await db.update(pluginConnections)
      .set({
        ...updates,
        lastUpdated: new Date()
      })
      .where(sql`${pluginConnections.userId} = ${userId} AND ${pluginConnections.pluginId} = ${pluginId}`)
      .returning();
      
    return updatedConnection;
  }
  
  async deletePluginConnection(userId: number, pluginId: string): Promise<boolean> {
    const result = await db.delete(pluginConnections)
      .where(sql`${pluginConnections.userId} = ${userId} AND ${pluginConnections.pluginId} = ${pluginId}`)
      .returning();
      
    return result.length > 0;
  }
  
  // Seed the database with demo data
  async seedDatabase(): Promise<void> {
    // Check if we already have a demo user
    const existingUser = await this.getUserByUsername("demo");
    
    if (!existingUser) {
      // Create demo user
      const user = await this.createUser({ username: "demo", password: "demo" });
      
      // Create protection settings for demo user
      await this.createProtectionSettings({
        userId: user.id,
        smsProtection: true,
        emailProtection: true,
        socialMediaProtection: false,
        onDeviceScanning: false
      });
      
      // Add sample phishing message
      await this.createMessage({
        userId: user.id,
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
      
      // Add sample suspicious message
      await this.createMessage({
        userId: user.id,
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
      
      // Add sample safe messages
      for (let i = 0; i < 5; i++) {
        await this.createMessage({
          userId: user.id,
          content: `This is a safe message ${i}`,
          sender: "Safe Sender",
          threatLevel: "safe",
          threatDetails: null,
          source: "email"
        });
      }
      
      console.log("Database seeded with demo data");
    } else {
      console.log("Database already contains demo data");
    }
  }
}

// Export storage instance
export const storage = new DatabaseStorage();
