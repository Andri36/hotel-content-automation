import { 
  type User, type InsertUser,
  type Hotel, type InsertHotel,
  type Article, type InsertArticle,
  type SocialPost, type InsertSocialPost,
  type SchedulerLog, type InsertSchedulerLog,
  type ChatMessage, type InsertChatMessage,
  type ArticleWithHotel,
  type LatestContent
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Hotels
  getHotel(id: string): Promise<Hotel | undefined>;
  getAllHotels(): Promise<Hotel[]>;
  createHotel(hotel: InsertHotel): Promise<Hotel>;
  updateHotel(id: string, hotel: Partial<InsertHotel>): Promise<Hotel | undefined>;

  // Articles
  getArticle(id: string): Promise<Article | undefined>;
  getArticleWithHotel(id: string): Promise<ArticleWithHotel | undefined>;
  getLatestArticle(): Promise<ArticleWithHotel | undefined>;
  getAllArticles(): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article | undefined>;
  publishArticle(id: string): Promise<Article | undefined>;

  // Social Posts
  getSocialPost(id: string): Promise<SocialPost | undefined>;
  getSocialPostsByArticle(articleId: string): Promise<SocialPost[]>;
  createSocialPost(post: InsertSocialPost): Promise<SocialPost>;
  updateSocialPost(id: string, post: Partial<InsertSocialPost>): Promise<SocialPost | undefined>;

  // Scheduler Logs
  getSchedulerLog(id: string): Promise<SchedulerLog | undefined>;
  getLatestSchedulerLog(runType: string): Promise<SchedulerLog | undefined>;
  createSchedulerLog(log: InsertSchedulerLog): Promise<SchedulerLog>;
  updateSchedulerLog(id: string, log: Partial<InsertSchedulerLog>): Promise<SchedulerLog | undefined>;

  // Chat Messages
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  // Aggregated data
  getLatestContent(): Promise<LatestContent>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private hotels: Map<string, Hotel>;
  private articles: Map<string, Article>;
  private socialPosts: Map<string, SocialPost>;
  private schedulerLogs: Map<string, SchedulerLog>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.users = new Map();
    this.hotels = new Map();
    this.articles = new Map();
    this.socialPosts = new Map();
    this.schedulerLogs = new Map();
    this.chatMessages = new Map();
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Hotels
  async getHotel(id: string): Promise<Hotel | undefined> {
    return this.hotels.get(id);
  }

  async getAllHotels(): Promise<Hotel[]> {
    return Array.from(this.hotels.values());
  }

  async createHotel(insertHotel: InsertHotel): Promise<Hotel> {
    const id = randomUUID();
    const hotel: Hotel = {
      ...insertHotel,
      id,
      scrapedAt: new Date(),
      currency: insertHotel.currency || "USD",
      reviewCount: insertHotel.reviewCount || 0,
      address: insertHotel.address || null,
      thumbnail: insertHotel.thumbnail || null,
      images: insertHotel.images || null,
      amenities: insertHotel.amenities || null,
      description: insertHotel.description || null,
      sourceUrl: insertHotel.sourceUrl || null,
    };
    this.hotels.set(id, hotel);
    return hotel;
  }

  async updateHotel(id: string, updates: Partial<InsertHotel>): Promise<Hotel | undefined> {
    const hotel = this.hotels.get(id);
    if (!hotel) return undefined;
    const updated = { ...hotel, ...updates };
    this.hotels.set(id, updated);
    return updated;
  }

  // Articles
  async getArticle(id: string): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async getArticleWithHotel(id: string): Promise<ArticleWithHotel | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;

    const hotel = this.hotels.get(article.hotelId);
    if (!hotel) return undefined;

    const socialPosts = Array.from(this.socialPosts.values())
      .filter(p => p.articleId === id);

    return { ...article, hotel, socialPosts };
  }

  async getLatestArticle(): Promise<ArticleWithHotel | undefined> {
    const articles = Array.from(this.articles.values())
      .filter(a => a.isPublished)
      .sort((a, b) => {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return dateB - dateA;
      });

    if (articles.length === 0) return undefined;

    const latest = articles[0];
    const hotel = this.hotels.get(latest.hotelId);
    if (!hotel) return undefined;

    const socialPosts = Array.from(this.socialPosts.values())
      .filter(p => p.articleId === latest.id);

    return { ...latest, hotel, socialPosts };
  }

  async getAllArticles(): Promise<Article[]> {
    return Array.from(this.articles.values());
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = randomUUID();
    const article: Article = {
      ...insertArticle,
      id,
      createdAt: new Date(),
      language: insertArticle.language || "id",
      isPublished: insertArticle.isPublished || false,
      publishedAt: insertArticle.publishedAt || null,
      generatedImage: insertArticle.generatedImage || null,
      features: insertArticle.features || null,
      locationAdvantages: insertArticle.locationAdvantages || null,
      recommendations: insertArticle.recommendations || null,
    };
    this.articles.set(id, article);
    return article;
  }

  async updateArticle(id: string, updates: Partial<InsertArticle>): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;
    const updated = { ...article, ...updates };
    this.articles.set(id, updated);
    return updated;
  }

  async publishArticle(id: string): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;
    const updated = { ...article, isPublished: true, publishedAt: new Date() };
    this.articles.set(id, updated);
    return updated;
  }

  // Social Posts
  async getSocialPost(id: string): Promise<SocialPost | undefined> {
    return this.socialPosts.get(id);
  }

  async getSocialPostsByArticle(articleId: string): Promise<SocialPost[]> {
    return Array.from(this.socialPosts.values())
      .filter(p => p.articleId === articleId);
  }

  async createSocialPost(insertPost: InsertSocialPost): Promise<SocialPost> {
    const id = randomUUID();
    const post: SocialPost = {
      ...insertPost,
      id,
      createdAt: new Date(),
      status: insertPost.status || "pending",
      engagement: insertPost.engagement || 0,
      postId: insertPost.postId || null,
      postUrl: insertPost.postUrl || null,
      imageUrl: insertPost.imageUrl || null,
      errorMessage: insertPost.errorMessage || null,
      postedAt: insertPost.postedAt || null,
    };
    this.socialPosts.set(id, post);
    return post;
  }

  async updateSocialPost(id: string, updates: Partial<InsertSocialPost>): Promise<SocialPost | undefined> {
    const post = this.socialPosts.get(id);
    if (!post) return undefined;
    const updated = { ...post, ...updates };
    this.socialPosts.set(id, updated);
    return updated;
  }

  // Scheduler Logs
  async getSchedulerLog(id: string): Promise<SchedulerLog | undefined> {
    return this.schedulerLogs.get(id);
  }

  async getLatestSchedulerLog(runType: string): Promise<SchedulerLog | undefined> {
    const logs = Array.from(this.schedulerLogs.values())
      .filter(l => l.runType === runType)
      .sort((a, b) => {
        const dateA = a.startedAt ? new Date(a.startedAt).getTime() : 0;
        const dateB = b.startedAt ? new Date(b.startedAt).getTime() : 0;
        return dateB - dateA;
      });
    return logs[0];
  }

  async createSchedulerLog(insertLog: InsertSchedulerLog): Promise<SchedulerLog> {
    const id = randomUUID();
    const log: SchedulerLog = {
      ...insertLog,
      id,
      startedAt: new Date(),
      itemsProcessed: insertLog.itemsProcessed || 0,
      message: insertLog.message || null,
      completedAt: insertLog.completedAt || null,
    };
    this.schedulerLogs.set(id, log);
    return log;
  }

  async updateSchedulerLog(id: string, updates: Partial<InsertSchedulerLog>): Promise<SchedulerLog | undefined> {
    const log = this.schedulerLogs.get(id);
    if (!log) return undefined;
    const updated = { ...log, ...updates };
    this.schedulerLogs.set(id, updated);
    return updated;
  }

  // Chat Messages
  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(m => m.sessionId === sessionId)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      });
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      createdAt: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }

  // Aggregated data
  async getLatestContent(): Promise<LatestContent> {
    const article = await this.getLatestArticle();
    
    // Get scheduler status
    const latestLog = await this.getLatestSchedulerLog("generate");
    let schedulerStatus: "running" | "idle" | "error" = "idle";
    if (latestLog) {
      if (latestLog.status === "started") schedulerStatus = "running";
      else if (latestLog.status === "failed") schedulerStatus = "error";
    }

    // Calculate next update (2 hours from last update)
    const lastUpdated = article?.publishedAt 
      ? new Date(article.publishedAt).toISOString()
      : new Date().toISOString();
    
    const nextUpdateDate = new Date(lastUpdated);
    nextUpdateDate.setHours(nextUpdateDate.getHours() + 2);

    return {
      article: article || null,
      lastUpdated,
      nextUpdate: nextUpdateDate.toISOString(),
      schedulerStatus,
    };
  }
}

export const storage = new MemStorage();
