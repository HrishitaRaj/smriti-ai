import { useState, useEffect } from "react";
import { StatCard } from "@/components/Statcard";
import { Heart, Smile, Activity, MapPin, Plus, Trash2, X } from "lucide-react";
import { CTEmotionChart } from "@/components/CTEmotionChart";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Emotion Mock Data ---
const emotionColors = {
  happy: "#60a5fa",
  calm: "#22c55e",
  anxious: "#ef4444",
  angry: "#b91c1c",
  excited: "#facc15",
  neutral: "#a3a3a3",
  sad: "#3b82f6",
};

const emotions = Object.keys(emotionColors) as Array<keyof typeof emotionColors>;

const generateEmotionData = (points: number, labelPrefix: string) => {
  return Array.from({ length: points }, (_, i) => {
    const dataPoint: any = { time: `${labelPrefix} ${i + 1}` };
    emotions.forEach((emotion) => {
      dataPoint[emotion] = Math.floor(Math.random() * 100);
    });
    return dataPoint;
  });
};

const mockEmotionDataDay = generateEmotionData(24, "Hour");
const mockEmotionDataWeek = generateEmotionData(7, "Day");
const mockEmotionDataMonth = generateEmotionData(10, "Day");

const mockTasks = [
  { id: "1", title: "Morning medication - 9:00 AM", completed: true, type: "medication" as const },
  { id: "2", title: "Afternoon walk in the garden", completed: true, type: "activity" as const },
  { id: "3", title: "Evening medication - 6:00 PM", completed: false, type: "medication" as const },
  { id: "4", title: "Video call with Meera", completed: false, type: "activity" as const },
  { id: "5", title: "Check emotional state", completed: false, type: "emotional" as const },
];

const frequentPlaces = [
  { name: "Home", address: "A-204, Green Valley Apartments, Sector 12, Gurugram, Haryana - 122001", visits: 95 },
  { name: "Temple Garden", address: "Laxmi Narayan Temple, Main Road, Sector 15, Gurugram - 122001", visits: 45 },
  { name: "Dr. Kumar's Clinic", address: "Mediplus Clinic, Shop 5, DLF Phase 2, Gurugram - 122002", visits: 12 },
  { name: "Daughter's House", address: "B-501, Silver Oak Residency, Sector 18, Gurugram - 122015", visits: 30 },
];

const emotionalActivities = {
  happy: ["Evening walks in temple garden", "Video calls with Meera", "Listening to Lata Mangeshkar", "Family gatherings"],
  sad: ["Missed medication reminders", "Rainy weather days", "Being alone in the afternoon"],
};

const Dashboard = () => {
  const [tasks, setTasks] = useState(mockTasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskType, setNewTaskType] =
    useState<"medication" | "activity" | "emotional">("activity");
  const [emotionPeriod, setEmotionPeriod] =
    useState<"day" | "week" | "month">("week");

  // ---- Location ----
  const [location, setLocation] = useState("New Delhi, India");
  const [lat, setLat] = useState(28.6139);
  const [lon, setLon] = useState(77.2090);
  const [showFullMap, setShowFullMap] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLat(latitude);
        setLon(longitude);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          setLocation(data.display_name || "Unknown location");
        } catch {
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
      },
      () => setLocation("New Delhi, India (Default)")
    );
  }, []);

  const handleTaskToggle = (id: string) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      setTasks([
        ...tasks,
        { id: Date.now().toString(), title: newTaskTitle, completed: false, type: newTaskType },
      ]);
      setNewTaskTitle("");
    }
  };

  const handleDeleteTask = (id: string) => setTasks(tasks.filter((t) => t.id !== id));

  const getEmotionData = () =>
    emotionPeriod === "day"
      ? mockEmotionDataDay
      : emotionPeriod === "month"
      ? mockEmotionDataMonth
      : mockEmotionDataWeek;

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">
          Welcome back, Ms. Aditi Kashyap
        </h1>
        <p className="text-muted-foreground mb-4">
          Here's today's overview for your patient
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Today's Mood" value="Calm" icon={Smile} trend="+12%" emotion="calm" />
        <StatCard title="Emotional Stability" value="72% Stable" icon={Heart} trend="Stable" emotion="happy" />
        <StatCard title="Active Hours" value="6.5h" icon={Activity} trend="+0.5h" emotion="neutral" />
        <StatCard
          title="Current Location"
          value={
            <div className="flex flex-col gap-2 w-full">
              <p className="text-sm text-muted-foreground truncate">{location}</p>
              <div
                onClick={() => setShowFullMap(true)}
                className="relative cursor-pointer group"
              >
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.01},${lat - 0.01},${lon + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lon}`}
                  className="w-full h-[180px] rounded-xl border border-border shadow-sm group-hover:opacity-90 transition-all"
                  loading="lazy"
                ></iframe>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm font-medium transition-all rounded-xl">
                  Click to view full map
                </div>
              </div>
            </div>
          }
          icon={MapPin}
          emotion="calm"
        />
      </div>

      {/* Happy / Sad Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-green-600 mb-3">What Made Them Happy</h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {emotionalActivities.happy.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-red-600 mb-3">What Made Them Sad</h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {emotionalActivities.sad.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Emotion Trends + Graph Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Emotion Chart */}
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Emotion Trends</h3>
            <Select value={emotionPeriod} onValueChange={(v: any) => setEmotionPeriod(v)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Daily</SelectItem>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CTEmotionChart data={getEmotionData()} period={emotionPeriod} />
        </div>

        {/* ✅ Graph Insights Panel */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-primary mb-4">Graph Insights</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>😊 Happiness levels peaked on <b>Day 5</b> this week.</li>
            <li>😟 Anxiety slightly increased during evening hours.</li>
            <li>💪 Calmness maintained above 60% for most of the week.</li>
            <li>❤️ Emotional consistency improved compared to last week.</li>
            <li>⚡ Excitement spikes correlate with social interactions.</li>
          </ul>
        </div>
      </div>

      {/* Tasks and Frequent Places */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Today's Tasks</h3>
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-all group mb-2"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleTaskToggle(task.id)}
                className="w-5 h-5 rounded border-2 border-primary cursor-pointer"
              />
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    task.completed ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {task.title}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}

          <div className="mt-4 pt-4 border-t border-border space-y-3">
            <Input
              placeholder="Add new task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            />
            <div className="flex gap-2">
              <Select value={newTaskType} onValueChange={(v: any) => setNewTaskType(v)}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medication">💊 Medication</SelectItem>
                  <SelectItem value="activity">🎯 Activity</SelectItem>
                  <SelectItem value="emotional">⚠️ Emotional</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddTask} className="gap-2">
                <Plus className="w-4 h-4" /> Add
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {tasks.filter((t) => t.completed).length} of {tasks.length} tasks completed
            </p>
          </div>
        </div>

        {/* Frequent Places */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" /> Frequent Places
          </h3>
          {frequentPlaces.map((place, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors mb-2"
            >
              <p className="font-semibold text-foreground">{place.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{place.address}</p>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary mt-2 inline-block">
                {place.visits} visits
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 🌍 Full Map Modal */}
      {showFullMap && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="relative bg-card rounded-2xl shadow-xl border border-border w-[90%] h-[80%] overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 z-10 bg-white/70 hover:bg-white"
              onClick={() => setShowFullMap(false)}
            >
              <X className="w-5 h-5 text-black" />
            </Button>
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.02},${lat - 0.02},${lon + 0.02},${lat + 0.02}&layer=mapnik&marker=${lat},${lon}`}
              className="w-full h-full rounded-2xl"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
