import { SiLinkedin } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";
import { CheckCircle2, Clock, AlertCircle, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SocialPost } from "@shared/schema";

interface SocialShareBadgesProps {
  posts: SocialPost[];
}

const platformIcons = {
  twitter: FaXTwitter,
  linkedin: SiLinkedin,
};

const platformNames = {
  twitter: "X/Twitter",
  linkedin: "LinkedIn",
};

const statusConfig = {
  posted: {
    icon: CheckCircle2,
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    label: "Posted"
  },
  pending: {
    icon: Clock,
    className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    label: "Pending"
  },
  failed: {
    icon: AlertCircle,
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    label: "Failed"
  }
};

export function SocialShareBadges({ posts }: SocialShareBadgesProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-sm" data-testid="no-social-posts">
        <Clock className="w-4 h-4" />
        <span>Belum dibagikan ke social media</span>
      </div>
    );
  }

  return (
    <div className="space-y-3" data-testid="social-share-badges">
      <h4 className="text-sm font-medium text-muted-foreground">Dibagikan ke:</h4>
      <div className="flex flex-wrap gap-2">
        {posts.map((post) => {
          const PlatformIcon = platformIcons[post.platform as keyof typeof platformIcons] || Clock;
          const status = statusConfig[post.status as keyof typeof statusConfig] || statusConfig.pending;
          const StatusIcon = status.icon;
          const platformName = platformNames[post.platform as keyof typeof platformNames] || post.platform;

          return (
            <div 
              key={post.id} 
              className="flex items-center gap-2"
              data-testid={`social-post-${post.platform}`}
            >
              <Badge 
                variant="secondary" 
                className={`flex items-center gap-2 px-3 py-1.5 ${status.className}`}
              >
                <PlatformIcon className="w-4 h-4" />
                <span className="font-medium">{platformName}</span>
                <StatusIcon className="w-3 h-3" />
              </Badge>
              
              {post.postUrl && post.status === "posted" && (
                <a 
                  href={post.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  data-testid={`link-social-post-${post.platform}`}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* Engagement stats if available */}
      {posts.some(p => p.engagement && p.engagement > 0) && (
        <div className="text-xs text-muted-foreground pt-2 border-t border-border/50">
          Total engagement: {posts.reduce((sum, p) => sum + (p.engagement || 0), 0).toLocaleString()}
        </div>
      )}
    </div>
  );
}
