import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const generateYearData = () => {
  const data = [];
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(2025, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const moods = ["calm", "happy", "neutral", "anxious"];
      const mood = moods[Math.floor(Math.random() * moods.length)];
      const reasons = {
        calm: ["Morning meditation", "Garden visit", "Peaceful music"],
        happy: ["Family video call", "Favorite food", "Birthday celebration", "Temple visit"],
        neutral: ["Regular routine", "Normal day"],
        anxious: ["Missed medication", "Rainy weather", "Alone time", "Confusion moment"],
      };
      data.push({
        month,
        day,
        mood,
        reason:
          reasons[mood as keyof typeof reasons][
            Math.floor(Math.random() * reasons[mood as keyof typeof reasons].length)
          ],
      });
    }
  }
  return data;
};

const moodEmojis = {
  calm: "😌",
  happy: "😊",
  neutral: "😐",
  anxious: "😰",
};

const moodColors = {
  calm: "from-green-200/70 to-emerald-400/60 border-green-300/30 shadow-green-200/40",
  happy: "from-blue-200/70 to-sky-400/60 border-blue-300/30 shadow-sky-200/40",
  neutral: "from-yellow-200/70 to-amber-400/60 border-yellow-300/30 shadow-amber-200/40",
  anxious: "from-red-200/70 to-rose-400/60 border-red-300/30 shadow-rose-200/40",
};

const moodLabels = {
  calm: "Calm",
  happy: "Happy",
  neutral: "Neutral",
  anxious: "Anxious",
};

const moodMeanings = {
  calm: "Peaceful and steady — a serene state of mind 🌿",
  happy: "Joyful, grateful, and bright ✨",
  neutral: "Emotionally balanced and steady ⚖️",
  anxious: "Restless or uneasy moments — be kind to yourself 💭",
};

const MoodCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(0);
  const [hoveredDay, setHoveredDay] = useState<null | {
    day: number;
    mood: string;
    reason: string;
  }>(null);

  const yearData = useState(() => generateYearData())[0];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const currentMonthData = yearData.filter((d) => d.month === currentMonth);
  const firstDayOfMonth = new Date(2025, currentMonth, 1).getDay();

  // INSIGHTS
  const dailyInsight = currentMonthData[Math.floor(Math.random() * currentMonthData.length)];
  const weeklyMoodCount = currentMonthData.slice(0, 7).reduce((acc, d) => {
    acc[d.mood] = (acc[d.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const monthlyMoodCount = currentMonthData.reduce((acc, d) => {
    acc[d.mood] = (acc[d.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const dominantWeekMood = Object.keys(weeklyMoodCount).reduce((a, b) =>
    weeklyMoodCount[a] > weeklyMoodCount[b] ? a : b
  );
  const dominantMonthMood = Object.keys(monthlyMoodCount).reduce((a, b) =>
    monthlyMoodCount[a] > monthlyMoodCount[b] ? a : b
  );

  const handlePrevMonth = () => setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
  const handleNextMonth = () => setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-background via-muted/20 to-accent/10 rounded-3xl backdrop-blur-2xl relative">
      <div>
        <h1 className="text-3xl font-bold text-primary drop-shadow-md mb-3">✨ Mood Calendar</h1>
        <p className="text-muted-foreground">
          Track emotions beautifully — daily, weekly, and monthly insights.
        </p>
      </div>

      {/* INSIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Daily */}
        <div className="bg-gradient-to-br from-pink-100/50 to-pink-200/30 border border-pink-300/40 rounded-2xl p-4 backdrop-blur-md shadow-md">
          <h3 className="font-semibold text-pink-800 text-sm mb-1">🌤️ Daily Mood</h3>
          <p className="text-sm text-pink-900/80">
            {dailyInsight.mood === "happy"
              ? `You felt happy today — ${dailyInsight.reason}`
              : dailyInsight.mood === "calm"
              ? `You stayed calm with ${dailyInsight.reason}`
              : dailyInsight.mood === "neutral"
              ? `A balanced day — ${dailyInsight.reason}`
              : `You were a bit anxious due to ${dailyInsight.reason}`}
          </p>
        </div>

        {/* Weekly */}
        <div className="bg-gradient-to-br from-sky-100/50 to-sky-200/30 border border-sky-300/40 rounded-2xl p-4 backdrop-blur-md shadow-md">
          <h3 className="font-semibold text-sky-800 text-sm mb-1">📅 Weekly Insight</h3>
          <p className="text-sm text-sky-900/80">
            Dominant emotion: <b>{moodLabels[dominantWeekMood as keyof typeof moodLabels]}</b> —{" "}
            {weeklyMoodCount[dominantWeekMood]} days.
          </p>
        </div>

        {/* Monthly */}
        <div className="bg-gradient-to-br from-emerald-100/50 to-emerald-200/30 border border-emerald-300/40 rounded-2xl p-4 backdrop-blur-md shadow-md">
          <h3 className="font-semibold text-emerald-800 text-sm mb-1">📊 Monthly Reflection</h3>
          <p className="text-sm text-emerald-900/80">
            You were mostly <b>{moodLabels[dominantMonthMood as keyof typeof moodLabels]}</b> this
            month — keep your glow 💫
          </p>
        </div>
      </div>

      {/* MONTH HEADER */}
      <div className="bg-card/40 backdrop-blur-lg border border-border/40 rounded-2xl p-6 shadow-md relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground drop-shadow">
            {months[currentMonth]} 2025
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg bg-muted/40 hover:bg-muted/60 transition-all shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg bg-muted/40 hover:bg-muted/60 transition-all shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* WEEK LABELS */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-muted-foreground py-2 uppercase tracking-wide"
            >
              {day}
            </div>
          ))}
        </div>

        {/* DAYS GRID */}
        <div className="grid grid-cols-7 gap-5 justify-items-center relative">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="w-10 h-10" />
          ))}

          {currentMonthData.map((dayData) => (
            <div
              key={dayData.day}
              onMouseEnter={() => setHoveredDay(dayData)}
              onMouseLeave={() => setHoveredDay(null)}
              className={cn(
                "relative w-16 h-16 rounded-full flex items-center justify-center text-4xl cursor-pointer bg-gradient-to-br transition-all duration-200 border shadow-md hover:scale-105",
                moodColors[dayData.mood as keyof typeof moodColors]
              )}
            >
              {moodEmojis[dayData.mood as keyof typeof moodEmojis]}

              {/* FIXED TOOLTIP - positioned above with gap */}
              {hoveredDay?.day === dayData.day && (
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-white/95 border border-gray-300 text-gray-800 text-sm px-3 py-2 rounded-lg shadow-lg z-50 w-max max-w-[150px] text-center transition-all duration-200">
                  <strong>
                    {months[currentMonth]} {hoveredDay.day}, 2025
                  </strong>
                  <div>
                    {moodLabels[hoveredDay.mood as keyof typeof moodLabels]} — {hoveredDay.reason}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MOOD MEANINGS */}
      <div className="mt-6 bg-card/40 backdrop-blur-lg border border-border/30 rounded-2xl p-6 shadow-inner">
        <h3 className="text-lg font-semibold text-foreground mb-4">💭 Mood Meanings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(moodMeanings).map(([mood, meaning]) => (
            <div
              key={mood}
              className={cn(
                "p-4 rounded-xl border bg-gradient-to-br text-sm shadow-sm hover:shadow-md transition-all",
                moodColors[mood as keyof typeof moodColors]
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{moodEmojis[mood as keyof typeof moodEmojis]}</span>
                <span className="font-semibold text-foreground capitalize">
                  {moodLabels[mood as keyof typeof moodLabels]}
                </span>
              </div>
              <p className="text-foreground/80">{meaning}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodCalendar;
