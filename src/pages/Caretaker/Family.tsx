import { useState } from "react";
import { Phone, Mail, TrendingUp, Bell, Plus, Trash2, CheckCircle2 } from "lucide-react";
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

const mockContacts = [
  {
    id: "1",
    name: "Meera Sharma",
    relation: "Daughter",
    photo: "MS",
    phone: "+91 98765 43210",
    impact: "+25%",
    status: "Daily emotional support",
    currentMeeting: "Visiting patient today at 6:00 PM 🩵",
    todos: ["Bring patient’s favorite meal", "Check emotional chart"],
  },
  {
    id: "2",
    name: "Dr. Rajesh Kumar",
    relation: "Primary Physician",
    photo: "RK",
    phone: "+91 98123 45678",
    impact: "+18%",
    status: "Weekly medical review",
    currentMeeting: "Check-up scheduled at 10:00 AM 🩺",
    todos: ["Review medication list", "Update health record"],
  },
];

const Family = () => {
  const [contacts, setContacts] = useState(mockContacts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", relation: "", phone: "" });
  const [newTodo, setNewTodo] = useState<Record<string, string>>({});

  const handleAddContact = () => {
    if (newContact.name && newContact.relation && newContact.phone) {
      const contact = {
        id: Date.now().toString(),
        name: newContact.name,
        relation: newContact.relation,
        photo: newContact.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase(),
        phone: newContact.phone,
        impact: "+0%",
        status: "Newly added contact",
        currentMeeting: "No scheduled meetings",
        todos: [],
      };
      setContacts([...contacts, contact]);
      setNewContact({ name: "", relation: "", phone: "" });
      setIsAddDialogOpen(false);
    }
  };

  const handleAddTodo = (id: string) => {
    const text = newTodo[id]?.trim();
    if (!text) return;

    setContacts((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, todos: [...c.todos, text] } : c
      )
    );
    setNewTodo((prev) => ({ ...prev, [id]: "" }));
  };

  const handleDeleteTodo = (id: string, index: number) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, todos: c.todos.filter((_, i) => i !== index) }
          : c
      )
    );
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Family & Care Network</h1>
        <p className="text-muted-foreground">
          Overview of family members, doctors, and emotional support contacts
        </p>
      </div>

      {/* CONTACT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
          >
            {/* Contact Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
                {contact.photo}
              </div>
              <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                <TrendingUp className="w-3 h-3" />
                {contact.impact}
              </div>
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-1">{contact.name}</h3>
            <p className="text-sm text-muted-foreground mb-1">{contact.relation}</p>
            <p className="text-xs text-muted-foreground mb-3">{contact.phone}</p>

            {/* Impact Card */}
            <div className="bg-muted rounded-xl p-3 mb-3">
              <p className="text-xs text-muted-foreground">Impact</p>
              <p className="text-sm font-medium text-foreground">{contact.status}</p>
            </div>

            {/* Current Meeting */}
            <div
              className={`flex items-center gap-2 text-xs px-3 py-2 rounded-xl ${
                contact.currentMeeting.includes("No active")
                  ? "bg-muted text-muted-foreground"
                  : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>{contact.currentMeeting}</span>
            </div>

            {/* Todo Section */}
            <div className="mt-4 bg-muted/50 p-3 rounded-xl">
              <h4 className="text-sm font-semibold mb-2 text-foreground">To-Do List</h4>
              <ul className="space-y-1 mb-2">
                {contact.todos.length > 0 ? (
                  contact.todos.map((todo, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-center bg-card px-3 py-1 rounded-lg text-xs"
                    >
                      <span>{todo}</span>
                      <button
                        onClick={() => handleDeleteTodo(contact.id, i)}
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </li>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    No activities yet
                  </p>
                )}
              </ul>

              <div className="flex gap-2">
                <Input
                  placeholder="Add activity..."
                  value={newTodo[contact.id] || ""}
                  onChange={(e) =>
                    setNewTodo((prev) => ({ ...prev, [contact.id]: e.target.value }))
                  }
                  className="h-8 text-xs"
                />
                <Button
                  size="sm"
                  onClick={() => handleAddTodo(contact.id)}
                  className="h-8 px-3"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mt-4">
              <button className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 rounded-xl hover:opacity-90 transition-opacity">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">Call</span>
              </button>
              <button className="flex items-center justify-center bg-muted text-foreground p-2 rounded-xl hover:bg-muted/80 transition-colors">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD NEW CONTACT */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-2xl font-medium transition-colors flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Contact
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                placeholder="Enter name"
              />
            </div>
            <div>
              <Label htmlFor="relation">Relation</Label>
              <Input
                id="relation"
                value={newContact.relation}
                onChange={(e) =>
                  setNewContact({ ...newContact, relation: e.target.value })
                }
                placeholder="e.g., Daughter, Doctor, Friend"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
            <Button onClick={handleAddContact} className="w-full">
              Add Contact
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Family;
