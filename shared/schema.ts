import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
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
