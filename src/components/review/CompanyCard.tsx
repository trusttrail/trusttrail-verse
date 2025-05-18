
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface CompanyCardProps {
  company: {
    id: number;
    name: string;
    logo: string;
    rating: number;
    reviewCount: number;
    category: string;
    hasPendingReviews?: boolean;
  }
}

const CompanyCard = ({ company }: CompanyCardProps) => {
  const { toast } = useToast();

  const handleCardClick = () => {
    // In a real app, this would navigate to the company detail page
    toast({
      title: `${company.name}`,
      description: `Viewing details for ${company.name}. This would navigate to a company detail page showing all reviews.`,
    });
  };

  return (
    <Card 
      className="hover:border-trustpurple-500/30 hover:shadow-sm transition-all cursor-pointer"
      onClick={handleCardClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-center mb-4">
          <img 
            src={company.logo} 
            alt={company.name} 
            className="h-16 w-16 object-contain"
          />
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <h3 className="font-semibold text-lg text-center">{company.name}</h3>
          {company.hasPendingReviews && (
            <Badge variant="outline" className="text-yellow-600 border-yellow-400 bg-yellow-50">Pending</Badge>
          )}
        </div>
        <div className="flex justify-center items-center mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={16}
              className={`${
                star <= company.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-2 text-sm font-medium">{company.rating.toFixed(1)}</span>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          {company.reviewCount} verified reviews
        </p>
      </CardContent>
      <CardFooter className="border-t py-2 px-6 flex justify-center">
        <span className="text-xs text-trustpurple-400">
          {company.category}
        </span>
      </CardFooter>
    </Card>
  );
};

export default CompanyCard;
