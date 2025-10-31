import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { Impact } from "@/components/Impact";
import { Testimonial } from "@/components/Testimonial";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      
    <Hero />
      <About />
      <HowItWorks />
      <Features />
      <Impact />
      <Testimonial />
      <Footer />
    </main>
  );
};

export default Index;
