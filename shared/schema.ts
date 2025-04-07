import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Perplexity API models
export const PERPLEXITY_MODELS = {
  SMALL: "llama-3.1-sonar-small-128k-online",
  LARGE: "llama-3.1-sonar-large-128k-online",
  HUGE: "llama-3.1-sonar-huge-128k-online"
};

// Plugin types
export const PLUGIN_TYPES = {
  SMS: "sms",
  EMAIL: "email",
  SOCIAL: "social",
  SLACK: "slack"
} as const;

// Device token schema for push notifications
export const deviceTokens = pgTable("device_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  token: text("token").notNull().unique(),
  platform: text("platform").notNull(), // "ios", "android"
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastActive: timestamp("last_active").notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status").default("inactive"),
  plan: text("plan").default("basic"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Schema for scanned messages
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  sender: text("sender"),
  scanDate: timestamp("scan_date").notNull().defaultNow(),
  threatLevel: text("threat_level").notNull(), // "safe", "suspicious", "phishing"
  threatDetails: jsonb("threat_details"), // Details about detected threats
  isRead: boolean("is_read").notNull().default(false),
  source: text("source"), // "sms", "email", "social", "manual"
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  userId: true,
  content: true,
  sender: true,
  threatLevel: true,
  threatDetails: true,
  source: true,
  scanDate: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Schema for protection settings
export const protectionSettings = pgTable("protection_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  smsProtection: boolean("sms_protection").notNull().default(true),
  emailProtection: boolean("email_protection").notNull().default(true),
  socialMediaProtection: boolean("social_media_protection").notNull().default(false),
  onDeviceScanning: boolean("on_device_scanning").notNull().default(false),
});

export const insertProtectionSettingsSchema = createInsertSchema(protectionSettings).pick({
  userId: true,
  smsProtection: true,
  emailProtection: true,
  socialMediaProtection: true,
  onDeviceScanning: true,
});

export type InsertProtectionSettings = z.infer<typeof insertProtectionSettingsSchema>;
export type ProtectionSettings = typeof protectionSettings.$inferSelect;

// Schema for scanning text for phishing
export const scanTextSchema = z.object({
  content: z.string().min(1, "Message content is required"),
  sender: z.string().optional(),
  source: z.enum(["sms", "email", "social", "manual"]).optional().default("manual"),
});

export type ScanTextRequest = z.infer<typeof scanTextSchema>;

// Schema for scanning URL for threats
export const scanUrlSchema = z.object({
  url: z.string().url("Invalid URL format"),
});

export type ScanUrlRequest = z.infer<typeof scanUrlSchema>;

// Schema for virtual assistant chat
export const chatMessageSchema = z.object({
  query: z.string().min(1, "Question is required").max(500, "Question is too long"),
});

export type ChatMessageRequest = z.infer<typeof chatMessageSchema>;

export interface ChatResponse {
  answer: string;
  timestamp: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Schema for device tokens
export const insertDeviceTokenSchema = createInsertSchema(deviceTokens).pick({
  userId: true,
  token: true,
  platform: true,
});

export type InsertDeviceToken = z.infer<typeof insertDeviceTokenSchema>;
export type DeviceToken = typeof deviceTokens.$inferSelect;

// Schema for device token registration
export const deviceTokenSchema = z.object({
  token: z.string().min(1, "Device token is required"),
  platform: z.enum(["ios", "android"]),
});

export type DeviceTokenRequest = z.infer<typeof deviceTokenSchema>;

// Schema for contact form
export const contactFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }).max(1000, { message: "Message must be less than 1000 characters" }),
});

export type ContactFormRequest = z.infer<typeof contactFormSchema>;

// Threat Intelligence Types
export interface ThreatData {
  domainInfo?: {
    domain: string;
    reputationScore: number;
    malicious: boolean;
    suspicious: boolean;
    categories: string[];
    reportedTimes: number;
    sources: string[];
    lastChecked: string;
  };
  senderInfo?: {
    email: string;
    domain: string;
    reputationScore: number;
    hasDmarc: boolean;
    hasSpf: boolean;
    hasDkim: boolean;
    securityLevel: string;
    creationDate: string | null;
  };
}

export interface EnhancedAnalysisResult {
  threatLevel: string;
  reasons: string[];
  content: string;
  threatData?: ThreatData;
}

// Enhanced scan request schemas
export const enhancedScanTextSchema = scanTextSchema.extend({
  enhancedAnalysis: z.boolean().optional().default(false),
});

export type EnhancedScanTextRequest = z.infer<typeof enhancedScanTextSchema>;

export const enhancedScanUrlSchema = scanUrlSchema.extend({
  enhancedAnalysis: z.boolean().optional().default(false),
  saveToHistory: z.boolean().optional().default(false),
  source: z.enum(["sms", "email", "social", "manual"]).optional().default("manual"),
});

export type EnhancedScanUrlRequest = z.infer<typeof enhancedScanUrlSchema>;

// Plugin connection schemas
export const pluginConnections = pgTable("plugin_connections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  pluginId: text("plugin_id").notNull(), // e.g., 'slack', 'email', 'sms'
  type: text("type").notNull(), // 'sms', 'email', 'social'
  isConnected: boolean("is_connected").notNull().default(false),
  isProtectionEnabled: boolean("is_protection_enabled").notNull().default(false),
  authData: jsonb("auth_data"), // Store tokens and other auth data
  settings: jsonb("settings"), // Additional settings for this plugin
  isEnabled: boolean("is_enabled").notNull().default(false), // Whether the plugin is enabled
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const insertPluginConnectionSchema = createInsertSchema(pluginConnections).pick({
  userId: true,
  pluginId: true,
  type: true,
  isConnected: true,
  isProtectionEnabled: true,
  isEnabled: true,
  authData: true,
  settings: true,
});

export type InsertPluginConnection = z.infer<typeof insertPluginConnectionSchema>;
export type PluginConnection = typeof pluginConnections.$inferSelect;

// Plugin message schemas
export interface PluginMessage {
  externalId: string;
  content: string;
  sender: {
    id?: string;
    name: string;
    handle?: string;
  };
  timestamp: string;
  metadata?: Record<string, any>;
  urls?: string[];
}

// Plugin status schemas
export const pluginStatusSchema = z.object({
  connected: z.boolean(),
  enabled: z.boolean(),
  available: z.boolean(),
  requiresAuth: z.boolean(),
  authUrl: z.string().optional(),
  userId: z.number().optional(),
});

export type PluginStatus = z.infer<typeof pluginStatusSchema>;
