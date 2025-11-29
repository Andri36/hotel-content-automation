import { storage } from "../storage";
import { scraper } from "./scraper";
import { contentGenerator } from "./contentGenerator";
import { socialPoster } from "./socialPoster";
import type { Hotel, Article } from "@shared/schema";

export class AutomationScheduler {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;
  private intervalMs = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  async runFullWorkflow(): Promise<void> {
    if (this.isRunning) {
      console.log("[Scheduler] Workflow already running, skipping...");
      return;
    }

    this.isRunning = true;
    console.log("[Scheduler] Starting full automation workflow...");

    try {
      // Step 1: Scrape hotel data
      await this.scrapeHotels();

      // Step 2: Generate content
      await this.generateContent();

      // Step 3: Publish to app
      await this.publishContent();

      // Step 4: Share to social media
      await this.shareToSocialMedia();

      console.log("[Scheduler] Full workflow completed successfully!");
    } catch (error) {
      console.error("[Scheduler] Workflow failed:", error);
    } finally {
      this.isRunning = false;
    }
  }

  private async scrapeHotels(): Promise<Hotel[]> {
    const log = await storage.createSchedulerLog({
      runType: "scrape",
      status: "started",
      message: "Starting hotel data scraping",
    });

    try {
      const hotelData = await scraper.scrapeHotels(1);
      const hotels: Hotel[] = [];

      for (const data of hotelData) {
        const hotel = await storage.createHotel(data);
        hotels.push(hotel);
      }

      await storage.updateSchedulerLog(log.id, {
        status: "completed",
        itemsProcessed: hotels.length,
        completedAt: new Date(),
        message: `Successfully scraped ${hotels.length} hotel(s)`,
      });

      console.log(`[Scheduler] Scraped ${hotels.length} hotel(s)`);
      return hotels;
    } catch (error) {
      await storage.updateSchedulerLog(log.id, {
        status: "failed",
        completedAt: new Date(),
        message: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }

  private async generateContent(): Promise<Article[]> {
    const log = await storage.createSchedulerLog({
      runType: "generate",
      status: "started",
      message: "Starting AI content generation",
    });

    try {
      const hotels = await storage.getAllHotels();
      const articles: Article[] = [];

      // Get hotels without articles
      const existingArticles = await storage.getAllArticles();
      const hotelIdsWithArticles = new Set(existingArticles.map(a => a.hotelId));
      
      const hotelsToProcess = hotels.filter(h => !hotelIdsWithArticles.has(h.id));

      for (const hotel of hotelsToProcess.slice(0, 1)) { // Process 1 at a time
        const articleData = await contentGenerator.generateArticle(hotel, "id");
        const article = await storage.createArticle(articleData);
        articles.push(article);
      }

      await storage.updateSchedulerLog(log.id, {
        status: "completed",
        itemsProcessed: articles.length,
        completedAt: new Date(),
        message: `Successfully generated ${articles.length} article(s)`,
      });

      console.log(`[Scheduler] Generated ${articles.length} article(s)`);
      return articles;
    } catch (error) {
      await storage.updateSchedulerLog(log.id, {
        status: "failed",
        completedAt: new Date(),
        message: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }

  private async publishContent(): Promise<Article[]> {
    const log = await storage.createSchedulerLog({
      runType: "publish",
      status: "started",
      message: "Publishing articles to app",
    });

    try {
      const allArticles = await storage.getAllArticles();
      const unpublished = allArticles.filter(a => !a.isPublished);
      const published: Article[] = [];

      for (const article of unpublished) {
        const publishedArticle = await storage.publishArticle(article.id);
        if (publishedArticle) {
          published.push(publishedArticle);
        }
      }

      await storage.updateSchedulerLog(log.id, {
        status: "completed",
        itemsProcessed: published.length,
        completedAt: new Date(),
        message: `Successfully published ${published.length} article(s)`,
      });

      console.log(`[Scheduler] Published ${published.length} article(s)`);
      return published;
    } catch (error) {
      await storage.updateSchedulerLog(log.id, {
        status: "failed",
        completedAt: new Date(),
        message: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }

  private async shareToSocialMedia(): Promise<void> {
    const log = await storage.createSchedulerLog({
      runType: "share",
      status: "started",
      message: "Sharing to social media platforms",
    });

    try {
      const latestArticle = await storage.getLatestArticle();
      if (!latestArticle) {
        await storage.updateSchedulerLog(log.id, {
          status: "completed",
          itemsProcessed: 0,
          completedAt: new Date(),
          message: "No articles to share",
        });
        return;
      }

      const existingPosts = await storage.getSocialPostsByArticle(latestArticle.id);
      const platforms = ["twitter", "linkedin"] as const;
      let postsCreated = 0;

      for (const platform of platforms) {
        // Check if already posted
        if (existingPosts.some(p => p.platform === platform)) {
          continue;
        }

        // Create post data
        const postData = socialPoster.createSocialPostData(
          latestArticle.id,
          platform,
          latestArticle,
          latestArticle.hotel
        );

        const post = await storage.createSocialPost(postData);

        // Attempt to post
        const result = platform === "twitter"
          ? await socialPoster.postToTwitter(latestArticle, latestArticle.hotel)
          : await socialPoster.postToLinkedIn(latestArticle, latestArticle.hotel);

        if (result.success) {
          await storage.updateSocialPost(post.id, {
            status: "posted",
            postId: result.postId,
            postUrl: result.postUrl,
            postedAt: new Date(),
          });
          postsCreated++;
        } else {
          await storage.updateSocialPost(post.id, {
            status: "failed",
            errorMessage: result.error,
          });
        }
      }

      await storage.updateSchedulerLog(log.id, {
        status: "completed",
        itemsProcessed: postsCreated,
        completedAt: new Date(),
        message: `Successfully shared to ${postsCreated} platform(s)`,
      });

      console.log(`[Scheduler] Shared to ${postsCreated} social platform(s)`);
    } catch (error) {
      await storage.updateSchedulerLog(log.id, {
        status: "failed",
        completedAt: new Date(),
        message: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }

  start(): void {
    if (this.intervalId) {
      console.log("[Scheduler] Already running");
      return;
    }

    console.log("[Scheduler] Starting automation scheduler (every 2 hours)");
    
    // Run immediately on start
    this.runFullWorkflow();

    // Then run every 2 hours
    this.intervalId = setInterval(() => {
      this.runFullWorkflow();
    }, this.intervalMs);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("[Scheduler] Stopped automation scheduler");
    }
  }

  // Trigger manual run
  async triggerRun(): Promise<void> {
    await this.runFullWorkflow();
  }

  getStatus(): { isRunning: boolean; nextRun: Date | null } {
    return {
      isRunning: this.isRunning,
      nextRun: this.intervalId ? new Date(Date.now() + this.intervalMs) : null,
    };
  }
}

export const scheduler = new AutomationScheduler();
