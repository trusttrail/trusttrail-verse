
import React from 'react';
import PortalContent from "@/components/review/PortalContent";

interface HomeTabProps {
  categories: any[];
  topCompanies: any[];
  recentReviews: any[];
  onWriteReviewClick: () => void;
  onExploreClick: () => void;
}

const HomeTab = ({
  categories,
  topCompanies,
  recentReviews,
  onWriteReviewClick,
  onExploreClick,
}: HomeTabProps) => (
  <PortalContent
    categories={categories}
    topCompanies={topCompanies}
    recentReviews={recentReviews}
    onWriteReviewClick={onWriteReviewClick}
    onExploreClick={onExploreClick}
  />
);

export default HomeTab;
