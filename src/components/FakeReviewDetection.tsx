
import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle,
  Check,
  X
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FakeReviewDetection = () => {
  const fakeReviewExamples = [
    {
      review: "Amazing product! Changed my life completely! Will buy 100 more!",
      telltale: "Excessive enthusiasm without specifics",
      verdict: "Fake",
      explanation: "Overly enthusiastic language without concrete details"
    },
    {
      review: "I received this product yesterday from Amazon. It works exactly as advertised and solved my problem with...",
      telltale: "Detailed, specific experience with timeline",
      verdict: "Genuine",
      explanation: "Contains specific details and personal experience"
    },
    {
      review: "Best service ever! Everyone should try it! Five stars!",
      telltale: "Generic praise, unnatural language patterns",
      verdict: "Fake",
      explanation: "No specific details about the service experience"
    }
  ];

  return (
    <section id="fake-review-detection" className="section-padding relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 animated-bg animate-rotate-glow opacity-30 -z-10"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-trustpurple-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-trustblue-500/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto">
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-radial from-trustpurple-500/20 via-transparent to-transparent rounded-full blur-3xl -z-10"></div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 relative">
            <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">Catching</span> Fake Reviews
          </h2>
          <p className="text-foreground/70 text-xl max-w-2xl mx-auto">
            Our AI-powered blockchain system instantly identifies and flags suspicious reviews
          </p>
        </div>
        
        <div className="glass-card p-8 mb-12 max-w-4xl mx-auto transform transition-all duration-500 hover:scale-[1.02] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-trustpurple-500/5 via-trustblue-500/5 to-transparent rounded-full blur-3xl -z-10"></div>
          
          <div className="flex items-center gap-3 mb-8">
            <div className="rounded-full bg-trustpurple-500/20 p-2">
              <ShieldCheck size={20} className="text-trustpurple-500" />
            </div>
            <h3 className="text-2xl font-bold">How TrustTrail Detects Fake Reviews</h3>
          </div>
          
          <div className="flex flex-col space-y-6">
            {fakeReviewExamples.map((example, index) => (
              <Card key={index} className="overflow-hidden border-white/10 bg-white/5 backdrop-blur-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 rounded-full p-2 ${example.verdict === "Fake" ? "bg-red-500/20" : "bg-green-500/20"}`}>
                      {example.verdict === "Fake" ? 
                        <X className="h-5 w-5 text-red-500" /> : 
                        <Check className="h-5 w-5 text-green-500" />
                      }
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-lg">{example.verdict === "Fake" ? "Suspicious Review" : "Genuine Review"}</p>
                        <span className={`text-sm px-3 py-1 rounded-full ${
                          example.verdict === "Fake" ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"
                        }`}>
                          {example.verdict}
                        </span>
                      </div>
                      <blockquote className="italic border-l-4 pl-4 my-3 border-white/20">
                        "{example.review}"
                      </blockquote>
                      <div className="flex items-center gap-2 mt-2 text-sm">
                        <AlertTriangle size={14} className={example.verdict === "Fake" ? "text-red-400" : "text-green-400"} />
                        <span className="text-foreground/70">
                          <span className="font-medium">{example.telltale}</span>
                          {" — "}
                          {example.explanation}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-foreground/70">
              TrustTrail's advanced AI algorithms analyze language patterns, user behavior, purchase verification, 
              and blockchain identity scoring to ensure only authentic reviews are published.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FakeReviewDetection;
