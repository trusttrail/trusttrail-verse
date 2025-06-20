
import React, { useState } from 'react';
import PortalHero from "@/components/review/PortalHero";
import SearchBar from "@/components/review/SearchBar";
import CategoriesSection from "@/components/review/CategoriesSection";
import TopCompaniesSection from "@/components/review/TopCompaniesSection";
import RecentReviewsSection from "@/components/review/RecentReviewsSection";
import AllCompaniesView from "@/components/review/AllCompaniesView";

interface PortalContentProps {
  categories: any[];
  topCompanies: any[];
  recentReviews: any[];
  onWriteReviewClick: () => void;
  onExploreClick: () => void;
}

const PortalContent = ({ 
  categories, 
  topCompanies, 
  recentReviews,
  onWriteReviewClick,
  onExploreClick
}: PortalContentProps) => {
  const [showAllCompanies, setShowAllCompanies] = useState(false);
  
  // Extract the data needed for search suggestions
  const searchCompanies = topCompanies.map(company => ({
    id: company.id,
    name: company.name,
    category: company.category
  }));
  
  const searchCategories = categories.map(category => ({
    id: category.id,
    name: category.name
  }));

  if (showAllCompanies) {
    return <AllCompaniesView onBack={() => setShowAllCompanies(false)} />;
  }

  return (
    <div className="space-y-10">
      <PortalHero 
        onWriteReviewClick={onWriteReviewClick} 
        onExploreClick={onExploreClick} 
      />
      <SearchBar 
        companies={searchCompanies}
        categories={searchCategories}
        recentReviews={recentReviews}
      />
      <CategoriesSection categories={categories} />
      <TopCompaniesSection 
        companies={topCompanies} 
        onViewAll={() => setShowAllCompanies(true)}
      />
      <RecentReviewsSection reviews={recentReviews} />
    </div>
  );
};

export default PortalContent;
