import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";
import { db } from "./db";
import { sql } from "drizzle-orm";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Create database tables (using drizzle push)
    log("Setting up database schema...");
    await db.execute(sql`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )`);
    
    await db.execute(sql`CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      content TEXT NOT NULL,
      sender TEXT,
      scan_date TIMESTAMP DEFAULT NOW() NOT NULL,
      threat_level TEXT NOT NULL,
      threat_details JSONB,
      is_read BOOLEAN DEFAULT FALSE NOT NULL,
      source TEXT
    )`);
    
    await db.execute(sql`CREATE TABLE IF NOT EXISTS protection_settings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      sms_protection BOOLEAN DEFAULT TRUE NOT NULL,
      email_protection BOOLEAN DEFAULT TRUE NOT NULL,
      social_media_protection BOOLEAN DEFAULT FALSE NOT NULL,
      on_device_scanning BOOLEAN DEFAULT FALSE NOT NULL
    )`);
    
    // Seed database with initial data
    log("Seeding database with demo data...");
    await storage.seedDatabase();
    
    log("Database setup complete");
  } catch (error) {
    log(`Database setup error: ${error}`);
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
