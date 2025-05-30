import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";
import { db } from "./db";
import { sql } from "drizzle-orm";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add a simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

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
    
    await db.execute(sql`CREATE TABLE IF NOT EXISTS plugin_connections (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      plugin_id TEXT NOT NULL,
      enabled BOOLEAN DEFAULT FALSE NOT NULL,
      auth_data JSONB,
      config_data JSONB,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
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

  // Get port from environment or use 5000 as default
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  
  // Add a health check endpoint that will be used to verify the server is running
  app.get('/healthz', (req, res) => {
    res.status(200).send('OK');
  });
  
  console.log(`Attempting to listen on port ${port}...`);
  
  // Start the server
  try {
    // Create server without options first
    const serverInstance = server.listen(port, "0.0.0.0", () => {
      // Very explicit logging to ensure port detection
      console.log(`Server is running on port ${port}`);
      console.log(`PORT_OPENED=${port}`);
      log(`Server successfully started and serving on port ${port}`);
      
      // Print out the URL for easier access
      console.log(`Server URL: http://localhost:${port}`);
      
      // Signal that the server is ready
      if (process.send) {
        process.send('ready');
      }
    });
    
    // More robust error handling
    serverInstance.on('error', (error: any) => {
      console.error('Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Try using a different port.`);
        process.exit(1);
      }
    });
    
    // Add graceful shutdown handling
    const shutdown = () => {
      log('Shutdown signal received, closing server gracefully');
      serverInstance.close(() => {
        log('Server closed');
        process.exit(0);
      });
      
      // Force close after 10 seconds if graceful shutdown fails
      setTimeout(() => {
        log('Forcing server shutdown after timeout');
        process.exit(1);
      }, 10000);
    };
    
    // Handle various shutdown signals
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
    process.on('SIGHUP', shutdown);
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
})();
