import { useQuery } from "@tanstack/react-query";
import { Loader2, Hotel, RefreshCw, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArticleView } from "@/components/ArticleView";
import { StatusIndicator } from "@/components/StatusIndicator";
import { SocialShareBadges } from "@/components/SocialShareBadges";
import { ChatbotUI } from "@/components/ChatbotUI";
import type { LatestContent } from "@shared/schema";

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" data-testid="loading-skeleton">
      {/* Status skeleton */}
      <div className="h-16 bg-muted rounded-lg" />
      
      {/* Hero image skeleton */}
      <div className="aspect-[16/9] sm:aspect-[2/1] bg-muted rounded-2xl" />
      
      {/* Content skeleton */}
      <Card className="border-0">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-5/6" />
            <div className="h-4 bg-muted rounded w-4/6" />
          </div>
          <Separator />
          <div className="space-y-3">
            <div className="h-5 bg-muted rounded w-1/4" />
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 bg-muted rounded" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="border-dashed" data-testid="empty-state">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 rounded-full bg-primary/10 mb-4">
          <Hotel className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Belum Ada Konten</h2>
        <p className="text-muted-foreground max-w-sm mb-6">
          Sistem sedang memproses data hotel. Konten akan otomatis muncul setelah proses selesai.
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Menunggu proses scraping dan generate konten...</span>
        </div>
      </CardContent>
    </Card>
  );
}

function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <Card className="border-destructive/50" data-testid="error-state">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 rounded-full bg-destructive/10 mb-4">
          <AlertCircle className="w-12 h-12 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Terjadi Kesalahan</h2>
        <p className="text-muted-foreground max-w-sm mb-6">
          {error.message || "Gagal mengambil data. Silakan coba lagi."}
        </p>
        <Button onClick={onRetry} data-testid="button-retry">
          <RefreshCw className="w-4 h-4 mr-2" />
          Coba Lagi
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const { 
    data: content, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery<LatestContent>({
    queryKey: ["/api/content/latest"],
    refetchInterval: 30000, // Refetch every 30 seconds to check for updates
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-effect border-b border-border/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Hotel className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight gradient-text" data-testid="text-app-title">
                  Hotel Picks
                </h1>
                <p className="text-xs text-muted-foreground">AI-Curated Travel Content</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Status indicator */}
          {content && (
            <StatusIndicator
              lastUpdated={content.lastUpdated}
              nextUpdate={content.nextUpdate}
              status={content.schedulerStatus}
            />
          )}

          {/* Content area */}
          {isLoading && <LoadingSkeleton />}
          
          {isError && (
            <ErrorState 
              error={error as Error} 
              onRetry={() => refetch()} 
            />
          )}

          {!isLoading && !isError && !content?.article && <EmptyState />}

          {!isLoading && !isError && content?.article && (
            <>
              {/* Article view */}
              <ArticleView article={content.article} />

              {/* Social share status */}
              {content.article.socialPosts && content.article.socialPosts.length > 0 && (
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <SocialShareBadges posts={content.article.socialPosts} />
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>

      {/* Chatbot floating UI */}
      <ChatbotUI />
    </div>
  );
}
