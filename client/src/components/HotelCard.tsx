import { MapPin, Star, Clock, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Hotel } from "@shared/schema";

interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg" data-testid={`card-hotel-${hotel.id}`}>
      {/* Hero Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {hotel.thumbnail ? (
          <img
            src={hotel.thumbnail}
            alt={hotel.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            data-testid="img-hotel-thumbnail"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <span className="text-muted-foreground text-lg">No image available</span>
          </div>
        )}
        
        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />
        
        {/* Price badge */}
        <div className="absolute top-4 right-4">
          <Badge className="bg-accent text-accent-foreground text-lg font-bold px-4 py-2 shadow-lg" data-testid="badge-price">
            {hotel.price}
            {hotel.currency && <span className="text-sm font-normal ml-1">/{hotel.currency}</span>}
          </Badge>
        </div>
        
        {/* Hotel name overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-2xl font-bold text-white mb-1 drop-shadow-lg" data-testid="text-hotel-name">
            {hotel.name}
          </h2>
          <div className="flex items-center gap-2 text-white/90">
            <MapPin className="w-4 h-4" />
            <span className="text-sm" data-testid="text-hotel-location">{hotel.location}</span>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="p-6 space-y-4">
        {/* Rating and reviews */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2" data-testid="rating-container">
            <div className="flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="font-semibold text-primary" data-testid="text-rating">{hotel.rating.toFixed(1)}</span>
            </div>
            {hotel.reviewCount && hotel.reviewCount > 0 && (
              <span className="text-sm text-muted-foreground" data-testid="text-review-count">
                ({hotel.reviewCount.toLocaleString()} reviews)
              </span>
            )}
          </div>
          
          {hotel.sourceUrl && (
            <a 
              href={hotel.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="link-source"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Address */}
        {hotel.address && (
          <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-address">
            {hotel.address}
          </p>
        )}

        {/* Amenities */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2" data-testid="amenities-container">
            {hotel.amenities.slice(0, 6).map((amenity, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs"
                data-testid={`badge-amenity-${index}`}
              >
                {amenity}
              </Badge>
            ))}
            {hotel.amenities.length > 6 && (
              <Badge variant="outline" className="text-xs">
                +{hotel.amenities.length - 6} more
              </Badge>
            )}
          </div>
        )}

        {/* Scraped timestamp */}
        {hotel.scrapedAt && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t border-border/50">
            <Clock className="w-3 h-3" />
            <span data-testid="text-scraped-at">
              Data scraped: {new Date(hotel.scrapedAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
