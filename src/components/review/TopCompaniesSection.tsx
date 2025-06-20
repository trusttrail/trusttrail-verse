
import React from 'react';
import { Button } from "@/components/ui/button";
import CompanyCard from "@/components/review/CompanyCard";

interface TopCompaniesSectionProps {
  companies: {
    id: number;
    name: string;
    logo: string;
    rating: number;
    reviewCount: number;
    category: string;
  }[];
  onViewAll?: () => void;
}

const TopCompaniesSection = ({ companies, onViewAll }: TopCompaniesSectionProps) => {
  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">Top Rated Companies</h3>
        <Button 
          variant="link" 
          className="text-trustpurple-400 hover:text-trustpurple-500"
          onClick={onViewAll}
        >
          View All
        </Button>
      </div>
      <p className="text-muted-foreground mb-6">Companies with the highest review scores and verification</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {companies.map(company => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </section>
  );
};

export default TopCompaniesSection;
