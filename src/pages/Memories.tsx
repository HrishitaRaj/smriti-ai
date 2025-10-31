import React, { useEffect, useMemo, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { formatDistanceToNow, parseISO, isValid } from "date-fns";

type MemoryEntry = {
  text: string;
  timestamp: string; // ISO string
};

const formatDay = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString();
};

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const Memories = () => {
  const [loading, setLoading] = useState(false);
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [addingText, setAddingText] = useState("");
  const [addingDate, setAddingDate] = useState<string | null>(null);
  const [addingTime, setAddingTime] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/memories");
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Status ${res.status}: ${text}`);
      }
      const data = await res.json();
      if (data.memories) {
        setMemories(data.memories as MemoryEntry[]);
        // also cache locally
        try {
          localStorage.setItem("smriti_local_memories", JSON.stringify(data.memories));
        } catch (e) {
          // ignore
        }
      }
    } catch (err) {
      console.error("Failed to load memories", err);
      setError(String(err));
      // try local fallback
      try {
        const raw = localStorage.getItem("smriti_local_memories");
        if (raw) setMemories(JSON.parse(raw) as MemoryEntry[]);
      } catch (e) {
        // ignore
      }
    } finally {
      setLoading(false);
    }
  };

  const grouped = useMemo(() => {
    const map = new Map<string, MemoryEntry[]>();
    const list = memories
      .filter((m) => m.text && m.timestamp)
      .filter((m) => m.text.toLowerCase().includes(q.trim().toLowerCase()))
      .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)); // newest first

    for (const m of list) {
      const day = formatDay(m.timestamp);
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(m);
    }
    return Array.from(map.entries()); // [ [day, entries], ... ]
  }, [memories, q]);

  const totalCount = memories.length;

  const toggleDay = (day: string) => {
    setExpandedDays((s) => ({ ...s, [day]: !s[day] }));
  };

  const exportJSON = () => {
    const data = JSON.stringify(memories, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `memories-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const saveLocalCache = (entries: MemoryEntry[]) => {
    try {
      localStorage.setItem("smriti_local_memories", JSON.stringify(entries));
    } catch (e) {
      // ignore
    }
  };

  const removeFromLocalCache = (ts: string, text: string) => {
    try {
      const raw = localStorage.getItem("smriti_local_memories");
      if (!raw) return;
      const arr: MemoryEntry[] = JSON.parse(raw);
      const filtered = arr.filter((m) => !(m.timestamp === ts && m.text === text));
      localStorage.setItem("smriti_local_memories", JSON.stringify(filtered));
      setMemories((m) => m.filter((it) => !(it.timestamp === ts && it.text === text)));
      setMessage("Memory removed from local cache");
      setTimeout(() => setMessage(null), 2500);
    } catch (e) {
      // ignore
    }
  };

  const toLocalISOString = (dateStr: string, timeStr?: string | null) => {
    // dateStr in format YYYY-MM-DD, timeStr in HH:MM
    const parts = dateStr.split("-");
    const y = Number(parts[0]);
    const m = Number(parts[1]) - 1;
    const d = Number(parts[2]);
    let hh = 0;
    let mm = 0;
    if (timeStr) {
      const tparts = timeStr.split(":");
      hh = Number(tparts[0] || 0);
      mm = Number(tparts[1] || 0);
    }
    const dt = new Date(y, m, d, hh, mm, 0, 0);
    return dt.toISOString();
  };

  const addMemoryManually = async () => {
    if (!addingText.trim()) return;
    const timestamp = addingDate ? toLocalISOString(addingDate, addingTime) : new Date().toISOString();
    try {
      await fetch("http://localhost:8000/add-memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: addingText, timestamp }),
      });
      const next = [{ text: addingText, timestamp }, ...memories];
      setMemories(next);
      saveLocalCache(next);
      setAddingText("");
      setAddingDate(null);
      setAddingTime(null);
      setShowAddModal(false);
      setMessage("Memory added");
      setTimeout(() => setMessage(null), 2000);
    } catch (e) {
      setMessage("Failed to add memory to server — saved locally");
      // still save locally as fallback
      const next = [{ text: addingText, timestamp }, ...memories];
      setMemories(next);
      saveLocalCache(next);
      setAddingText("");
      setAddingDate(null);
      setAddingTime(null);
      setShowAddModal(false);
      setTimeout(() => setMessage(null), 2500);
    }
  };

  const deleteMemory = (m: MemoryEntry) => {
    // remove only from local cache/UI; server is in-memory and may still have it
    removeFromLocalCache(m.timestamp, m.text);
  };

  return (
    <div className="min-h-screen pt-24 pb-10 px-6 bg-gradient-to-b from-white to-[#fdf6ff]">
      <Navigation />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#c800ff]">Memory Timeline</h1>
              <p className="text-sm text-gray-600">All saved memories, grouped by day.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-700">Total: <span className="font-semibold">{totalCount}</span></div>
              <button onClick={exportJSON} className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200">Export</button>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <input
              placeholder="Filter memories..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full sm:max-w-md px-3 py-2 rounded-full border focus:ring-2 focus:ring-[#c800ff]"
            />

            <div className="w-full sm:w-auto flex gap-2 items-center">
              <Button onClick={() => setShowAddModal(true)} className="px-4 py-2">Add Memory</Button>
              <button onClick={exportJSON} className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200">Export</button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {loading && <div className="text-center text-gray-500">Loading...</div>}
          {error && (
            <div className="text-center text-red-600 text-sm">Unable to fetch from server: {error}</div>
          )}

          {!loading && grouped.length === 0 && (
            <div className="text-center text-gray-500">No memories found.</div>
          )}

          {grouped.map(([day, entries]) => (
            <section key={day}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-[#5e3023]">{day}</h3>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-600">{entries.length} item(s)</div>
                  <button onClick={() => toggleDay(day)} className="px-2 py-1 text-xs rounded bg-gray-100">{expandedDays[day] ? "Collapse" : "Expand"}</button>
                </div>
              </div>

              <div className="relative pl-6">
                {/* vertical line */}
                <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200" />

                <div className="space-y-4">
                  {(expandedDays[day] === false ? entries.slice(0, 3) : entries).map((e, idx) => (
                    <motion.div
                      key={e.timestamp + idx}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.04 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-tr from-[#de67ff] to-[#c800ff] mt-2 shadow" />
                        <Card className="flex-1 p-4 bg-white/90">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <div className="text-sm text-gray-800">{e.text}</div>
                              <div className="text-xs text-gray-500 mt-1">{formatDistanceToNow(parseISO(e.timestamp), { addSuffix: true })}</div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="text-xs text-gray-500 ml-4">{formatTime(e.timestamp)}</div>
                              <button onClick={() => deleteMemory(e)} className="text-xs text-red-600 mt-2">Delete</button>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Add Memory Modal */}
        <Dialog open={showAddModal} onOpenChange={(open) => setShowAddModal(open)}>
          <DialogContent className="max-w-lg rounded-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Add Memory</DialogTitle>
            </DialogHeader>

            <div className="mt-2 space-y-3">
              <label className="block text-sm">Memory text</label>
              <textarea
                rows={3}
                value={addingText}
                onChange={(e) => setAddingText(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="Write what happened..."
              />

              <div className="flex gap-2">
                <div>
                  <label className="block text-sm">Date</label>
                  <input type="date" value={addingDate ?? ""} onChange={(e) => setAddingDate(e.target.value ? e.target.value : null)} className="border rounded px-2 py-1" />
                </div>

                <div>
                  <label className="block text-sm">Time</label>
                  <input type="time" value={addingTime ?? ""} onChange={(e) => setAddingTime(e.target.value ? e.target.value : null)} className="border rounded px-2 py-1" />
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button onClick={addMemoryManually} className="bg-gradient-to-r from-[#de67ff] to-[#c800ff] text-white">Save</Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="mt-8 text-center">
          <button
            className="px-4 py-2 rounded-md bg-gradient-to-r from-[#de67ff] to-[#c800ff] text-white"
            onClick={fetchMemories}
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default Memories;
