import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  type: "medication" | "activity" | "emotional";
}

interface TaskListProps {
  tasks: Task[];
  onToggle?: (id: string) => void;
}

export const TaskList = ({ tasks, onToggle }: TaskListProps) => {
  const typeColors = {
    medication: "bg-blue-100 text-blue-700",
    activity: "bg-green-100 text-green-700",
    emotional: "bg-purple-100 text-purple-700",
  };

  const typeLabels = {
    medication: "💊",
    activity: "🎯",
    emotional: "⚠️",
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Today's Tasks</h3>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer hover:bg-muted",
              task.completed && "opacity-60"
            )}
            onClick={() => onToggle?.(task.id)}
          >
            {task.completed ? (
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className={cn("text-sm font-medium", task.completed && "line-through text-muted-foreground")}>
                {task.title}
              </p>
            </div>
            <span className={cn("text-xs px-2 py-1 rounded-full", typeColors[task.type])}>
              {typeLabels[task.type]}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          {tasks.filter((t) => t.completed).length} of {tasks.length} tasks completed
        </p>
      </div>
    </div>
  );
};
