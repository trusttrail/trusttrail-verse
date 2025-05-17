
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit, Search } from "lucide-react";

interface PortalHeroProps {
  onWriteReviewClick: () => void;
  onExploreClick: () => void;
}

const PortalHero = ({ onWriteReviewClick, onExploreClick }: PortalHeroProps) => {
  return (
    <section className="mb-10">
      <div className="bg-gradient-to-r from-trustpurple-500/10 to-trustblue-500/10 rounded-xl p-6 md:p-10">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">Trusted Reviews Backed by Blockchain</h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-6">
          Verify the authenticity of reviews with blockchain-based signatures. No more fake reviews.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <Button 
            onClick={onWriteReviewClick}
            size="lg" 
            className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500 hover:from-trustpurple-600 hover:to-trustblue-600"
          >
            <Edit className="mr-2" size={18} />
            Write a Review
          </Button>
          <Button 
            onClick={onExploreClick}
            variant="outline" 
            size="lg" 
            className="border-trustpurple-500 text-trustpurple-400 hover:bg-trustpurple-500/10"
          >
            <Search className="mr-2" size={18} />
            Explore Companies
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PortalHero;
