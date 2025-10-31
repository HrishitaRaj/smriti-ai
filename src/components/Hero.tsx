import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Floating orbs animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-block mb-4 px-4 py-2 bg-white/60 rounded-full">
              <p className="text-sm font-medium text-secondary">AI-Powered Memory Companion</p>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-primary">Reconnecting</span>
              <br />
              <span className="text-secondary">Memories, Emotions,</span>
              <br />
              <span className="text-primary">and Loved Ones</span>
            </h1>

            <p className="text-xl text-foreground/80 mb-8 max-w-xl mx-auto lg:mx-0">
              An empathetic AI companion for people with Alzheimer's and their families. 
              Smriti helps preserve memories, recognize emotions, and reconnect with the world.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-gradient-primary text-white shadow-glow hover:shadow-soft transition-all duration-300 hover:scale-105">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-primary/30 hover:border-primary hover:bg-primary/5">
                <Play className="mr-2 h-5 w-5" /> See How It Works
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
                <span>Privacy-First Design</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse-glow" style={{ animationDelay: '1s' }} />
                <span>Empathy-Driven AI</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative rounded-3xl overflow-hidden shadow-glow">
              <img 
                src={heroImage} 
                alt="Elderly person holding smartphone with family photos, symbolizing memory connection" 
                className="w-full h-auto"
              />
              {/* Gradient overlay for better integration */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
            
            {/* Floating stats cards */}
            <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-2xl shadow-card animate-float">
              <p className="text-3xl font-bold text-primary">55M+</p>
              <p className="text-sm text-muted-foreground">Living with dementia</p>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-card p-4 rounded-2xl shadow-card animate-float" style={{ animationDelay: '1s' }}>
              <p className="text-3xl font-bold text-secondary">❤️</p>
              <p className="text-sm text-muted-foreground">Families supported</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
