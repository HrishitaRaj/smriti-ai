import { useState, useEffect, useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Utensils,
  Bath,
  Shirt,
  Pill,
  Phone,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Activities = () => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [search, setSearch] = useState("");
  const [completedSteps, setCompletedSteps] = useState<Record<string, number>>({});
  const [showCelebrationFor, setShowCelebrationFor] = useState<string | null>(null);

  const dailyBasicActivities = [
    {
      id: "brush",
      name: "Brush Teeth",
      icon: Bath,
      color: "from-pink-200 to-purple-200",
      steps: [
        { step: 1, instruction: "Take your toothbrush and toothpaste", image: "/t2.png" },
        { step: 2, instruction: "Apply a pea-sized amount of toothpaste", image: "/t1.png" },
        { step: 3, instruction: "Brush gently in circular motions for 2 minutes", image: "/t3.png" },
        { step: 4, instruction: "Rinse your mouth with water", image: "/t4.png" },
        { step: 5, instruction: "Clean your toothbrush and put it away", image: "/t5.png" },
      ],
    },
    {
      id: "eat",
      name: "Eat Food",
      icon: Utensils,
      color: "from-yellow-200 to-orange-200",
      steps: [
        { step: 1, instruction: "Wash your hands before eating" },
        { step: 2, instruction: "Sit comfortably at the table" },
        { step: 3, instruction: "Use fork and spoon to eat slowly" },
        { step: 4, instruction: "Chew your food well" },
        { step: 5, instruction: "Drink water with your meal" },
      ],
    },
    {
      id: "bathe",
      name: "Take a Bath",
      icon: Bath,
      color: "from-blue-200 to-indigo-200",
      steps: [
        { step: 1, instruction: "Gather your towel and clean clothes" },
        { step: 2, instruction: "Turn on the water and adjust temperature" },
        { step: 3, instruction: "Apply soap and wash your body" },
        { step: 4, instruction: "Rinse off all the soap" },
        { step: 5, instruction: "Dry yourself and put on clean clothes" },
      ],
    },
    {
      id: "medicine",
      name: "Take Medicine",
      icon: Pill,
      color: "from-green-200 to-emerald-200",
      steps: [
        { step: 1, instruction: "Check your medicine schedule" },
        { step: 2, instruction: "Take out the correct medicine" },
        { step: 3, instruction: "Take with a glass of water" },
        { step: 4, instruction: "Mark it on your medicine chart" },
        { step: 5, instruction: "Put medicine box back safely" },
      ],
    },
  ];

  const nextStep = (steps: number) => setCurrentStep((prev) => (prev + 1) % steps);
  const prevStep = (steps: number) => setCurrentStep((prev) => (prev - 1 + steps) % steps);

  // persist completed progress in localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("smriti_completed_steps");
      if (raw) setCompletedSteps(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("smriti_completed_steps", JSON.stringify(completedSteps));
    } catch (e) {
      // ignore
    }
  }, [completedSteps]);

  const filteredActivities = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return dailyBasicActivities;
    return dailyBasicActivities.filter((a) => a.name.toLowerCase().includes(q));
  }, [search]);

  const markStepComplete = (activityId: string, stepsCount: number) => {
    setCompletedSteps((prev) => {
      const current = prev[activityId] ?? 0;
      const next = Math.min(current + 1, stepsCount);
      const updated = { ...prev, [activityId]: next };
      if (next === stepsCount) {
        // show celebration briefly
        setShowCelebrationFor(activityId);
        setTimeout(() => setShowCelebrationFor(null), 2200);
      }
      return updated;
    });
    // move to next step if possible
    setCurrentStep((prev) => Math.min(prev + 1, stepsCount - 1));
  };

  return (
    <div className="min-h-screen pt-24 pb-10 px-6" style={{ backgroundColor: "#fdf6ff" }}>
      <Navigation />
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#de67ff] to-[#c800ff] flex items-center justify-center mx-auto shadow-lg">
          <Activity className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold mt-4" style={{ color: "#c800ff" }}>
          Daily Activities
        </h1>
        <p className="text-md" style={{ color: "#5e3023" }}>
          Build healthy habits, one step at a time
        </p>
        {/* search */}
        <div className="mt-6 flex justify-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activities..."
            className="w-full max-w-md rounded-full py-2 px-4 border border-transparent shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c800ff]"
          />
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {filteredActivities.map((activity) => {
          const Icon = activity.icon;
          const stepsCount = activity.steps.length;
          const completed = completedSteps[activity.id] ?? 0;
          const percent = Math.round((completed / stepsCount) * 100);

          return (
            <Card
              key={activity.id}
              onClick={() => {
                setSelectedActivity(activity.id);
                setCurrentStep(0);
              }}
              className="cursor-pointer hover:scale-[1.02] hover:shadow-lg transition-all duration-300 p-6 rounded-2xl border-0 bg-white/80 backdrop-blur-md"
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-20 h-20 mb-4 rounded-2xl bg-gradient-to-br ${activity.color} flex items-center justify-center`}
                >
                  <Icon className="w-10 h-10 text-[#c800ff]" />
                </div>
                <h3 className="text-xl font-semibold" style={{ color: "#c800ff" }}>
                  {activity.name}
                </h3>
                <p className="text-sm mt-1" style={{ color: "#5e3023" }}>
                  {completed === stepsCount ? "Completed" : "Tap to view tutorial"}
                </p>

                {/* progress */}
                <div className="w-full mt-4">
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${percent}%`,
                        background: `linear-gradient(90deg, #de67ff, #c800ff)`,
                      }}
                    />
                  </div>
                  <div className="text-xs mt-2 text-gray-600">{percent}% complete</div>
                </div>
                {completed === stepsCount && (
                  <div className="mt-3 inline-block bg-emerald-100 text-emerald-800 text-xs font-medium px-3 py-1 rounded-full">
                    ✓ Completed
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Flashcard Modal */}
      <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
        <DialogContent
          className="max-w-xl rounded-3xl p-8 shadow-2xl border-2 border-[#de67ff]/40"
          style={{ backgroundColor: "#fdf6ff" }}
        >
          {selectedActivity && (
            <>
              <DialogHeader className="mb-6 text-center">
                <DialogTitle className="text-2xl font-bold" style={{ color: "#c800ff" }}>
                  {
                    dailyBasicActivities.find((a) => a.id === selectedActivity)
                      ?.name
                  }
                </DialogTitle>
                <p className="text-sm mt-1" style={{ color: "#5e3023" }}>
                  Step-by-step visual guide
                </p>
              </DialogHeader>

              <AnimatePresence mode="wait">
                {(() => {
                  const activity = dailyBasicActivities.find(
                    (a) => a.id === selectedActivity
                  );
                  const step = activity?.steps[currentStep];
                  if (!activity || !step) return null;

                  const stepsCount = activity.steps.length;
                  const completed = completedSteps[activity.id] ?? 0;

                  return (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.3 }}
                      className="text-center"
                    >
                      {/* Image Placeholder */}
                      <div className="bg-white/80 p-6 rounded-2xl shadow-inner border border-[#de67ff]/30 flex flex-col items-center">
                        <div className="w-full h-48 mb-4 rounded-xl bg-[#ffffff] border-2 border-dashed border-[#de67ff]/40 flex items-center justify-center overflow-hidden">
                          {(() => {
                            const imageSrc = (step as any).image as string | undefined;
                            if (imageSrc) {
                              return (
                                <img
                                  src={imageSrc}
                                  alt={`Step ${step.step} illustration`}
                                  className="w-full h-full object-cover"
                                />
                              );
                            }
                            return (
                              <>
                                <ImageIcon className="w-10 h-10 text-[#de67ff]" />
                                <span
                                  className="ml-2 text-sm font-medium"
                                  style={{ color: "#de67ff" }}
                                >
                                  Step Illustration Placeholder
                                </span>
                              </>
                            );
                          })()}
                        </div>

                        <h4
                          className="text-lg font-semibold mb-2"
                          style={{ color: "#de67ff" }}
                        >
                          Step {step.step}
                        </h4>
                        <p
                          className="text-lg font-medium mb-4"
                          style={{ color: "#5e3023" }}
                        >
                          {step.instruction}
                        </p>
                        <div className="flex gap-3 justify-center">
                          <Button
                            variant="outline"
                            onClick={() => prevStep(activity.steps.length)}
                            className="border-[#de67ff]/40 text-[#de67ff] hover:bg-[#de67ff]/10"
                          >
                            <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                          </Button>

                          <Button
                            onClick={() => markStepComplete(activity.id, activity.steps.length)}
                            className="bg-gradient-to-r from-[#de67ff] to-[#c800ff] text-white"
                          >
                            Mark step done
                          </Button>

                          <Button
                            variant="ghost"
                            onClick={() => nextStep(activity.steps.length)}
                            className="text-[#5e3023]"
                          >
                            Next <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>

                        {/* celebration */}
                        {showCelebrationFor === activity.id && (
                          <motion.div
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1, rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 0.9 }}
                            className="mt-6"
                          >
                            <div className="text-4xl">🎉</div>
                            <div className="text-sm text-emerald-700 mt-2">Activity complete! Great job.</div>
                          </motion.div>
                        )}
                      </div>

                      
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Activities;
