import { Sparkles, Lightbulb, HeartHandshake } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: Sparkles,
      title: "Capture",
      emoji: "💭",
      description: "Share moments via voice or text. Smriti records daily experiences, tagging people, places, emotions, and time.",
    },
    {
      icon: Lightbulb,
      title: "Recall",
      emoji: "💡",
      description: "When users forget, Smriti gently reminds them of people, events, and feelings through natural conversations.",
    },
    {
      icon: HeartHandshake,
      title: "Reflect",
      emoji: "🧠",
      description: "Track emotional health and share insights with caregivers for early intervention and personalized care.",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
            How It Works
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Three simple steps to reconnect with memories and emotions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
          {/* Connecting lines for desktop */}
          <div className="hidden md:block absolute top-32 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-secondary via-primary to-secondary" />
          
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative group"
            >
              <div className="bg-card rounded-3xl p-8 shadow-card hover:shadow-soft transition-all duration-500 hover:-translate-y-2 h-full">
                {/* Step number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-glow">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <span className="text-5xl">{step.emoji}</span>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-secondary mb-4 text-center">
                  {step.title}
                </h3>
                <p className="text-foreground/70 text-center leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
