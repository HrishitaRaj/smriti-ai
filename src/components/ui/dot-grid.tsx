import { cn } from "@/lib/utils";

interface DotGridProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  className?: string;
}

export function DotGrid({
  dotSize = 2,
  gap = 30,
  baseColor = "#c800ff",
  className,
}: DotGridProps) {
  return (
    <div
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={{
        backgroundImage: `radial-gradient(circle, ${baseColor} ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `${gap}px ${gap}px`,
        opacity: 0.3,
      }}
    />
  );
}