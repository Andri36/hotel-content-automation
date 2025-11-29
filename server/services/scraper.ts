import type { InsertHotel } from "@shared/schema";

// Mock hotel data for demonstration
// In production, this would use Puppeteer/Cheerio to scrape from Expedia, Booking.com, etc.
const sampleHotels: InsertHotel[] = [
  {
    name: "The Ritz-Carlton Bali",
    price: "450",
    currency: "USD",
    rating: 4.8,
    reviewCount: 2847,
    location: "Nusa Dua, Bali",
    address: "Jl. Raya Nusa Dua Selatan Lot III, Sawangan, Nusa Dua, Bali 80363",
    thumbnail: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80"
    ],
    amenities: ["Private Beach", "Infinity Pool", "Spa & Wellness", "Fine Dining", "Fitness Center", "Kids Club", "Free WiFi", "Airport Transfer"],
    description: "Experience the ultimate luxury at The Ritz-Carlton Bali, perched on a cliff with stunning Indian Ocean views.",
    sourceUrl: "https://www.ritzcarlton.com/bali"
  },
  {
    name: "Four Seasons Resort Bali at Jimbaran Bay",
    price: "580",
    currency: "USD",
    rating: 4.9,
    reviewCount: 1956,
    location: "Jimbaran, Bali",
    address: "Jimbaran Bay, Bali 80361",
    thumbnail: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80"
    ],
    amenities: ["Private Villa", "Ocean View", "Butler Service", "Balinese Spa", "Gourmet Restaurant", "Water Sports", "Cultural Activities"],
    description: "A tropical paradise featuring private villas with plunge pools overlooking Jimbaran Bay.",
    sourceUrl: "https://www.fourseasons.com/jimbaranbay"
  },
  {
    name: "Ayana Resort and Spa Bali",
    price: "320",
    currency: "USD",
    rating: 4.7,
    reviewCount: 3421,
    location: "Jimbaran, Bali",
    address: "Karang Mas Estate, Jimbaran, Bali 80364",
    thumbnail: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
    ],
    amenities: ["Rock Bar", "Multiple Pools", "Private Beach", "Golf Course", "Spa", "Kids Club", "Tennis Courts"],
    description: "Iconic resort home to the famous Rock Bar, offering breathtaking sunset views over the ocean.",
    sourceUrl: "https://www.ayana.com/bali"
  },
  {
    name: "Alila Villas Uluwatu",
    price: "650",
    currency: "USD",
    rating: 4.9,
    reviewCount: 1289,
    location: "Uluwatu, Bali",
    address: "Jl. Belimbing Sari, Pecatu, Uluwatu, Bali 80364",
    thumbnail: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80"
    ],
    amenities: ["Cliff-top Location", "Private Pool Villa", "Sustainable Design", "Destination Dining", "Spa Alila", "Yoga Classes"],
    description: "Stunning cliff-edge villas with eco-friendly design and spectacular Indian Ocean panoramas.",
    sourceUrl: "https://www.alilahotels.com/uluwatu"
  },
  {
    name: "Conrad Bali",
    price: "280",
    currency: "USD",
    rating: 4.6,
    reviewCount: 4156,
    location: "Tanjung Benoa, Bali",
    address: "Jl. Pratama 168, Tanjung Benoa, Bali 80363",
    thumbnail: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80"
    ],
    amenities: ["Beachfront", "7 Pools", "Wedding Chapel", "Jiwa Spa", "Water Sports", "Kids Club", "Multiple Restaurants"],
    description: "Luxury beachfront resort with extensive facilities perfect for families and couples alike.",
    sourceUrl: "https://www.conradhotels.com/bali"
  }
];

export class HotelScraper {
  private currentIndex = 0;

  async scrapeHotels(count: number = 1): Promise<InsertHotel[]> {
    // Simulate scraping delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const hotels: InsertHotel[] = [];
    for (let i = 0; i < count; i++) {
      const hotel = sampleHotels[this.currentIndex % sampleHotels.length];
      hotels.push(hotel);
      this.currentIndex++;
    }

    console.log(`[Scraper] Scraped ${hotels.length} hotel(s)`);
    return hotels;
  }

  async scrapeFromUrl(url: string): Promise<InsertHotel | null> {
    // In production, this would use Puppeteer to scrape the actual URL
    console.log(`[Scraper] Scraping from URL: ${url}`);
    
    // Return a random hotel from samples for demonstration
    const randomIndex = Math.floor(Math.random() * sampleHotels.length);
    return sampleHotels[randomIndex];
  }
}

export const scraper = new HotelScraper();
