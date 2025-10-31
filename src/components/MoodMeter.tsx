import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";


interface MoodMeterProps {
  stability: number;
  activities?: {
    happy: string[];
    sad: string[];
  };
  
}
export const MoodMeter = ({ stability, activities }: MoodMeterProps) => {
  const data = [
    { name: "Stable", value: stability },
    { name: "Unstable", value: 100 - stability },
  ];

  const COLORS = ["hsl(var(--primary))", "hsl(var(--muted))"];

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        😊 Emotional Stability
      </h3>
      <div className="relative mb-6">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={180}
              endAngle={0}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">{stability}%</p>
            <p className="text-xs text-muted-foreground">Stable</p>
          </div>
        </div>
      </div>
      
            {activities && (
        <div className="space-y-4">
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <h4 className="font-semibold text-green-900 text-sm">What Made Them Happy</h4>
            </div>
            <ul className="space-y-1">
              {activities.happy.map((activity, index) => (
                <li key={index} className="text-xs text-green-700">• {activity}</li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <h4 className="font-semibold text-red-900 text-sm">What Made Them Sad</h4>
            </div>
            <ul className="space-y-1">
              {activities.sad.map((activity, index) => (
                <li key={index} className="text-xs text-red-700">• {activity}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
