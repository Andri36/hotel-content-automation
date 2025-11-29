import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { scheduler } from "./services/scheduler";
import { contentGenerator } from "./services/contentGenerator";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Get latest content for the app
  app.get("/api/content/latest", async (req, res) => {
    try {
      const content = await storage.getLatestContent();
      res.json(content);
    } catch (error) {
      console.error("[API] Error fetching latest content:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  // Get all articles
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getAllArticles();
      res.json(articles);
    } catch (error) {
      console.error("[API] Error fetching articles:", error);
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  // Get specific article with hotel data
  app.get("/api/articles/:id", async (req, res) => {
    try {
      const article = await storage.getArticleWithHotel(req.params.id);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("[API] Error fetching article:", error);
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  // Get all hotels
  app.get("/api/hotels", async (req, res) => {
    try {
      const hotels = await storage.getAllHotels();
      res.json(hotels);
    } catch (error) {
      console.error("[API] Error fetching hotels:", error);
      res.status(500).json({ error: "Failed to fetch hotels" });
    }
  });

  // Get specific hotel
  app.get("/api/hotels/:id", async (req, res) => {
    try {
      const hotel = await storage.getHotel(req.params.id);
      if (!hotel) {
        return res.status(404).json({ error: "Hotel not found" });
      }
      res.json(hotel);
    } catch (error) {
      console.error("[API] Error fetching hotel:", error);
      res.status(500).json({ error: "Failed to fetch hotel" });
    }
  });

  // Chat endpoint
  const chatSchema = z.object({
    message: z.string().min(1).max(1000),
    sessionId: z.string().optional(),
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId } = chatSchema.parse(req.body);
      
      // Get latest article for context
      const latestContent = await storage.getLatestContent();
      const hotelContext = latestContent.article?.hotel || null;

      // Generate response
      const response = await contentGenerator.generateChatResponse(message, hotelContext);

      // Save chat messages if sessionId provided
      if (sessionId) {
        await storage.createChatMessage({
          sessionId,
          role: "user",
          content: message,
        });
        await storage.createChatMessage({
          sessionId,
          role: "assistant",
          content: response,
        });
      }

      res.json({ 
        message: response,
        suggestions: [
          "Apa saja fasilitas hotel ini?",
          "Bagaimana rating hotel?",
          "Berapa harga per malam?"
        ]
      });
    } catch (error) {
      console.error("[API] Error in chat:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request", details: error.errors });
      }
      res.status(500).json({ error: "Failed to process chat" });
    }
  });

  // Scheduler endpoints
  app.get("/api/scheduler/status", async (req, res) => {
    try {
      const status = scheduler.getStatus();
      res.json(status);
    } catch (error) {
      console.error("[API] Error fetching scheduler status:", error);
      res.status(500).json({ error: "Failed to fetch scheduler status" });
    }
  });

  // Trigger manual workflow run (for testing)
  app.post("/api/scheduler/trigger", async (req, res) => {
    try {
      // Run asynchronously
      scheduler.triggerRun().catch(err => {
        console.error("[API] Trigger workflow failed:", err);
      });
      res.json({ message: "Workflow triggered", status: "started" });
    } catch (error) {
      console.error("[API] Error triggering scheduler:", error);
      res.status(500).json({ error: "Failed to trigger scheduler" });
    }
  });

  // Get scheduler logs
  app.get("/api/scheduler/logs", async (req, res) => {
    try {
      const runType = req.query.type as string | undefined;
      if (runType) {
        const log = await storage.getLatestSchedulerLog(runType);
        res.json(log || null);
      } else {
        // Return all latest logs for each type
        const types = ["scrape", "generate", "publish", "share"];
        const logs = await Promise.all(
          types.map(async (type) => ({
            type,
            log: await storage.getLatestSchedulerLog(type),
          }))
        );
        res.json(logs.filter(l => l.log));
      }
    } catch (error) {
      console.error("[API] Error fetching scheduler logs:", error);
      res.status(500).json({ error: "Failed to fetch logs" });
    }
  });

  // Social posts for an article
  app.get("/api/articles/:id/social-posts", async (req, res) => {
    try {
      const posts = await storage.getSocialPostsByArticle(req.params.id);
      res.json(posts);
    } catch (error) {
      console.error("[API] Error fetching social posts:", error);
      res.status(500).json({ error: "Failed to fetch social posts" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      scheduler: scheduler.getStatus()
    });
  });

  // Start the scheduler when server starts
  scheduler.start();

  return httpServer;
}
