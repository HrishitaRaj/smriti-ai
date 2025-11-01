import { useState } from "react";
import {
  Clock,
  Pill,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  CalendarDays,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

const baseMedications = [
  { id: "1", name: "Donepezil 10mg", frequency: 2, times: ["9:00 AM", "9:00 PM"] },
  { id: "2", name: "Memantine 5mg", frequency: 1, times: ["2:00 PM"] },
];

const baseRoutine = [
  { id: "1", time: "7:00 AM", activity: "🌅 Wake up & stretch" },
  { id: "2", time: "8:30 AM", activity: "🍞 Breakfast" },
  { id: "3", time: "10:00 AM", activity: "🚶‍♀️ Garden walk" },
  { id: "4", time: "5:00 PM", activity: "🎶 Music time" },
  { id: "5", time: "8:00 PM", activity: "📞 Family video call" },
];

const activityRadarData = [
  { category: "Exercise", level: 80 },
  { category: "Meals", level: 90 },
  { category: "Rest", level: 75 },
  { category: "Social", level: 60 },
  { category: "Therapy", level: 85 },
  { category: "Sleep", level: 70 },
];

const COLORS = ["#4CAF50", "#E0E0E0"];

const Alerts = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [medications, setMedications] = useState(
    baseMedications.map((m) => ({ ...m, taken: Array(m.frequency).fill(false) }))
  );
  const [routine, setRoutine] = useState(
    baseRoutine.map((r) => ({ ...r, completed: false }))
  );

  const [isAddMedOpen, setIsAddMedOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);

  const [newMed, setNewMed] = useState({
    name: "",
    frequency: 1,
    times: [""],
  });

  const [newActivity, setNewActivity] = useState({
    time: "",
    activity: "",
  });

  // Handle Date Change (resets for each new day)
  const handleDateChange = (e: any) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
    setMedications(
      baseMedications.map((m) => ({ ...m, taken: Array(m.frequency).fill(false) }))
    );
    setRoutine(baseRoutine.map((r) => ({ ...r, completed: false })));
    toast(`Showing data for ${format(newDate, "PPP")}`);
  };

  // Medication Actions
  const handleMarkTaken = (medId: string, index: number) => {
    setMedications((prev) =>
      prev.map((m) =>
        m.id === medId
          ? { ...m, taken: m.taken.map((t, i) => (i === index ? true : t)) }
          : m
      )
    );
  };

  const handleAddMedication = () => {
    if (!newMed.name || newMed.times.some((t) => !t)) {
      toast.error("Please fill all fields");
      return;
    }

    const med = {
      id: Date.now().toString(),
      name: newMed.name,
      frequency: newMed.times.length,
      times: newMed.times,
      taken: Array(newMed.times.length).fill(false),
    };

    setMedications([...medications, med]);
    setNewMed({ name: "", frequency: 1, times: [""] });
    setIsAddMedOpen(false);
    toast.success("Medication added!");
  };

  const handleDeleteMed = (id: string) => {
    setMedications(medications.filter((m) => m.id !== id));
    toast.success("Medication removed");
  };

  // Routine Actions
  const handleAddActivity = () => {
    if (newActivity.time && newActivity.activity) {
      setRoutine(
        [...routine, { id: Date.now().toString(), ...newActivity, completed: false }].sort((a, b) =>
          a.time.localeCompare(b.time)
        )
      );
      setNewActivity({ time: "", activity: "" });
      setIsAddActivityOpen(false);
      toast.success("Activity added!");
    } else {
      toast.error("Please fill all fields");
    }
  };

  const handleMarkCompleted = (id: string) => {
    setRoutine((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: true } : r))
    );
  };

  const handleDeleteActivity = (id: string) => {
    setRoutine(routine.filter((r) => r.id !== id));
    toast.success("Activity removed");
  };

  const adherence =
    Math.round(
      (medications.reduce((acc, m) => acc + m.taken.filter(Boolean).length, 0) /
        medications.reduce((acc, m) => acc + m.taken.length, 0)) *
        100
    ) || 0;

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">
          🧭 Daily Care Story Dashboard
        </h1>
        <p className="text-muted-foreground">
          A story-like tracker for medications, routines, and wellness progress
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Radar */}
        <div className="bg-card p-4 rounded-2xl border shadow-sm">
          <h3 className="font-semibold mb-2 flex items-center gap-2 text-foreground">
            <Activity className="w-4 h-4 text-primary" /> Weekly Balance
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={activityRadarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Activity"
                dataKey="level"
                stroke="#4F46E5"
                fill="#6366F1"
                fillOpacity={0.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie */}
        <div className="bg-card p-4 rounded-2xl border shadow-sm flex flex-col items-center justify-center">
          <h3 className="font-semibold mb-2 text-foreground flex items-center gap-2">
            <Pill className="w-4 h-4 text-primary" /> Medicine Adherence
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={[
                  { name: "Taken", value: adherence },
                  { name: "Missed", value: 100 - adherence },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={index} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-sm text-muted-foreground mt-1">
            {adherence}% doses taken
          </p>
        </div>

        {/* Calendar */}
        <div className="bg-card p-4 rounded-2xl border shadow-sm flex flex-col justify-center">
          <h3 className="font-semibold mb-2 text-foreground flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" /> Select Day
          </h3>
          <Input
            type="date"
            value={format(selectedDate, "yyyy-MM-dd")}
            onChange={handleDateChange}
          />
          <p className="text-sm text-muted-foreground mt-2">
            Viewing: {format(selectedDate, "PPP")}
          </p>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MEDICATIONS */}
        <div className="bg-card rounded-2xl p-6 border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
              <Pill className="w-5 h-5 text-primary" /> Medications
            </h3>

            {/* Add Medication Button */}
            <Dialog open={isAddMedOpen} onOpenChange={setIsAddMedOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1">
                  <Plus className="w-4 h-4" /> Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Medication</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>Medication Name</Label>
                    <Input
                      placeholder="e.g., Donepezil 10mg"
                      value={newMed.name}
                      onChange={(e) =>
                        setNewMed((prev) => ({ ...prev, name: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Dosage Times</Label>
                    {newMed.times.map((time, index) => (
                      <Input
                        key={index}
                        type="time"
                        value={time}
                        onChange={(e) =>
                          setNewMed((prev) => {
                            const updated = [...prev.times];
                            updated[index] = e.target.value;
                            return { ...prev, times: updated };
                          })
                        }
                        className="mt-2"
                      />
                    ))}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setNewMed((prev) => ({
                          ...prev,
                          times: [...prev.times, ""],
                        }))
                      }
                      className="mt-2"
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Time
                    </Button>
                  </div>
                  <Button onClick={handleAddMedication} className="w-full mt-2">
                    <Plus className="w-4 h-4 mr-2" /> Add Medication
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {medications.map((med) => (
            <div key={med.id} className="bg-muted/50 rounded-xl p-4 mb-3">
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium">{med.name}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteMed(med.id)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              {med.times.map((time, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center text-sm py-1 px-2 rounded-lg bg-card/70 mb-1"
                >
                  <span>{time}</span>
                  {med.taken[i] ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Done
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleMarkTaken(med.id, i)}
                      className="text-blue-600 gap-1"
                    >
                      <XCircle className="w-4 h-4" /> Mark Taken
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ROUTINE */}
        <div className="bg-card rounded-2xl p-6 border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
              <Clock className="w-5 h-5 text-primary" /> Daily Storyline
            </h3>

            {/* Add Activity */}
            <Dialog open={isAddActivityOpen} onOpenChange={setIsAddActivityOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1">
                  <Plus className="w-4 h-4" /> Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Activity</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>Activity</Label>
                    <Input
                      placeholder="e.g., 🌻 Gardening"
                      value={newActivity.activity}
                      onChange={(e) =>
                        setNewActivity((prev) => ({
                          ...prev,
                          activity: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={newActivity.time}
                      onChange={(e) =>
                        setNewActivity((prev) => ({
                          ...prev,
                          time: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <Button onClick={handleAddActivity} className="w-full mt-2">
                    <Plus className="w-4 h-4 mr-2" /> Add Activity
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Routine List */}
          <div className="relative space-y-4 border-l-2 border-primary/30 pl-4 max-h-[500px] overflow-y-auto">
            {routine.map((item) => (
              <div key={item.id} className="flex items-start gap-3 relative group">
                <div
                  className={`w-3 h-3 rounded-full mt-2 ${
                    item.completed ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
                <div className="bg-muted/40 rounded-xl p-3 flex-1">
                  <p className="text-sm font-semibold">{item.activity}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.time}
                  </p>

                  {!item.completed ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkCompleted(item.id)}
                      className="mt-2 text-xs"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Mark Completed
                    </Button>
                  ) : (
                    <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Done
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteActivity(item.id)}
                  className="opacity-0 group-hover:opacity-100 text-destructive absolute right-0 top-0"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
