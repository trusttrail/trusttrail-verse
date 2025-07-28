
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, TrendingUp } from "lucide-react";
import { RealCompany } from "@/hooks/useCompanyData";

interface TopCompaniesSectionProps {
  companies: RealCompany[];
  onViewAll?: () => void;
  loading?: boolean;
}

const TopCompaniesSection = ({ companies, onViewAll, loading }: TopCompaniesSectionProps) => {
  if (loading) {
    return (
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Top Rated Companies</h3>
        </div>
        <p className="text-muted-foreground mb-6">Companies with the highest review scores and verification</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded mb-1"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (companies.length === 0) {
    return (
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Top Rated Companies</h3>
        </div>
        <p className="text-muted-foreground mb-6">Companies with the highest review scores and verification</p>
        <Card>
          <CardContent className="p-8 text-center">
            <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h4 className="text-lg font-semibold mb-2">No Reviews Yet</h4>
            <p className="text-muted-foreground">
              Be the first to review a Web3 company and help build the community!
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">Top Rated Companies</h3>
        {companies.length > 4 && onViewAll && (
          <Button 
            variant="link" 
            className="text-trustpurple-400 hover:text-trustpurple-500"
            onClick={onViewAll}
          >
            View All
          </Button>
        )}
      </div>
      <p className="text-muted-foreground mb-6">Companies with the highest review scores and verification</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {companies.slice(0, 4).map((company) => (
          <Card key={company.name} className="hover:shadow-md transition-shadow border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3 mb-2">
                <img 
                  src={company.logo} 
                  alt={`${company.name} logo`}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=6366f1&color=ffffff&size=40`;
                  }}
                />
                <div className="flex-1">
                  <CardTitle className="text-lg truncate">{company.name}</CardTitle>
                  <CardDescription className="capitalize text-sm">{company.category}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{company.averageRating}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {company.reviewCount} review{company.reviewCount !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Latest: {new Date(company.latestReviewDate).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default TopCompaniesSection;
