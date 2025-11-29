import type { Article, Hotel, InsertSocialPost } from "@shared/schema";

export interface SocialPostResult {
  success: boolean;
  postId?: string;
  postUrl?: string;
  error?: string;
}

export class SocialPoster {
  private appUrl: string;

  constructor() {
    // Use environment variable or default to localhost
    this.appUrl = process.env.APP_URL || "http://localhost:5000";
  }

  async postToTwitter(article: Article, hotel: Hotel): Promise<SocialPostResult> {
    // In production, this would use Twitter API v2
    // For now, we simulate the posting
    console.log(`[SocialPoster] Posting to Twitter: ${article.title}`);

    const tweetContent = this.formatTwitterPost(article, hotel);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulate successful post (in production, this would be actual API response)
    const mockPostId = `tw_${Date.now()}`;
    
    return {
      success: true,
      postId: mockPostId,
      postUrl: `https://twitter.com/user/status/${mockPostId}`,
    };
  }

  async postToLinkedIn(article: Article, hotel: Hotel): Promise<SocialPostResult> {
    // In production, this would use LinkedIn API
    console.log(`[SocialPoster] Posting to LinkedIn: ${article.title}`);

    const linkedInContent = this.formatLinkedInPost(article, hotel);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulate successful post
    const mockPostId = `li_${Date.now()}`;
    
    return {
      success: true,
      postId: mockPostId,
      postUrl: `https://linkedin.com/posts/${mockPostId}`,
    };
  }

  formatTwitterPost(article: Article, hotel: Hotel): string {
    const hashtags = "#travel #hotel #bali #vacation #luxury";
    const emoji = "🏨✨";
    
    // Twitter has 280 character limit
    let content = `${emoji} ${article.title}\n\n`;
    content += `📍 ${hotel.location}\n`;
    content += `⭐ Rating: ${hotel.rating}/5\n`;
    content += `💰 Mulai ${hotel.price} ${hotel.currency}/malam\n\n`;
    content += `Baca selengkapnya di app kami!\n${this.appUrl}\n\n`;
    content += hashtags;

    return content.substring(0, 280);
  }

  formatLinkedInPost(article: Article, hotel: Hotel): string {
    let content = `🏨 ${article.title}\n\n`;
    content += `${article.description?.substring(0, 200)}...\n\n`;
    content += `📍 Lokasi: ${hotel.location}\n`;
    content += `⭐ Rating: ${hotel.rating}/5 dari ${hotel.reviewCount} ulasan\n`;
    content += `💰 Harga: mulai ${hotel.price} ${hotel.currency}/malam\n\n`;
    
    if (article.features && article.features.length > 0) {
      content += `✅ Fasilitas unggulan:\n`;
      article.features.slice(0, 3).forEach(feature => {
        content += `• ${feature}\n`;
      });
      content += `\n`;
    }

    content += `🔗 Lihat detail lengkap di: ${this.appUrl}\n\n`;
    content += `#TravelIndonesia #HotelRecommendation #BaliTravel #LuxuryHotel #Vacation`;

    return content;
  }

  createSocialPostData(
    articleId: string, 
    platform: "twitter" | "linkedin", 
    article: Article, 
    hotel: Hotel
  ): InsertSocialPost {
    const content = platform === "twitter" 
      ? this.formatTwitterPost(article, hotel)
      : this.formatLinkedInPost(article, hotel);

    return {
      articleId,
      platform,
      content,
      imageUrl: hotel.thumbnail || article.generatedImage || null,
      status: "pending",
    };
  }
}

export const socialPoster = new SocialPoster();
