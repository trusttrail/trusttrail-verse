import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    setIsLoading(true);

    try {
      // Call Supabase Edge Function to send confirmation email
      const response = await fetch("https://ydvgnptdqnqxmueflhxq.functions.supabase.co/send-newsletter-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success("Thanks for subscribing! Please check your email for confirmation.");
        setEmail("");
      } else {
        toast.error(data?.error || "Failed to send confirmation email.");
      }
    } catch (err: any) {
      toast.error("Network error. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="relative glass-card overflow-hidden p-10 rounded-2xl border border-trustpurple-500/30">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-trustpurple-500/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-trustblue-500/30 rounded-full blur-3xl"></div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated on TrustTrail</h2>
            <p className="text-foreground/70 text-lg mb-8">
              Subscribe to our newsletter for the latest updates on feature releases, token news, and community events.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/10 border-white/20 text-foreground"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500 hover:from-trustpurple-600 hover:to-trustblue-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            <p className="text-sm text-foreground/60 mt-4">
              We respect your privacy and won't share your information.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
