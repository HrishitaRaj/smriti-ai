import { useState } from "react";
import {
  User,
  Heart,
  Music,
  Coffee,
  Users as UsersIcon,
  MapPin,
  Phone,
  Mail,
  Droplet,
  Activity,
  Download,
  Plus,
  Trash2,
  CalendarDays,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import jsPDF from "jspdf";

const patientInfo = {
  name: "Mrs. Lakshmi Sharma",
  age: 72,
  diagnosis: "Early Stage Alzheimer's",
  since: "March 2023",
  bloodGroup: "B+",
  address: "A-204, Green Valley Apartments, Sector 12, Gurugram, Haryana - 122001",
  phone: "+91 98765 00000",
  email: "lakshmi.sharma@email.com",
  emergencyContact: "Meera Sharma (Daughter) - +91 98765 43210",
  height: "155 cm",
  weight: "58 kg",
  allergies: "Penicillin, Peanuts",
  chronicConditions: "Hypertension, Type 2 Diabetes",
};

const initialFavorites = [
  { icon: Music, label: "Favorite Music", value: "Classical Indian, Lata Mangeshkar" },
  { icon: Coffee, label: "Favorite Foods", value: "Masala chai, khichdi, mango lassi" },
  { icon: UsersIcon, label: "Closest To", value: "Daughter Meera, Grandson Arjun" },
  { icon: MapPin, label: "Favorite Places", value: "Temple garden, home balcony" },
  { icon: Heart, label: "Hobbies", value: "Gardening, listening to old songs" },
  { icon: Activity, label: "Best Time of Day", value: "Morning walks, evening video calls" },
];

const initialMedicalHistory = [
  { date: "Jan 2025", event: "Regular checkup - BP stable", doctor: "Dr. Mehta" },
  { date: "Dec 2024", event: "Cognitive assessment - Mild decline noted", doctor: "Dr. Nisha" },
  { date: "Nov 2024", event: "Medication adjusted - Donepezil increased", doctor: "Dr. Mehta" },
  { date: "Oct 2024", event: "Blood work - All parameters normal", doctor: "Dr. Nisha" },
];

const Patient = () => {
  const [favorites, setFavorites] = useState(initialFavorites);
  const [medicalHistory, setMedicalHistory] = useState(initialMedicalHistory);

  const [newFavorite, setNewFavorite] = useState({ label: "", value: "" });
  const [newHistory, setNewHistory] = useState({ date: "", event: "", doctor: "" });

  // ---------------- PDF GENERATION ----------------
  const handleDownloadData = () => {
    toast.info("Preparing patient data PDF...");
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Patient Data Report", 14, 20);
    doc.setFontSize(12);

    doc.text(`Name: ${patientInfo.name}`, 14, 35);
    doc.text(`Age: ${patientInfo.age}`, 14, 42);
    doc.text(`Diagnosis: ${patientInfo.diagnosis}`, 14, 49);
    doc.text(`Since: ${patientInfo.since}`, 14, 56);
    doc.text(`Blood Group: ${patientInfo.bloodGroup}`, 14, 63);

    doc.text("Contact Info:", 14, 75);
    doc.text(`Phone: ${patientInfo.phone}`, 14, 82);
    doc.text(`Email: ${patientInfo.email}`, 14, 89);
    doc.text(`Address: ${patientInfo.address}`, 14, 96);

    doc.text("Medical History:", 14, 110);
    let y = 118;
    medicalHistory.forEach((record) => {
      doc.text(`- ${record.date}: ${record.event} (${record.doctor})`, 14, y);
      y += 7;
    });

    doc.save("PatientData_LakshmiSharma.pdf");
    toast.success("PDF downloaded successfully!");
  };

  // ---------------- FAVORITES ----------------
  const handleAddFavorite = () => {
    if (!newFavorite.label || !newFavorite.value) {
      toast.error("Please fill both fields");
      return;
    }
    setFavorites([...favorites, { icon: Heart, ...newFavorite }]);
    setNewFavorite({ label: "", value: "" });
    toast.success("Favorite added!");
  };

  const handleDeleteFavorite = (label: string) => {
    setFavorites(favorites.filter((f) => f.label !== label));
    toast.success("Favorite removed");
  };

  // ---------------- MEDICAL HISTORY ----------------
  const handleAddHistory = () => {
    if (!newHistory.date || !newHistory.event || !newHistory.doctor) {
      toast.error("Please fill all fields");
      return;
    }
    setMedicalHistory([...medicalHistory, newHistory]);
    setNewHistory({ date: "", event: "", doctor: "" });
    toast.success("Record added!");
  };

  const handleDeleteHistory = (index: number) => {
    setMedicalHistory(medicalHistory.filter((_, i) => i !== index));
    toast.success("Record deleted");
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Patient Data</h1>
          <p className="text-muted-foreground">Complete patient information and medical records</p>
        </div>
        <Button onClick={handleDownloadData} className="gap-2">
          <Download className="w-4 h-4" />
          Download as PDF
        </Button>
      </div>

      {/* BASIC INFO */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold">
            LS
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-4">{patientInfo.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div><p className="text-sm text-muted-foreground">Age</p><p className="font-semibold">{patientInfo.age} years</p></div>
              <div><p className="text-sm text-muted-foreground">Diagnosis</p><p className="font-semibold">{patientInfo.diagnosis}</p></div>
              <div><p className="text-sm text-muted-foreground">Since</p><p className="font-semibold">{patientInfo.since}</p></div>
              <div><p className="text-sm text-muted-foreground">Blood Group</p><p className="font-semibold flex items-center gap-1"><Droplet className="w-4 h-4 text-red-500" />{patientInfo.bloodGroup}</p></div>
              <div><p className="text-sm text-muted-foreground">Height</p><p className="font-semibold">{patientInfo.height}</p></div>
              <div><p className="text-sm text-muted-foreground">Weight</p><p className="font-semibold">{patientInfo.weight}</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTACT + MEDICAL INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Phone className="w-5 h-5 text-primary" />Contact Information</h3>
          <div className="space-y-3 text-sm">
            <p><strong>Address:</strong> {patientInfo.address}</p>
            <p><strong>Phone:</strong> {patientInfo.phone}</p>
            <p><strong>Email:</strong> {patientInfo.email}</p>
            <p><strong>Emergency Contact:</strong> {patientInfo.emergencyContact}</p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-primary" />Medical Information</h3>
          <p><strong>Allergies:</strong> <span className="text-red-600">{patientInfo.allergies}</span></p>
          <p><strong>Chronic Conditions:</strong> {patientInfo.chronicConditions}</p>
        </div>
      </div>

      {/* FAVORITES SECTION */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Favorites</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1"><Plus className="w-4 h-4" />Add</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Favorite</DialogTitle></DialogHeader>
            <Input placeholder="Label" value={newFavorite.label} onChange={(e) => setNewFavorite({ ...newFavorite, label: e.target.value })} />
            <Input placeholder="Value" value={newFavorite.value} onChange={(e) => setNewFavorite({ ...newFavorite, value: e.target.value })} />
            <Button onClick={handleAddFavorite} className="mt-3 w-full">Add</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((item) => (
          <div key={item.label} className="bg-card rounded-2xl p-6 shadow-sm border border-border relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => handleDeleteFavorite(item.label)}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10"><item.icon className="w-6 h-6 text-primary" /></div>
              <div><p className="text-sm text-muted-foreground mb-1">{item.label}</p><p className="font-medium">{item.value}</p></div>
            </div>
          </div>
        ))}
      </div>

      {/* MEDICAL HISTORY SECTION */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Medical History</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1"><Plus className="w-4 h-4" />Add</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Medical Record</DialogTitle></DialogHeader>
            <Input placeholder="Date (e.g. Jan 2025)" value={newHistory.date} onChange={(e) => setNewHistory({ ...newHistory, date: e.target.value })} />
            <Input placeholder="Event" value={newHistory.event} onChange={(e) => setNewHistory({ ...newHistory, event: e.target.value })} />
            <Input placeholder="Doctor Name" value={newHistory.doctor} onChange={(e) => setNewHistory({ ...newHistory, doctor: e.target.value })} />
            <Button onClick={handleAddHistory} className="mt-3 w-full">Add</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-2xl p-6 border space-y-3">
        {medicalHistory.map((record, index) => (
          <div key={index} className="flex justify-between items-center p-4 rounded-xl bg-muted/50 hover:bg-muted transition">
            <div>
              <p className="font-medium">{record.event}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-2"><CalendarDays className="w-4 h-4" />{record.date} — <Stethoscope className="w-4 h-4" />{record.doctor}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleDeleteHistory(index)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Patient;
