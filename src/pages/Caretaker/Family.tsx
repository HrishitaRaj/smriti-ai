import { useState } from "react";
import { Phone, Mail, TrendingUp, MessageSquare, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";


const mockContacts = [
  {
    id: "1",
    name: "Meera Sharma",
    relation: "Daughter",
    photo: "MS",
    phone: "+91 98765 43210",
    impact: "+25%",
    status: "Most responsive contact",
    hasChats: true,
  },
  {
    id: "2",
    name: "Dr. Rajesh Kumar",
    relation: "Primary Physician",
    photo: "RK",
    phone: "+91 98123 45678",
    impact: "+18%",
    status: "Weekly checkups",
    hasChats: false,
  },
  {
    id: "3",
    name: "Amit Sharma",
    relation: "Son",
    photo: "AS",
    phone: "+91 97654 32109",
    impact: "+15%",
    status: "Regular visitor",
    hasChats: true,
  },
  {
    id: "4",
    name: "Priya Patel",
    relation: "Home Nurse",
    photo: "PP",
    phone: "+91 96543 21098",
    impact: "+20%",
    status: "Daily care provider",
    hasChats: false,
  },
];

const Family = () => {
  const [contacts, setContacts] = useState(mockContacts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [newContact, setNewContact] = useState({
    name: "",
    relation: "",
    phone: "",
  });

  const handleAddContact = () => {
    if (newContact.name && newContact.relation && newContact.phone) {
      const contact = {
        id: Date.now().toString(),
        name: newContact.name,
        relation: newContact.relation,
        photo: newContact.name.split(" ").map(n => n[0]).join("").toUpperCase(),
        phone: newContact.phone,
        impact: "+0%",
        status: "New contact",
        hasChats: false,
      };
      setContacts([...contacts, contact]);
      setNewContact({ name: "", relation: "", phone: "" });
      setIsAddDialogOpen(false);
    }
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Family & Doctors</h1>
        <p className="text-muted-foreground">Care team with emotional impact metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
          >
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
            

            <div className="bg-muted rounded-xl p-3 mb-4">
              <p className="text-xs text-muted-foreground">Impact Score</p>
              <p className="text-sm font-medium text-foreground">{contact.status}</p>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 rounded-xl hover:opacity-90 transition-opacity">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">Call</span>
              </button>
              <button className="flex items-center justify-center bg-muted text-foreground p-2 rounded-xl hover:bg-muted/80 transition-colors">
                <Mail className="w-4 h-4" />
              </button>
                            {contact.hasChats && (
                <button 
                  onClick={() => setSelectedContact(contact.id)}
                  className="flex items-center justify-center bg-primary/10 text-primary p-2 rounded-xl hover:bg-primary/20 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

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
                onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
                placeholder="e.g., Daughter, Doctor, Nurse"
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
            <Button onClick={handleAddContact} className="w-full">Add Contact</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedContact !== null} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Chat with {contacts.find(c => c.id === selectedContact)?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted rounded-xl p-4 max-h-96 overflow-y-auto space-y-3">
              <div className="bg-primary/10 rounded-lg p-3 max-w-xs">
                <p className="text-sm">How is mom doing today?</p>
                <p className="text-xs text-muted-foreground mt-1">10:30 AM</p>
              </div>
              <div className="bg-card rounded-lg p-3 max-w-xs ml-auto">
                <p className="text-sm">She had a good morning! Very calm and happy during breakfast.</p>
                <p className="text-xs text-muted-foreground mt-1">10:45 AM</p>
              </div>
              <div className="bg-primary/10 rounded-lg p-3 max-w-xs">
                <p className="text-sm">That's wonderful to hear! I'll video call her this evening.</p>
                <p className="text-xs text-muted-foreground mt-1">11:00 AM</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Type a message..." />
              <Button>Send</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    
            
    </div>
  );
};

export default Family;
