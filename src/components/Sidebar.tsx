import { Home, Users, Bell, Calendar, User, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Dashboard", path: "/caretaker/dashboard" },
  { icon: Users, label: "Family & Doctors", path: "/caretaker/family" },
  { icon: Bell, label: "Alerts & Reminders", path: "/caretaker/alerts" },
  { icon: Calendar, label: "Mood Calendar", path: "/caretaker/moodcalendar" },
  { icon: User, label: "Patient Data", path: "/caretaker/patient" },
  { icon: Settings, label: "Settings", path: "/caretaker/settings" },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      {/* Logo / Header */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">Smriti</h1>
        <p className="text-sm text-muted-foreground">AI Memory Companion</p>
      </div>
      
      {/* Navigation links */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                "hover:bg-muted",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50"
                  : "text-foreground"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer (Caregiver info) */}
      <div className="p-4 border-t border-border">
        <div className="bg-muted rounded-xl p-4">
          <p className="text-xs text-muted-foreground">Caregiver</p>
                    <p className="font-semibold text-sm text-foreground">Ms. Aditi Kashyap</p>
        </div>
      </div>
    </aside>
  );
};
