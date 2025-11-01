import { useState, useEffect } from "react"
import { Bell, Lock, Users as UsersIcon, Palette } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

const themes = [
  { id: "default", label: "Default (Warm Purple) ✨" },
  { id: "calm", label: "Calm (Mint Green) 🌿" },
  { id: "serene", label: "Serene (Light Blue) 💧" },
  { id: "radiant", label: "Radiant (Yellow) 🌞" },
  { id: "comfort", label: "Comforting (Orange) 🍊" },
]

const Settings = () => {
  const [selectedTheme, setSelectedTheme] = useState("default")

  useEffect(() => {
    const saved = localStorage.getItem("theme-mode")
    if (saved) {
      setSelectedTheme(saved)
      applyTheme(saved)
    }
  }, [])

  const applyTheme = (theme: string) => {
    const root = document.documentElement
    root.classList.remove(
      "theme-calm",
      "theme-serene",
      "theme-radiant",
      "theme-comfort"
    )

    if (theme !== "default") root.classList.add(`theme-${theme}`)
    localStorage.setItem("theme-mode", theme)

    const emoji =
      theme === "calm"
        ? "🌿"
        : theme === "serene"
        ? "💧"
        : theme === "radiant"
        ? "🌞"
        : theme === "comfort"
        ? "🍊"
        : "✨"

    toast.success(`Switched to ${themes.find((t) => t.id === theme)?.label} ${emoji}`)
  }

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme)
    applyTheme(theme)
  }

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage app preferences and permissions</p>
      </div>

      <div className="space-y-4">
        {/* --- Notifications --- */}
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

        {/* --- Privacy & Security --- */}
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

        {/* --- Caregiver Access --- */}
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

        {/* --- Theme Mode --- */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-pink-50">
              <Palette className="w-6 h-6 text-pink-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Color Theme</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose from available Smriti color palettes
              </p>
              <div className="space-y-2">
                {themes.map((theme) => (
                  <label
                    key={theme.id}
                    className={`flex items-center justify-between cursor-pointer p-3 rounded-xl transition-colors ${
                      selectedTheme === theme.id ? "bg-muted" : "hover:bg-muted"
                    }`}
                  >
                    <span className="text-sm text-foreground">{theme.label}</span>
                    <Switch
                      checked={selectedTheme === theme.id}
                      onCheckedChange={() => handleThemeChange(theme.id)}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Settings
