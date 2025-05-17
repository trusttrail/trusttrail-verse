
import React from 'react';
import PortalHero from "@/components/review/PortalHero";
import SearchBar from "@/components/review/SearchBar";
import CategoriesSection from "@/components/review/CategoriesSection";
import TopCompaniesSection from "@/components/review/TopCompaniesSection";
import RecentReviewsSection from "@/components/review/RecentReviewsSection";

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
  return (
    <div className="space-y-10">
      <PortalHero 
        onWriteReviewClick={onWriteReviewClick} 
        onExploreClick={onExploreClick} 
      />
      <SearchBar />
      <CategoriesSection categories={categories} />
      <TopCompaniesSection companies={topCompanies} />
      <RecentReviewsSection reviews={recentReviews} />
    </div>
  );
};

export default PortalContent;
