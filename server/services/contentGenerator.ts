import OpenAI from "openai";
import type { Hotel, InsertArticle } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    console.log("[ContentGenerator] OpenAI API key not configured, using fallback content");
    return null;
  }
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

export interface GeneratedContent {
  title: string;
  description: string;
  features: string[];
  locationAdvantages: string[];
  recommendations: string[];
}

export class ContentGenerator {
  async generateArticle(hotel: Hotel, language: string = "id"): Promise<InsertArticle> {
    const client = getOpenAIClient();
    
    if (!client) {
      return this.generateFallbackArticle(hotel, language);
    }

    const languagePrompt = language === "id" 
      ? "Tulis dalam Bahasa Indonesia yang menarik dan profesional."
      : "Write in engaging and professional English.";

    const prompt = `Anda adalah travel writer profesional. Berdasarkan data hotel berikut, buat konten artikel blog yang menarik.

Hotel Data:
- Nama: ${hotel.name}
- Lokasi: ${hotel.location}
- Alamat: ${hotel.address || 'N/A'}
- Harga: ${hotel.price} ${hotel.currency}/malam
- Rating: ${hotel.rating}/5 (${hotel.reviewCount} reviews)
- Amenities: ${hotel.amenities?.join(', ') || 'N/A'}
- Deskripsi: ${hotel.description || 'N/A'}

${languagePrompt}

Buat konten dalam format JSON dengan struktur berikut:
{
  "title": "Judul artikel yang menarik dan SEO-friendly (max 80 karakter)",
  "description": "Deskripsi detail hotel dalam 2-3 paragraf yang menggambarkan pengalaman menginap",
  "features": ["5-7 fitur unggulan hotel dengan penjelasan singkat"],
  "locationAdvantages": ["3-5 keunggulan lokasi hotel"],
  "recommendations": ["3-4 rekomendasi untuk siapa hotel ini cocok"]
}`;

    try {
      const response = await client.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: "Anda adalah travel writer profesional yang ahli membuat konten hotel yang menarik dan informatif. Selalu respond dalam format JSON yang valid."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 2048,
      });

      const content = JSON.parse(response.choices[0].message.content || "{}") as GeneratedContent;

      return {
        hotelId: hotel.id,
        title: content.title || `Ulasan ${hotel.name}`,
        description: content.description || hotel.description || "",
        features: content.features || hotel.amenities || [],
        locationAdvantages: content.locationAdvantages || [],
        recommendations: content.recommendations || [],
        language,
        isPublished: false,
      };
    } catch (error) {
      console.error("[ContentGenerator] Error generating article:", error);
      return this.generateFallbackArticle(hotel, language);
    }
  }

  private generateFallbackArticle(hotel: Hotel, language: string): InsertArticle {
    const isIndonesian = language === "id";
    
    return {
      hotelId: hotel.id,
      title: isIndonesian 
        ? `Pengalaman Menginap di ${hotel.name} - ${hotel.location}`
        : `Stay Experience at ${hotel.name} - ${hotel.location}`,
      description: isIndonesian
        ? `${hotel.name} adalah destinasi penginapan premium yang terletak di ${hotel.location}. Dengan rating ${hotel.rating}/5 dari ${hotel.reviewCount} ulasan, hotel ini menawarkan pengalaman menginap yang tak terlupakan. ${hotel.description || ''} Harga mulai dari ${hotel.price} ${hotel.currency} per malam, hotel ini memberikan nilai terbaik untuk liburan Anda.`
        : `${hotel.name} is a premium accommodation destination located in ${hotel.location}. With a rating of ${hotel.rating}/5 from ${hotel.reviewCount} reviews, this hotel offers an unforgettable stay experience. ${hotel.description || ''} Starting from ${hotel.price} ${hotel.currency} per night, this hotel provides the best value for your vacation.`,
      features: hotel.amenities || [
        isIndonesian ? "Fasilitas lengkap" : "Complete facilities",
        isIndonesian ? "Pelayanan prima" : "Excellent service",
        isIndonesian ? "Lokasi strategis" : "Strategic location"
      ],
      locationAdvantages: [
        isIndonesian ? `Terletak di ${hotel.location}` : `Located in ${hotel.location}`,
        isIndonesian ? "Akses mudah ke tempat wisata" : "Easy access to tourist attractions",
        isIndonesian ? "Dekat dengan fasilitas umum" : "Close to public facilities"
      ],
      recommendations: [
        isIndonesian ? "Cocok untuk pasangan honeymoon" : "Suitable for honeymoon couples",
        isIndonesian ? "Ideal untuk liburan keluarga" : "Ideal for family vacation",
        isIndonesian ? "Sempurna untuk business travelers" : "Perfect for business travelers"
      ],
      language,
      isPublished: false,
    };
  }

  async generateChatResponse(message: string, hotelContext?: Hotel | null): Promise<string> {
    const client = getOpenAIClient();
    
    if (!client) {
      return this.generateFallbackChatResponse(message, hotelContext);
    }

    const contextInfo = hotelContext 
      ? `\nKonteks hotel saat ini:\n- Nama: ${hotelContext.name}\n- Lokasi: ${hotelContext.location}\n- Harga: ${hotelContext.price} ${hotelContext.currency}/malam\n- Rating: ${hotelContext.rating}/5\n- Fasilitas: ${hotelContext.amenities?.join(', ') || 'N/A'}`
      : "";

    try {
      const response = await client.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: `Anda adalah asisten AI yang membantu pengguna menemukan informasi tentang hotel. Jawab dalam Bahasa Indonesia dengan ramah dan informatif. Berikan jawaban yang singkat dan jelas (maksimal 3 paragraf).${contextInfo}`
          },
          {
            role: "user",
            content: message
          }
        ],
        max_completion_tokens: 512,
      });

      return response.choices[0].message.content || "Maaf, saya tidak dapat memproses pertanyaan Anda saat ini.";
    } catch (error) {
      console.error("[ContentGenerator] Chat error:", error);
      return this.generateFallbackChatResponse(message, hotelContext);
    }
  }

  private generateFallbackChatResponse(message: string, hotelContext?: Hotel | null): string {
    const lowerMessage = message.toLowerCase();

    if (hotelContext) {
      if (lowerMessage.includes("fasilitas") || lowerMessage.includes("amenities")) {
        return `${hotelContext.name} menyediakan berbagai fasilitas unggulan: ${hotelContext.amenities?.join(', ') || 'Informasi fasilitas tidak tersedia'}. Apakah ada fasilitas spesifik yang ingin Anda ketahui?`;
      }
      if (lowerMessage.includes("harga") || lowerMessage.includes("price") || lowerMessage.includes("biaya")) {
        return `Harga kamar di ${hotelContext.name} mulai dari ${hotelContext.price} ${hotelContext.currency} per malam. Harga dapat bervariasi tergantung musim dan tipe kamar yang dipilih.`;
      }
      if (lowerMessage.includes("lokasi") || lowerMessage.includes("location") || lowerMessage.includes("dimana")) {
        return `${hotelContext.name} berlokasi di ${hotelContext.location}. ${hotelContext.address ? `Alamat lengkap: ${hotelContext.address}` : ''}`;
      }
      if (lowerMessage.includes("rating") || lowerMessage.includes("review") || lowerMessage.includes("ulasan")) {
        return `${hotelContext.name} memiliki rating ${hotelContext.rating}/5 berdasarkan ${hotelContext.reviewCount} ulasan tamu. Hotel ini sangat direkomendasikan untuk pengalaman menginap yang berkualitas.`;
      }
      if (lowerMessage.includes("kolam") || lowerMessage.includes("pool") || lowerMessage.includes("renang")) {
        const hasPool = hotelContext.amenities?.some(a => a.toLowerCase().includes('pool'));
        return hasPool 
          ? `Ya, ${hotelContext.name} memiliki fasilitas kolam renang untuk tamu hotel.`
          : `Informasi mengenai kolam renang tidak tersedia dalam data kami. Silakan hubungi hotel langsung untuk konfirmasi.`;
      }
    }

    return "Terima kasih atas pertanyaan Anda! Saat ini saya dapat membantu dengan informasi tentang fasilitas hotel, harga, lokasi, dan rekomendasi. Silakan ajukan pertanyaan yang lebih spesifik atau tunggu konten hotel terbaru ditampilkan.";
  }
}

export const contentGenerator = new ContentGenerator();
