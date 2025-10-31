import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const ContactPage = () => {
  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="container mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Contact</h1>
          <p className="text-foreground/70 mb-6">
            We'd love to hear from you. Use the form below or reach out to support@smriti.ai.
          </p>
          {/* Simple contact placeholder - footer already contains CTA and contact details */}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ContactPage;
