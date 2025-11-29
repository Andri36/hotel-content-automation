import { RefreshCw, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatusIndicatorProps {
  lastUpdated: string | null;
  nextUpdate: string | null;
  status: "running" | "idle" | "error";
}

const statusConfig = {
  running: {
    icon: RefreshCw,
    label: "Sedang memproses...",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    iconClassName: "animate-spin"
  },
  idle: {
    icon: CheckCircle2,
    label: "Siap",
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    iconClassName: ""
  },
  error: {
    icon: AlertCircle,
    label: "Error",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    iconClassName: ""
  }
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return "Baru saja";
  if (diffMins < 60) return `${diffMins} menit yang lalu`;
  if (diffHours < 24) return `${diffHours} jam yang lalu`;
  
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatTimeUntil(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMs < 0) return "Segera";
  if (diffMins < 60) return `${diffMins} menit lagi`;
  if (diffHours < 24) return `${diffHours} jam lagi`;
  
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function StatusIndicator({ lastUpdated, nextUpdate, status }: StatusIndicatorProps) {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div 
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-card border border-border/50"
      data-testid="status-indicator"
    >
      {/* Status badge */}
      <div className="flex items-center gap-3">
        <Badge className={`flex items-center gap-2 px-3 py-1.5 ${config.className}`}>
          <StatusIcon className={`w-4 h-4 ${config.iconClassName}`} />
          <span data-testid="text-status">{config.label}</span>
        </Badge>

        {/* Auto-update indicator */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-primary pulse-dot" />
          <span>Auto-update aktif</span>
        </div>
      </div>

      {/* Timestamps */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm">
        {lastUpdated && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span data-testid="text-last-updated">
              Diupdate: <span className="font-medium text-foreground">{formatTimeAgo(lastUpdated)}</span>
            </span>
          </div>
        )}
        
        {nextUpdate && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="w-4 h-4" />
            <span data-testid="text-next-update">
              Update berikutnya: <span className="font-medium text-foreground">{formatTimeUntil(nextUpdate)}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
