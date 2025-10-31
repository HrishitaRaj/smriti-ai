import { useState } from "react";
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
      </div>

      {/* Activities Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {dailyBasicActivities.map((activity) => {
          const Icon = activity.icon;
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
                  Tap to view tutorial
                </p>
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
                      </div>

                      <div className="flex justify-between items-center mt-6">
                        <Button
                          variant="outline"
                          onClick={() => prevStep(activity.steps.length)}
                          className="border-[#de67ff]/40 text-[#de67ff] hover:bg-[#de67ff]/10"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                        </Button>
                        <Button
                          onClick={() => nextStep(activity.steps.length)}
                          className="bg-gradient-to-r from-[#de67ff] to-[#c800ff] text-white"
                        >
                          Next <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
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
