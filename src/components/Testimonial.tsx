import { Quote } from "lucide-react";

export const Testimonial = () => {
  return (
    <section className="py-20 bg-gradient-soft">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-3xl p-12 shadow-glow relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-primary rounded-full blur-3xl opacity-20" />
            
            <div className="relative">
              {/* Quote icon */}
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Quote className="w-8 h-8 text-white" />
              </div>

              {/* Testimonial text */}
              <blockquote className="text-2xl md:text-3xl font-medium text-center text-foreground mb-8 leading-relaxed">
                "For the first time in years, my grandmother remembered our favorite song. 
                When Smriti played it back, she smiled and hummed along. 
                <span className="text-secondary"> It was like having her back</span>, 
                even if just for a moment."
              </blockquote>

              {/* Attribution */}
              <div className="text-center">
                <p className="font-semibold text-primary text-lg">Sarah Chen</p>
                <p className="text-foreground/60">Caregiver and granddaughter</p>
              </div>

              {/* Decorative elements */}
              <div className="flex justify-center gap-2 mt-8">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse-glow" style={{ animationDelay: '1s' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" style={{ animationDelay: '2s' }} />
              </div>
            </div>
          </div>

          {/* Additional emotional story */}
          <div className="mt-12 text-center">
            <p className="text-lg text-foreground/70 italic">
              Behind the 55 million living with dementia are countless families carrying the weight of fading memories. 
              <span className="text-primary font-semibold"> Smriti is here to lighten that burden.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
