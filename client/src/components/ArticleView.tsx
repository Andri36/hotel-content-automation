import { MapPin, Lightbulb, ThumbsUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FeatureList } from "./FeatureList";
import type { ArticleWithHotel } from "@shared/schema";

interface ArticleViewProps {
  article: ArticleWithHotel;
}

export function ArticleView({ article }: ArticleViewProps) {
  const { hotel } = article;

  return (
    <article className="space-y-6 fade-in" data-testid="article-view">
      {/* Hero section with image */}
      <div className="relative aspect-[16/9] sm:aspect-[2/1] rounded-2xl overflow-hidden shadow-xl">
        {hotel.thumbnail ? (
          <img
            src={hotel.thumbnail}
            alt={hotel.name}
            className="w-full h-full object-cover"
            data-testid="img-article-hero"
          />
        ) : article.generatedImage ? (
          <img
            src={article.generatedImage}
            alt={article.title}
            className="w-full h-full object-cover"
            data-testid="img-article-generated"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 via-primary/10 to-accent/20 flex items-center justify-center">
            <span className="text-muted-foreground text-lg">No image available</span>
          </div>
        )}
        
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="flex items-center gap-2 text-white/80 mb-3">
            <MapPin className="w-4 h-4" />
            <span className="text-sm" data-testid="text-article-location">{hotel.location}</span>
          </div>
          <h1 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight drop-shadow-lg"
            data-testid="text-article-title"
          >
            {article.title}
          </h1>
        </div>
      </div>

      {/* Article content */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6 sm:p-8 space-y-8">
          {/* Description */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p 
              className="text-base sm:text-lg leading-relaxed text-foreground/90"
              data-testid="text-article-description"
            >
              {article.description}
            </p>
          </div>

          <Separator />

          {/* Features */}
          {article.features && article.features.length > 0 && (
            <FeatureList 
              features={article.features} 
              title="Fasilitas & Keunggulan Hotel"
            />
          )}

          {/* Location advantages */}
          {article.locationAdvantages && article.locationAdvantages.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4" data-testid="location-advantages">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-accent/10">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold">Keunggulan Lokasi</h3>
                </div>
                <ul className="space-y-3">
                  {article.locationAdvantages.map((advantage, index) => (
                    <li 
                      key={index}
                      className="flex items-start gap-3 text-foreground/80"
                      data-testid={`location-advantage-${index}`}
                    >
                      <Lightbulb className="w-4 h-4 mt-1 text-accent flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{advantage}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Recommendations */}
          {article.recommendations && article.recommendations.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4" data-testid="recommendations">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-primary/10">
                    <ThumbsUp className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Rekomendasi</h3>
                </div>
                <ul className="space-y-3">
                  {article.recommendations.map((recommendation, index) => (
                    <li 
                      key={index}
                      className="flex items-start gap-3 text-foreground/80"
                      data-testid={`recommendation-${index}`}
                    >
                      <ThumbsUp className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Metadata footer */}
          <Separator />
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span data-testid="text-language">
                Bahasa: {article.language === 'id' ? 'Indonesia' : article.language === 'en' ? 'English' : article.language}
              </span>
              {article.createdAt && (
                <span data-testid="text-created-at">
                  Dibuat: {new Date(article.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              )}
            </div>
            <div className="text-xs opacity-60">
              Konten dibuat oleh AI
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
