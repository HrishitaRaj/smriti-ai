import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import MoodJar from "@/components/MoodJar";

const sampleData = [
  { date: "Mon", joy: 60, calm: 70, sadness: 20, confusion: 25, anxiety: 30 },
  { date: "Tue", joy: 62, calm: 68, sadness: 22, confusion: 28, anxiety: 29 },
  { date: "Wed", joy: 58, calm: 72, sadness: 18, confusion: 20, anxiety: 24 },
  { date: "Thu", joy: 65, calm: 75, sadness: 15, confusion: 18, anxiety: 20 },
  { date: "Fri", joy: 70, calm: 78, sadness: 12, confusion: 15, anxiety: 18 },
  { date: "Sat", joy: 75, calm: 80, sadness: 10, confusion: 12, anxiety: 14 },
  { date: "Sun", joy: 72, calm: 79, sadness: 11, confusion: 13, anxiety: 16 },
];

// MoodBubbleJar placeholder removed — use imported MoodJar component

export default function EmotionTracker() {
  const data = useMemo(() => sampleData, []);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">Emotion Tracker</h1>
            <p className="text-sm text-muted-foreground">Monitor emotional well-being over time</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm">
              <Calendar className="w-5 h-5 text-secondary" />
              <select className="bg-transparent text-sm outline-none">
                <option>Last 7 days</option>
                <option>Last 14 days</option>
                <option>Last 30 days</option>
              </select>
            </div>
            <Button variant="ghost" className="text-foreground">Export</Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main chart area */}
          <div className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Emotion Trends</h3>
              <div className="text-sm text-muted-foreground">Showing: Joy • Calm • Sadness • Confusion • Anxiety</div>
            </div>
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="date" tick={{ fill: 'rgb(60 53 65)' }} />
                  <YAxis tick={{ fill: 'rgb(60 53 65)' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="joy" stroke="#FBCFE8" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="calm" stroke="#C7D2FE" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="sadness" stroke="#C7F9CC" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="confusion" stroke="#FDE68A" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="anxiety" stroke="#FECACA" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Quick stats */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-sm text-muted-foreground">Average Joy</div>
                <div className="text-xl font-semibold text-primary">68%</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-sm text-muted-foreground">Average Calm</div>
                <div className="text-xl font-semibold text-secondary">74%</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-sm text-muted-foreground">Avg Sadness</div>
                <div className="text-xl font-semibold text-foreground">15%</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-sm text-muted-foreground">Avg Anxiety</div>
                <div className="text-xl font-semibold text-foreground">22%</div>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <aside className="bg-card rounded-2xl p-6 shadow-card flex flex-col gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-2">AI Insights</h4>
              <p className="text-sm text-muted-foreground">Based on recent trends, joy and calm are increasing while anxiety is trending down. Consider encouraging outdoor activities and familiar music sessions.</p>
            </div>

            <div>
              <h5 className="text-sm font-medium text-foreground mb-2">Suggested Actions</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span>Schedule a 15-min reminiscing session</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2" />
                  <span>Play familiar songs for 30 minutes</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-yellow-200 rounded-full mt-2" />
                  <span>Monitor sleep quality for next 7 days</span>
                </li>
              </ul>
            </div>

            <div>
              <MoodJar />
            </div>
          </aside>
        </div>

        {/* Bottom caregiver summary */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-card">
          <h4 className="text-lg font-semibold mb-2">Caregiver Summary</h4>
          <p className="text-sm text-muted-foreground">Over the past week, the patient shows improved calm and joy levels. Recommended caregiver actions: encourage social interaction and maintain consistent daily routine. See insights for personalized suggestions.</p>
        </div>
      </div>
    </div>
  );
}