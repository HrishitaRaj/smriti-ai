import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";

type Props = {
  src: string;
  caption?: string;
  onDelete?: () => void;
  onDownload?: () => void;
};

export default function VisualCard({ src, caption, onDelete, onDownload }: Props) {
  return (
    <Card className="overflow-hidden group">
      <div className="relative overflow-hidden bg-muted rounded-xl">
        <img
          src={src}
          alt={caption || "memory"}
          className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
        />

        {/* top-right action buttons */}
        <div className="absolute right-3 top-3 flex gap-2 opacity-90">
          <button
            onClick={onDownload}
            title="Download"
            className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            title="Delete"
            className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </button>
        </div>

        {/* bottom overlay caption */}
        {caption && (
          <div className="absolute left-0 right-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent text-white">
            <p className="text-sm truncate">{caption}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
