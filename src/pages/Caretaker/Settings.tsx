import { useState } from "react"
import { Bell, Lock, Users as UsersIcon, Palette } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";


const Settings = () => {
  const [aiTone, setAiTone] = useState<"friendly" | "formal" | "family">("friendly");

  const handleToneChange = (tone: "friendly" | "formal" | "family") => {
    setAiTone(tone);
    toast.success(`AI tone changed to ${tone === "friendly" ? "Friendly & Warm" : tone === "formal" ? "Formal & Professional" : "Family-like & Caring"}`);
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage app preferences and permissions</p>
      </div>

      <div className="space-y-4">
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-50">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Notifications</h3>
              <p className="text-sm text-muted-foreground mb-4">Configure alert preferences</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Medication reminders</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Emotional alerts</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Activity reminders</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-purple-50">
              <Lock className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Privacy & Security</h3>
              <p className="text-sm text-muted-foreground mb-4">Data sharing and permissions</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Share data with doctors</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Share data with family</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Voice recording</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-green-50">
              <UsersIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Caregiver Access</h3>
              <p className="text-sm text-muted-foreground mb-4">Manage who can view patient data</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted">
                 <span className="text-sm font-medium text-foreground">Ms. Aditi Kashyap</span>
                 <span className="text-xs text-primary">Full Access</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted">
                  <span className="text-sm font-medium text-foreground">Meera Sharma</span>
                  <span className="text-xs text-primary">View Only</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-pink-50">
              <Palette className="w-6 h-6 text-pink-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">AI Personalization</h3>
              <p className="text-sm text-muted-foreground mb-4">Customize AI interaction style</p>
              <div className="space-y-3">
                <button 
                  onClick={() => handleToneChange("friendly")}
                  className={`w-full text-left p-3 rounded-xl transition-colors ${
                    aiTone === "friendly" 
                      ? "bg-primary/10 border-2 border-primary" 
                      : "bg-muted hover:bg-muted/80 border-2 border-transparent"
                  }`}
                >
                  <p className="font-medium text-foreground">Friendly & Warm</p>
                  {aiTone === "friendly" && <p className="text-xs text-muted-foreground">Current setting</p>}
               </button>
                <button 
                  onClick={() => handleToneChange("formal")}
                  className={`w-full text-left p-3 rounded-xl transition-colors ${
                    aiTone === "formal" 
                      ? "bg-primary/10 border-2 border-primary" 
                      : "bg-muted hover:bg-muted/80 border-2 border-transparent"
                  }`}
                >
                 <p className="font-medium text-foreground">Formal & Professional</p>
                {aiTone === "formal" && <p className="text-xs text-muted-foreground">Current setting</p>}
                </button>
                <button 
                  onClick={() => handleToneChange("family")}
                  className={`w-full text-left p-3 rounded-xl transition-colors ${
                    aiTone === "family" 
                      ? "bg-primary/10 border-2 border-primary" 
                      : "bg-muted hover:bg-muted/80 border-2 border-transparent"
                  }`}
                >
                  <p className="font-medium text-foreground">Family-like & Caring</p>
                  {aiTone === "family" && <p className="text-xs text-muted-foreground">Current setting</p>}
                
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
