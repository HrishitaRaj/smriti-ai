import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

interface CTEmotionChartProps {
  data: Array<Record<string, number | string>>;
  period: "day" | "week" | "month";
}

const emotionColors: Record<string, string> = {
  happy: "#60a5fa",
  calm: "#22c55e",
  anxious: "#ef4444",
  angry: "#b91c1c",
  excited: "#facc15",
  neutral: "#a3a3a3",
  sad: "#3b82f6",
};

export const CTEmotionChart = ({ data, period }: CTEmotionChartProps) => {
  const emotions = Object.keys(emotionColors);

  return (
    <div className="bg-card rounded-2xl p-6 shadow-md border border-border transition-all hover:shadow-lg">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Emotion Trends ({period.charAt(0).toUpperCase() + period.slice(1)})
        </h3>

        <div className="flex flex-wrap gap-3 text-xs">
          {emotions.map((emotion) => (
            <div key={emotion} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: emotionColors[emotion] }}
              />
              <span className="text-muted-foreground capitalize">{emotion}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
          >
            {/* Gradient fills */}
            <defs>
              {emotions.map((emotion) => (
                <linearGradient
                  key={emotion}
                  id={`color-${emotion}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={emotionColors[emotion]}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={emotionColors[emotion]}
                    stopOpacity={0}
                  />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />

            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              stroke="hsl(var(--muted-foreground))"
              label={{
                value: "Emotion Intensity (%)",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 11, fill: "hsl(var(--muted-foreground))" },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "10px",
                fontSize: "12px",
                color: "hsl(var(--foreground))",
              }}
            />
            <Legend
              wrapperStyle={{
                fontSize: "12px",
                paddingTop: "10px",
              }}
            />

            {emotions.map((emotion) => (
              <Area
                key={emotion}
                type="monotone"
                dataKey={emotion}
                stroke={emotionColors[emotion]}
                fill={`url(#color-${emotion})`}
                strokeWidth={1.8}
                fillOpacity={1}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
