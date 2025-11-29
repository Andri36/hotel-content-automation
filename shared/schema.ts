import { pgTable, text, varchar, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Hotel data scraped from sources
export const hotels = pgTable("hotels", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  price: text("price").notNull(),
  currency: text("currency").default("USD"),
  rating: real("rating").notNull(),
  reviewCount: integer("review_count").default(0),
  location: text("location").notNull(),
  address: text("address"),
  thumbnail: text("thumbnail"),
  images: text("images").array(),
  amenities: text("amenities").array(),
  description: text("description"),
  sourceUrl: text("source_url"),
  scrapedAt: timestamp("scraped_at").defaultNow(),
});

// AI-generated articles based on hotel data
export const articles = pgTable("articles", {
  id: varchar("id", { length: 36 }).primaryKey(),
  hotelId: varchar("hotel_id", { length: 36 }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  features: text("features").array(),
  locationAdvantages: text("location_advantages").array(),
  recommendations: text("recommendations").array(),
  generatedImage: text("generated_image"),
  language: text("language").default("id"),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  publishedAt: timestamp("published_at"),
});

// Social media posts tracking
export const socialPosts = pgTable("social_posts", {
  id: varchar("id", { length: 36 }).primaryKey(),
  articleId: varchar("article_id", { length: 36 }).notNull(),
  platform: text("platform").notNull(), // "twitter" | "linkedin"
  postId: text("post_id"),
  postUrl: text("post_url"),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  status: text("status").default("pending"), // "pending" | "posted" | "failed"
  engagement: integer("engagement").default(0),
  errorMessage: text("error_message"),
  postedAt: timestamp("posted_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Scheduler run logs
export const schedulerLogs = pgTable("scheduler_logs", {
  id: varchar("id", { length: 36 }).primaryKey(),
  runType: text("run_type").notNull(), // "scrape" | "generate" | "publish" | "share"
  status: text("status").notNull(), // "started" | "completed" | "failed"
  message: text("message"),
  itemsProcessed: integer("items_processed").default(0),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Chatbot conversations
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id", { length: 36 }).primaryKey(),
  sessionId: varchar("session_id", { length: 36 }).notNull(),
  role: text("role").notNull(), // "user" | "assistant"
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertHotelSchema = createInsertSchema(hotels).omit({ id: true, scrapedAt: true });
export const insertArticleSchema = createInsertSchema(articles).omit({ id: true, createdAt: true });
export const insertSocialPostSchema = createInsertSchema(socialPosts).omit({ id: true, createdAt: true });
export const insertSchedulerLogSchema = createInsertSchema(schedulerLogs).omit({ id: true, startedAt: true });
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true, createdAt: true });

// Types
export type Hotel = typeof hotels.$inferSelect;
export type InsertHotel = z.infer<typeof insertHotelSchema>;

export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;

export type SocialPost = typeof socialPosts.$inferSelect;
export type InsertSocialPost = z.infer<typeof insertSocialPostSchema>;

export type SchedulerLog = typeof schedulerLogs.$inferSelect;
export type InsertSchedulerLog = z.infer<typeof insertSchedulerLogSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

// API Response types for frontend
export type ArticleWithHotel = Article & {
  hotel: Hotel;
  socialPosts: SocialPost[];
};

export type LatestContent = {
  article: ArticleWithHotel | null;
  lastUpdated: string;
  nextUpdate: string;
  schedulerStatus: "running" | "idle" | "error";
};

export type ChatResponse = {
  message: string;
  suggestions?: string[];
};

// Users table (kept for compatibility)
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
