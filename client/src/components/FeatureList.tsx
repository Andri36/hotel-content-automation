import { 
  Check, 
  Wifi, 
  Car, 
  Waves, 
  Utensils, 
  Dumbbell, 
  Wind, 
  Tv, 
  Coffee, 
  Sparkles,
  TreePalm,
  Building,
  CircleParking
} from "lucide-react";

interface FeatureListProps {
  features: string[];
  title?: string;
  variant?: "default" | "compact";
}

const featureIcons: Record<string, typeof Check> = {
  wifi: Wifi,
  parking: CircleParking,
  pool: Waves,
  restaurant: Utensils,
  gym: Dumbbell,
  ac: Wind,
  tv: Tv,
  coffee: Coffee,
  spa: Sparkles,
  beach: TreePalm,
  "city view": Building,
  default: Check
};

function getIconForFeature(feature: string): typeof Check {
  const lowerFeature = feature.toLowerCase();
  for (const [key, icon] of Object.entries(featureIcons)) {
    if (lowerFeature.includes(key)) {
      return icon;
    }
  }
  return featureIcons.default;
}

export function FeatureList({ features, title = "Fasilitas Hotel", variant = "default" }: FeatureListProps) {
  if (!features || features.length === 0) {
    return null;
  }

  const Icon = variant === "compact" ? Check : null;

  return (
    <div className="space-y-3" data-testid="feature-list">
      {title && (
        <h3 className="text-lg font-semibold" data-testid="text-feature-title">{title}</h3>
      )}
      <ul className={variant === "compact" ? "space-y-2" : "grid grid-cols-1 sm:grid-cols-2 gap-3"}>
        {features.map((feature, index) => {
          const FeatureIcon = variant === "compact" ? Check : getIconForFeature(feature);
          return (
            <li 
              key={index} 
              className="flex items-start gap-3"
              data-testid={`feature-item-${index}`}
            >
              <div className={`flex-shrink-0 rounded-full p-1.5 ${
                variant === "compact" 
                  ? "bg-primary/10 text-primary" 
                  : "bg-primary/10 text-primary"
              }`}>
                <FeatureIcon className="w-4 h-4" />
              </div>
              <span className="text-sm leading-relaxed">{feature}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
