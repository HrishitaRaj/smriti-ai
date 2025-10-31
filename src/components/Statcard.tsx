import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | ReactNode;
  icon: LucideIcon;
  trend?: string;
  emotion?: "calm" | "happy" | "neutral" | "anxious";
  className?: string;
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  emotion,
  className,
}: StatCardProps) => {
  const emotionColors: Record<
    NonNullable<StatCardProps["emotion"]>,
    string
  > = {
    calm: "text-green-600 bg-green-50",
    happy: "text-blue-600 bg-blue-50",
    neutral: "text-yellow-600 bg-yellow-50",
    anxious: "text-red-600 bg-red-50",
  };

  return (
    <div
      className={cn(
        "bg-card rounded-2xl p-6 shadow-sm border border-border animate-fade-in",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-3 rounded-xl", emotion && emotionColors[emotion])}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>

      <h3 className="text-sm font-medium text-muted-foreground mb-1">
        {title}
      </h3>
      <p className="text-3xl font-bold text-foreground break-words">{value}</p>
    </div>
  );
};
