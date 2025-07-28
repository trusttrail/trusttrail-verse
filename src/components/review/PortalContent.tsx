
import React, { useState } from 'react';
import PortalHero from "@/components/review/PortalHero";
import SearchBar from "@/components/review/SearchBar";
import CategoriesSection from "@/components/review/CategoriesSection";
import TopCompaniesSection from "@/components/review/TopCompaniesSection";
import RecentReviewsSection from "@/components/review/RecentReviewsSection";
import AllCompaniesView from "@/components/review/AllCompaniesView";
import { RealCompany, RealReview } from "@/hooks/useCompanyData";

interface PortalContentProps {
  categories: any[];
  topCompanies: RealCompany[];
  recentReviews: RealReview[];
  onWriteReviewClick: () => void;
  onExploreClick: () => void;
  loading?: boolean;
}

const PortalContent = ({ 
  categories, 
  topCompanies, 
  recentReviews,
  onWriteReviewClick,
  onExploreClick,
  loading
}: PortalContentProps) => {
  const [showAllCompanies, setShowAllCompanies] = useState(false);
  
  // Extract the data needed for search suggestions with proper type mapping
  const searchCompanies = topCompanies.map((company, index) => ({
    id: index, // Convert string name to numeric ID for SearchBar compatibility
    name: company.name,
    category: company.category
  }));
  
  const searchCategories = categories.map(category => ({
    id: category.id,
    name: category.name
  }));

  // Transform RealReview[] to expected format for SearchBar and RecentReviewsSection
  const transformedRecentReviews = recentReviews.map((review, index) => ({
    id: index,
    companyName: review.company_name,
    reviewerAddress: review.wallet_address,
    rating: review.rating,
    title: review.title,
    content: review.content,
    date: review.created_at,
    verified: review.status === 'approved',
    // Remove all mock interaction data - no upvotes, downvotes, comments, etc.
    upvotes: 0,
    downvotes: 0,
    gitcoinScore: 0,
    trustScore: 0,
    hasUserVoted: false,
    userVoteType: null,
    comments: [] // No fake comments
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
        recentReviews={transformedRecentReviews}
      />
      <CategoriesSection categories={categories} />
      <TopCompaniesSection 
        companies={topCompanies} 
        onViewAll={() => setShowAllCompanies(true)}
        loading={loading}
      />
      <RecentReviewsSection reviews={transformedRecentReviews} />
    </div>
  );
};

export default PortalContent;
