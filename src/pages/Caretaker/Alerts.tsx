import { useState } from "react";
import { Clock, Pill, Activity, Heart, Send, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const mockMedications = [
  { id: "1", name: "Donepezil 10mg", time: "9:00 AM", taken: true },
  { id: "2", name: "Memantine 5mg", time: "2:00 PM", taken: false },
  { id: "3", name: "Vitamin D", time: "6:00 PM", taken: false },
  { id: "4", name: "Omega-3", time: "9:00 PM", taken: false },
];

const mockRoutine = [
  { id: "1", time: "7:00 AM", activity: "Wake up & morning exercise", icon: Activity, completed: true },
  { id: "2", time: "8:00 AM", activity: "Breakfast", icon: Activity, completed: true },
  { id: "3", time: "9:00 AM", activity: "Morning medication", icon: Pill, completed: true },
  { id: "4", time: "10:30 AM", activity: "Temple garden walk", icon: Activity, completed: false },
  { id: "5", time: "12:00 PM", activity: "Lunch", icon: Activity, completed: false },
  { id: "6", time: "2:00 PM", activity: "Afternoon medication", icon: Pill, completed: false },
  { id: "7", time: "3:00 PM", activity: "Music time (Lata Mangeshkar)", icon: Activity, completed: false },
  { id: "8", time: "5:00 PM", activity: "Evening walk", icon: Activity, completed: false },
  { id: "9", time: "6:00 PM", activity: "Evening medication", icon: Pill, completed: false },
  { id: "10", time: "7:00 PM", activity: "Dinner", icon: Activity, completed: false },
  { id: "11", time: "8:00 PM", activity: "Family video call", icon: Activity, completed: false },
  { id: "12", time: "9:00 PM", activity: "Night medication", icon: Pill, completed: false },
  { id: "13", time: "10:00 PM", activity: "Bedtime routine", icon: Activity, completed: false },
];

const Alerts = () => {
  const [medications, setMedications] = useState(mockMedications);
  const [routine, setRoutine] = useState(mockRoutine);
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [newMed, setNewMed] = useState({ name: "", time: "" });
  const [newActivity, setNewActivity] = useState({ time: "", activity: "" });

  const handleSendReminder = (type: string, item: string) => {
    toast.success(`Reminder sent to patient: ${item}`);
  };

  const handleAddMedication = () => {
    if (newMed.name && newMed.time) {
      setMedications([...medications, {
        id: Date.now().toString(),
        name: newMed.name,
        time: newMed.time,
        taken: false,
      }]);
      setNewMed({ name: "", time: "" });
      setIsAddMedOpen(false);
      toast.success("Medication added successfully");
    }
  };

  const handleAddActivity = () => {
    if (newActivity.time && newActivity.activity) {
      setRoutine([...routine, {
        id: Date.now().toString(),
        time: newActivity.time,
        activity: newActivity.activity,
        icon: Activity,
        completed: false,
      }].sort((a, b) => a.time.localeCompare(b.time)));
      setNewActivity({ time: "", activity: "" });
      setIsAddActivityOpen(false);
      toast.success("Activity added successfully");
    }
  };

  const handleDeleteMed = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
    toast.success("Medication removed");
  };

  const handleDeleteActivity = (id: string) => {
    setRoutine(routine.filter(r => r.id !== id));
    toast.success("Activity removed");
  };


  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Alerts & Reminders</h1>
        <p className="text-muted-foreground">Manage medications and daily routine</p>
      </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Pill className="w-5 h-5 text-primary" />
              Medications
            </h3>
            <Dialog open={isAddMedOpen} onOpenChange={setIsAddMedOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Medication</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="med-name">Medication Name</Label>
                    <Input
                      id="med-name"
                      value={newMed.name}
                      onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                      placeholder="e.g., Donepezil 10mg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="med-time">Time</Label>
                    <Input
                      id="med-time"
                      type="time"
                      value={newMed.time}
                      onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddMedication} className="w-full">Add Medication</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-3">
            {medications.map((med) => (
              <div
                key={med.id}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${med.taken ? "bg-green-100" : "bg-blue-100"}`}>
                    <Pill className={`w-4 h-4 ${med.taken ? "text-green-600" : "text-blue-600"}`} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{med.name}</p>
                    <p className="text-sm text-muted-foreground">{med.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSendReminder("medication", med.name)}
                    className="gap-1"
                  >
                    <Send className="w-3 h-3" />
                    Send
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteMed(med.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Daily Routine
            </h3>
            <Dialog open={isAddActivityOpen} onOpenChange={setIsAddActivityOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Activity</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="activity-time">Time</Label>
                    <Input
                      id="activity-time"
                      type="time"
                      value={newActivity.time}
                      onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="activity-name">Activity</Label>
                    <Input
                      id="activity-name"
                      value={newActivity.activity}
                      onChange={(e) => setNewActivity({ ...newActivity, activity: e.target.value })}
                      placeholder="e.g., Morning walk"
                    />
                  </div>
                  <Button onClick={handleAddActivity} className="w-full">Add Activity</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {routine.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${item.completed ? "bg-green-100" : "bg-muted"}`}>
                    <item.icon className={`w-4 h-4 ${item.completed ? "text-green-600" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.time}</p>
                    <p className="text-xs text-muted-foreground">{item.activity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSendReminder("activity", item.activity)}
                    className="gap-1"
                  >
                    <Send className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteActivity(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
        
      <div className="flex items-center gap-3 mb-4">
          <Heart className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Recent Alerts</h3>
        </div>
        <div className="space-y-3">
          <div className="bg-card/50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">⚠️ Slight anxiety detected</p>
                <p className="text-xs text-muted-foreground">Today, 11:30 AM</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                Monitor
              </span>
            </div>
          </div>
          <div className="bg-card/50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">✓ Medication taken on time</p>
                <p className="text-xs text-muted-foreground">Today, 9:00 AM</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                Completed
              </span>
            </div>
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default Alerts;
