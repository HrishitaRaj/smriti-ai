import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
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
        reason: reasons[mood as keyof typeof reasons][Math.floor(Math.random() * reasons[mood as keyof typeof reasons].length)],
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
  calm: "bg-green-500 hover:bg-green-600",
  happy: "bg-blue-500 hover:bg-blue-600",
  neutral: "bg-yellow-500 hover:bg-yellow-600",
  anxious: "bg-red-500 hover:bg-red-600",
};

const moodLabels = {
  calm: "Calm",
  happy: "Happy",
  neutral: "Neutral",
  anxious: "Anxious",
};

const MoodCalendar = () => {
    const [currentMonth, setCurrentMonth] = useState(0);
  const yearData = useState(() => generateYearData())[0];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const currentMonthData = yearData.filter((d) => d.month === currentMonth);
  const firstDayOfMonth = new Date(2025, currentMonth, 1).getDay();

  const getWeeklyInsight = () => {
    const weekData = yearData.filter((d) => d.month === currentMonth && d.day <= 7);
    const happyDays = weekData.filter((d) => d.mood === "happy").length;
    const anxiousDays = weekData.filter((d) => d.mood === "anxious").length;
    return {
      message: happyDays > anxiousDays 
        ? `Positive week! ${happyDays} happy days detected.` 
        : anxiousDays > 0 
        ? `${anxiousDays} anxious days this week. Consider extra support.`
        : "Stable emotional week.",
      type: happyDays > anxiousDays ? "positive" : anxiousDays > 0 ? "warning" : "neutral",
    };
  };

  const getMonthlyInsight = () => {
    const monthData = currentMonthData;
    const moodCounts = monthData.reduce((acc, day) => {
      acc[day.mood] = (acc[day.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const dominant = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    );
    return {
      dominant,
      count: moodCounts[dominant],
      total: monthData.length,
      percentage: Math.round((moodCounts[dominant] / monthData.length) * 100),
    };
  };

  const weeklyInsight = getWeeklyInsight();
  const monthlyInsight = getMonthlyInsight();

  const moodStats = currentMonthData.reduce((acc, day) => {
    acc[day.mood] = (acc[day.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Mood Calendar</h1>
        <p className="text-muted-foreground">Yearly emotional overview</p>
              </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={cn(
          "bg-card rounded-2xl p-4 border-l-4",
          weeklyInsight.type === "positive" ? "border-green-500" : 
          weeklyInsight.type === "warning" ? "border-yellow-500" : "border-blue-500"
        )}>
          <h3 className="font-semibold text-foreground mb-2">📅 Weekly Insight</h3>
          <p className="text-sm text-muted-foreground">{weeklyInsight.message}</p>
        </div>

        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-4 border border-primary/20">
          <h3 className="font-semibold text-foreground mb-2">📊 Monthly Insight</h3>
          <p className="text-sm text-muted-foreground">
            {moodEmojis[monthlyInsight.dominant as keyof typeof moodEmojis]} {monthlyInsight.dominant.charAt(0).toUpperCase() + monthlyInsight.dominant.slice(1)} mood dominated with {monthlyInsight.percentage}% of days
          </p>
        </div>

        <div className="bg-card rounded-2xl p-4">
          <h3 className="font-semibold text-foreground mb-2">🎯 Recommendation</h3>
          <p className="text-sm text-muted-foreground">
            {monthlyInsight.dominant === "happy" || monthlyInsight.dominant === "calm" 
              ? "Keep up the excellent routine!"
              : "Consider increasing family interactions."}
          </p>
        </div>
        </div>

      <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">{months[currentMonth]} 2025</h2>
          <div className="flex gap-2">
           <button onClick={handlePrevMonth} className="p-2 rounded-lg hover:bg-muted transition-colors"> 
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={handleNextMonth} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {currentMonthData.map((dayData) => (
          
            <button
              key={dayData.day}
              className={cn(
                "aspect-square rounded-xl flex flex-col items-center justify-center transition-all group relative",
                moodColors[dayData.mood as keyof typeof moodColors]
              )}
            >
              <span className="text-lg">{moodEmojis[dayData.mood as keyof typeof moodEmojis]}</span>
              <span className="text-white text-xs font-semibold">{dayData.day}</span>
              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-10 shadow-lg">
                <div className="font-semibold">{moodLabels[dayData.mood as keyof typeof moodLabels]}</div>
                <div className="text-gray-300 mt-1">{dayData.reason}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(moodStats).map(([mood, count]) => {
  const moodKey = mood as keyof typeof moodEmojis;
  return (
    <div key={mood} className="bg-card rounded-2xl p-6 shadow-sm border border-border">
      <div className="text-3xl mb-2">{moodEmojis[moodKey]}</div>
      <p className="text-2xl font-bold text-foreground">{String(count)} days</p>
      <p className="text-sm text-muted-foreground capitalize">{mood}</p>
    </div>
  );
})}

      </div>
    </div>
  );
};

export default MoodCalendar;
