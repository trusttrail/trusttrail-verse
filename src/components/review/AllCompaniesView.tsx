
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, Search, Filter, ArrowLeft } from "lucide-react";
import { sampleCompanies } from '@/data/companyData';

interface AllCompaniesViewProps {
  onBack: () => void;
}

const AllCompaniesView = ({ onBack }: AllCompaniesViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter companies that have at least one review
  const companiesWithReviews = sampleCompanies.filter(company => company.reviewCount > 0);

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(companiesWithReviews.map(company => company.category)))];

  // Filter companies based on search and category
  const filteredCompanies = companiesWithReviews.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || company.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Summary
        </Button>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">All Companies</h2>
          <p className="text-muted-foreground">Browse all companies with verified reviews on TrustTrail</p>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search companies by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Showing {filteredCompanies.length} companies with reviews
        </p>
        <Badge variant="outline" className="text-trustpurple-600">
          {companiesWithReviews.length} total companies
        </Badge>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map(company => (
          <Card key={company.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-trustpurple-500/10 to-trustblue-500/10 flex items-center justify-center overflow-hidden">
                  {company.logo ? (
                    <img 
                      src={company.logo} 
                      alt={company.name}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <span className="font-bold text-trustpurple-600 text-lg">
                      {company.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg group-hover:text-trustpurple-600 transition-colors">
                    {company.name}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {company.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3 line-clamp-2">
                {company.description}
              </CardDescription>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(company.rating)}</div>
                  <span className="text-sm font-medium">{company.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {company.reviewCount} review{company.reviewCount !== 1 ? 's' : ''}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Filter className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No companies found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find companies.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AllCompaniesView;
