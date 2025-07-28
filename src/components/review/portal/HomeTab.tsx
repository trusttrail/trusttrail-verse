
import React from 'react';
import PortalContent from "@/components/review/PortalContent";
import { RealCompany, RealReview } from "@/hooks/useCompanyData";

interface HomeTabProps {
  categories: any[];
  topCompanies: RealCompany[];
  recentReviews: RealReview[];
  onWriteReviewClick: () => void;
  onExploreClick: () => void;
  loading?: boolean;
}

const HomeTab = ({
  categories,
  topCompanies,
  recentReviews,
  onWriteReviewClick,
  onExploreClick,
  loading,
}: HomeTabProps) => (
  <PortalContent
    categories={categories}
    topCompanies={topCompanies}
    recentReviews={recentReviews}
    onWriteReviewClick={onWriteReviewClick}
    onExploreClick={onExploreClick}
    loading={loading}
  />
);

export default HomeTab;
