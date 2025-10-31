import { Sparkles, HeartHandshake, Smile, Stethoscope } from "lucide-react";

export const Impact = () => {
  const impacts = [
    {
      icon: Sparkles,
      title: "Revives Lost Memories",
      description: "Helps patients reconnect with precious moments they thought were gone forever.",
      color: "from-primary to-secondary",
    },
    {
      icon: HeartHandshake,
      title: "Bridges Emotional Gaps",
      description: "Creates meaningful connections between patients and their loved ones through shared memories.",
      color: "from-secondary to-primary",
    },
    {
      icon: Smile,
      title: "Reduces Loneliness",
      description: "Provides constant companionship and emotional support through empathetic AI conversations.",
      color: "from-primary to-secondary",
    },
    {
      icon: Stethoscope,
      title: "Supports Personalized Care",
      description: "Enables caregivers to provide better, more informed care through detailed insights.",
      color: "from-secondary to-primary",
    },
  ];

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-primary">Smriti brings light</span>
            <br />
            <span className="text-secondary">to fading memories</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Making a meaningful difference in the lives of patients and their families
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {impacts.map((impact, index) => (
            <div 
              key={index}
              className="group relative bg-card rounded-2xl p-8 shadow-card hover:shadow-glow transition-all duration-500 hover:-translate-y-2"
            >
              {/* Gradient border effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${impact.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              <div className="relative">
                <div className={`w-16 h-16 bg-gradient-to-br ${impact.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <impact.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-primary mb-3">
                  {impact.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  {impact.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-4xl font-bold text-primary mb-2">55M+</p>
            <p className="text-sm text-foreground/70">People with dementia</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-secondary mb-2">∞</p>
            <p className="text-sm text-foreground/70">Precious memories</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary mb-2">24/7</p>
            <p className="text-sm text-foreground/70">AI companionship</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-secondary mb-2">❤️</p>
            <p className="text-sm text-foreground/70">Empathy-driven</p>
          </div>
        </div>
      </div>
    </section>
  );
};
