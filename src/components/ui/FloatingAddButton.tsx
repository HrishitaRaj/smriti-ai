import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const FloatingAddButton = () => {
  return (
    <Button
      className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-[var(--shadow-hover)] gradient-primary hover:scale-110 transition-all animate-float z-50"
      size="icon"
    >
      <Plus className="w-6 h-6" />
      <span className="sr-only">Add Memory</span>
    </Button>
  );
};

export default FloatingAddButton;
