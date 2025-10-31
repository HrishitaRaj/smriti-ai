import React, { useMemo, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { PlusCircle, Pill, Activity, Trash2, CheckCircle2 } from "lucide-react";

type Reminder = {
  id: string;
  text: string;
  type: "activity" | "medication";
  time?: string | null;
  recurrence?: "daily" | "once";
  completed: boolean;
  createdAt: string;
};

const STORAGE_KEY = "smriti_reminders";

const MOCK_REMINDERS: Reminder[] = [
  {
    id: "mock-1",
    text: "Morning stretch",
    type: "activity",
    time: "08:00",
    recurrence: "daily",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "mock-2",
    text: "Take blood pressure medication",
    type: "medication",
    time: "09:00",
    recurrence: "daily",
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return MOCK_REMINDERS;
  });

  const [showAdd, setShowAdd] = useState(false);
  const [text, setText] = useState("");
  const [type, setType] = useState<"activity" | "medication">("activity");
  const [time, setTime] = useState<string | null>(null);
  const [recurrence, setRecurrence] = useState<"daily" | "once">("daily");

  const save = (next: Reminder[]) => {
    setReminders(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addReminder = () => {
    if (!text.trim()) return;
    const newR: Reminder = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text: text.trim(),
      type,
      time: time || null,
      recurrence,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const next = [newR, ...reminders];
    save(next);
    setText("");
    setTime(null);
    setType("activity");
    setRecurrence("daily");
    setShowAdd(false);
  };

  const toggleCompleted = (id: string) => {
    const next = reminders.map((r) =>
      r.id === id ? { ...r, completed: !r.completed } : r
    );
    save(next);
  };

  const remove = (id: string) => save(reminders.filter((r) => r.id !== id));

  const grouped = useMemo(() => {
    const sorted = [...reminders].sort((a, b) => (a.time || "").localeCompare(b.time || ""));
    return {
      activity: sorted.filter((r) => r.type === "activity"),
      medication: sorted.filter((r) => r.type === "medication"),
    };
  }, [reminders]);

  const renderList = (list: Reminder[], icon: JSX.Element, label: string) => (
    <section>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="text-lg font-semibold">{label}</h3>
      </div>
      <div className="space-y-3">
        {list.length === 0 && (
          <div className="text-sm text-gray-500">No {label.toLowerCase()} reminders.</div>
        )}
        {list.map((r) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`transition border rounded-xl p-4 flex justify-between items-center shadow-sm ${
              r.completed ? "bg-gray-100" : "bg-white hover:bg-gray-50"
            }`}
          >
            <div>
              <div className={`font-medium ${r.completed ? "line-through text-gray-500" : ""}`}>
                {r.text}
              </div>
              <div className="text-xs text-gray-500">
                {r.recurrence} {r.time ? `• ${r.time}` : ""}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Added {format(new Date(r.createdAt), "dd/MM/yyyy HH:mm")}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <label className="text-sm flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={r.completed}
                  onChange={() => toggleCompleted(r.id)}
                  className="cursor-pointer"
                />
                <span className="text-sm">{r.completed ? "Done" : "Mark Done"}</span>
              </label>
              <button
                className="text-xs text-red-600 flex items-center gap-1 hover:underline"
                onClick={() => remove(r.id)}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen pt-24 pb-10 px-6 bg-gradient-to-b from-[#fffaff] to-[#f7ecff]">
      <Navigation />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#de67ff] to-[#c800ff] bg-clip-text text-transparent">
              Reminders
            </h1>
            <p className="text-sm text-gray-600">
              Manage your daily activities and medications easily.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowAdd(true)}
              className="bg-gradient-to-r from-[#de67ff] to-[#c800ff] text-white flex items-center gap-2"
            >
              <PlusCircle size={18} /> Add
            </Button>
            <Button
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY);
                setReminders([]);
              }}
              variant="outline"
            >
              Clear All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {renderList(grouped.activity, <Activity className="text-[#c800ff]" />, "Activities")}
          {renderList(grouped.medication, <Pill className="text-[#c800ff]" />, "Medications")}
        </div>

        {/* Add modal */}
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogContent className="max-w-md rounded-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-[#c800ff]">
                Add Reminder
              </DialogTitle>
            </DialogHeader>

            <div className="mt-3 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Text</label>
                <input
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#c800ff]/40"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="e.g., Take morning pills"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full border rounded-lg p-2"
                  >
                    <option value="activity">Activity</option>
                    <option value="medication">Medication</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input
                    type="time"
                    value={time ?? ""}
                    onChange={(e) => setTime(e.target.value || null)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Recurrence</label>
                  <select
                    value={recurrence}
                    onChange={(e) => setRecurrence(e.target.value as any)}
                    className="w-full border rounded-lg p-2"
                  >
                    <option value="daily">Daily</option>
                    <option value="once">Once</option>
                  </select>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
              <Button
                onClick={addReminder}
                className="bg-gradient-to-r from-[#de67ff] to-[#c800ff] text-white"
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Reminders;
