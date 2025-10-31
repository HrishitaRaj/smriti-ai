import { Heart, Brain, Users } from "lucide-react";

export const About = () => {
  return (
    <section className="py-20 bg-gradient-soft">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-12">
            About Smriti
          </h2>
          

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 bg-card rounded-2xl shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Preserves Identity</h3>
              <p className="text-foreground/70">
                Keeps precious memories alive and accessible, maintaining personal identity and dignity.
              </p>
            </div>

            <div className="p-6 bg-card rounded-2xl shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-2" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Emotional Support</h3>
              <p className="text-foreground/70">
                Tracks emotional patterns and provides insights for caregivers to offer better support.
              </p>
            </div>

            <div className="p-6 bg-card rounded-2xl shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-2" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Connects Families</h3>
              <p className="text-foreground/70">
                Bridges emotional gaps between patients and loved ones through shared memories.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
