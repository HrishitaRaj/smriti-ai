import { useState, useEffect } from "react";
import { StatCard } from "@/components/Statcard";
import { Heart, Smile, Activity, MapPin, Plus, Trash2 } from "lucide-react";
import { MoodMeter } from "@/components/MoodMeter";
import { EmotionChart } from "@/components/EmotionChart";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockEmotionDataDay = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  calm: Math.floor(Math.random() * 40) + 50,
  happy: Math.floor(Math.random() * 40) + 50,
  anxious: Math.floor(Math.random() * 30) + 10,
}));

const mockEmotionDataWeek = [
  { time: "Mon", calm: 65, happy: 70, anxious: 20 },
  { time: "Tue", calm: 70, happy: 75, anxious: 15 },
  { time: "Wed", calm: 60, happy: 65, anxious: 30 },
  { time: "Thu", calm: 75, happy: 80, anxious: 10 },
  { time: "Fri", calm: 80, happy: 85, anxious: 8 },
  { time: "Sat", calm: 78, happy: 82, anxious: 12 },
  { time: "Sun", calm: 72, happy: 78, anxious: 18 },
];

const mockEmotionDataMonth = Array.from({ length: 30 }, (_, i) => ({
  time: `Day ${i + 1}`,
  calm: Math.floor(Math.random() * 40) + 50,
  happy: Math.floor(Math.random() * 40) + 50,
  anxious: Math.floor(Math.random() * 30) + 10,
}));

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
  const [newTaskType, setNewTaskType] = useState<"medication" | "activity" | "emotional">("activity");
  const [emotionPeriod, setEmotionPeriod] = useState<"day" | "week" | "month">("week");

  // ---- Location ----
  const [location, setLocation] = useState("New Delhi, India");
  const [mapUrl, setMapUrl] = useState<string>(
    "https://www.openstreetmap.org/?mlat=28.6139&mlon=77.2090&zoom=12"
  );
  const [mapImage, setMapImage] = useState<string>(
    "https://staticmap.openstreetmap.de/staticmap.php?center=28.6139,77.2090&zoom=13&size=500x300&markers=28.6139,77.2090,red-pushpin"
  );

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const url = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15`;
        const img = `https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=15&size=500x300&markers=${latitude},${longitude},red-pushpin`;
        setMapUrl(url);
        setMapImage(img);

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
      () => {
        // Keep default map if denied
        setLocation("New Delhi, India (Default)");
      }
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
    emotionPeriod === "day" ? mockEmotionDataDay : emotionPeriod === "month" ? mockEmotionDataMonth : mockEmotionDataWeek;

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      {/* HEADER with Map */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Welcome back, Ms. Aditi Kashyap</h1>
        <p className="text-muted-foreground mb-4">Here's today's overview for your patient</p>

        {/* Map always visible */}
        <div className="mt-4">
          <a href={mapUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={mapImage}
              alt="Location map"
              className="w-full max-w-lg rounded-2xl border border-border shadow-md hover:shadow-lg hover:scale-[1.01] transition-transform"
            />
          </a>
          <p className="text-sm text-muted-foreground mt-2">
            📍 {location}
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Today's Mood" value="Calm" icon={Smile} trend="+12%" emotion="calm" />
        <StatCard title="Emotional Stability" value="72%" icon={Heart} trend="Stable" emotion="happy" />
        <StatCard title="Active Hours" value="6.5h" icon={Activity} trend="+0.5h" emotion="neutral" />
        <StatCard
          title="Location Status"
          value={
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="underline text-primary hover:text-primary/80 text-sm">
              {location}
            </a>
          }
          icon={MapPin}
          emotion="calm"
        />
      </div>

      {/* Emotion Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
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
            <EmotionChart data={getEmotionData()} period={emotionPeriod} />
          </div>
        </div>
        <MoodMeter stability={72} activities={emotionalActivities} />
      </div>

      {/* Tasks and Frequent Places */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Today's Tasks</h3>
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-all group mb-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleTaskToggle(task.id)}
                className="w-5 h-5 rounded border-2 border-primary cursor-pointer"
              />
              <div className="flex-1">
                <p className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
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
            <div key={i} className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors mb-2">
              <p className="font-semibold text-foreground">{place.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{place.address}</p>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary mt-2 inline-block">
                {place.visits} visits
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
