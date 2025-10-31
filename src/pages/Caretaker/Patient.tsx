import { User, Heart, Music, Coffee, Users as UsersIcon, MapPin, Phone, Mail, Droplet, Activity, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

const favorites = [
  { icon: Music, label: "Favorite Music", value: "Classical Indian, Lata Mangeshkar" },
  { icon: Coffee, label: "Favorite Foods", value: "Masala chai, khichdi, mango lassi" },
  { icon: UsersIcon, label: "Closest To", value: "Daughter Meera, Grandson Arjun" },
  { icon: MapPin, label: "Favorite Places", value: "Temple garden, home balcony" },
    { icon: Heart, label: "Hobbies", value: "Gardening, listening to old songs" },
  { icon: Activity, label: "Best Time of Day", value: "Morning walks, evening video calls" },
];

const medicalHistory = [
  { date: "Jan 2025", event: "Regular checkup - BP stable" },
  { date: "Dec 2024", event: "Cognitive assessment - Mild decline noted" },
  { date: "Nov 2024", event: "Medication adjusted - Donepezil increased" },
  { date: "Oct 2024", event: "Blood work - All parameters normal" },
];

const Patient = () => {
  const handleDownloadData = () => {
    toast.success("Patient data is being prepared for download...");
    // In a real app, this would generate a PDF
    setTimeout(() => {
      toast.success("Download complete!");
    }, 2000);
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in">
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

      <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold">
            LS
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-4">{patientInfo.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-semibold text-foreground">{patientInfo.age} years</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Diagnosis</p>
                <p className="font-semibold text-foreground">{patientInfo.diagnosis}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Since</p>
                <p className="font-semibold text-foreground">{patientInfo.since}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Blood Group</p>
                <p className="font-semibold text-foreground flex items-center gap-1">
                  <Droplet className="w-4 h-4 text-red-500" />
                  {patientInfo.bloodGroup}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Height</p>
                <p className="font-semibold text-foreground">{patientInfo.height}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Weight</p>
                <p className="font-semibold text-foreground">{patientInfo.weight}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            Contact Information
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="text-sm font-medium text-foreground">{patientInfo.address}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="text-sm font-medium text-foreground">{patientInfo.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-sm font-medium text-foreground">{patientInfo.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Emergency Contact</p>
              <p className="text-sm font-medium text-foreground">{patientInfo.emergencyContact}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Medical Information
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Allergies</p>
              <p className="text-sm font-medium text-foreground text-red-600">{patientInfo.allergies}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Chronic Conditions</p>
              <p className="text-sm font-medium text-foreground">{patientInfo.chronicConditions}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         
        {favorites.map((item) => (
          <div key={item.label} className="bg-card rounded-2xl p-6 shadow-sm border border-border">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                <p className="font-medium text-foreground">{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Medical History</h3>
        <div className="space-y-3">
            {medicalHistory.map((record, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <div>
                <p className="font-medium text-foreground">{record.event}</p>
                <p className="text-sm text-muted-foreground">{record.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Patient;
