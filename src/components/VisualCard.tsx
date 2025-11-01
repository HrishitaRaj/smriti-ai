import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";

type Props = {
  src: string;
  caption?: string;
  onDelete?: () => void;
  onDownload?: () => void;
  onEdit?: () => void;
  name?: string;
  relation?: string;
};

export default function VisualCard({ src, caption, onDelete, onDownload, onEdit, name, relation }: Props) {
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
          {/* Edit button - optional prop */}
          {onEdit && (
            <button
              onClick={onEdit}
              title="Edit"
              className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M3 21v-3l11-11 3 3L6 21H3z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          )}
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

        {/* name/relation overlay */}
        {(name || relation) && (
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1">
            {name && <span className="px-2 py-0.5 rounded-full text-xs bg-white/90 text-foreground font-medium">{name}</span>}
            {relation && <span className="px-2 py-0.5 rounded-full text-xs bg-white/80 text-foreground/80">{relation}</span>}
          </div>
        )}
      </div>
    </Card>
  );
}
