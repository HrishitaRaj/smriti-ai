import { BookHeart, Bell, Image, Shield, LineChart, Users } from "lucide-react";
import memoryJournalIcon from "@/assets/memory-journal-icon.png";
import recallIcon from "@/assets/recall-icon.png";
import emotionIcon from "@/assets/emotion-icon.png";
import { useNavigate } from "react-router-dom";


export const Features = () => {
  
  const features = [
    {
      icon: memoryJournalIcon,
      title: "Memory Journal",
      description: "Logs daily moments via voice or text and auto-tags people, emotions, and events for easy recall.",
    },
    {
      icon: recallIcon,
      title: "AI Memory Recall & Nudges",
      description: "Recreates past moments through natural conversations and sends gentle, personalized prompts to relive joyful experiences.",
    },
    {
      icon: emotionIcon,
      title: "Emotion Tracker",
      description: "Analyzes mood patterns to detect emotional changes over time, providing insights for better care.",
    },
    {
      lucideIcon: Users,
      title: "Caregiver Dashboard",
      description: "Gives families weekly insights, emotional alerts, location tracker, and gentle reminder options.",
    },
    {
      lucideIcon: Image,
      title: "Visual Memory Recognition",
      description: "Scan photos to identify familiar faces and places, helping users relive connected memories.",
    },
    {
      lucideIcon: Shield,
      title: "Privacy-First Design",
      description: "Secures all data with end-to-end encryption and user-controlled sharing for peace of mind.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-soft">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
            Features That Care
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Comprehensive tools designed with empathy and compassion
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-card rounded-2xl p-8 shadow-card hover:shadow-glow transition-all duration-500 hover:-translate-y-2 group"
            >
              <div className="w-20 h-20 bg-gradient-hero rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon ? (
                  <img src={feature.icon} alt={`${feature.title} icon`} className="w-12 h-12" />
                ) : feature.lucideIcon && (
                  <feature.lucideIcon className="w-10 h-10 text-primary" />
                )}
              </div>

              <h3 className="text-xl font-bold text-secondary mb-3">
                {feature.title}
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
