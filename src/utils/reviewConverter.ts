
interface DatabaseReview {
  id: string;
  company_name: string;
  category: string;
  title: string;
  content: string;
  rating: number;
  wallet_address: string;
  created_at: string;
  status: string;
}

interface ConvertedReview {
  id: number;
  companyName: string;
  reviewerAddress: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  upvotes: number;
  downvotes: number;
  gitcoinScore: number;
  trustScore: number;
  comments: Array<{
    id: number;
    author: string;
    content: string;
    date: string;
  }>;
  shareReview: () => void;
}

export const convertDatabaseReviews = (
  databaseReviews: DatabaseReview[],
  shareReviewHandler: (review: { companyName: string; title: string }) => void
): ConvertedReview[] => {
  return databaseReviews.map((dbReview, index) => ({
    id: parseInt(dbReview.id.replace(/-/g, '').substring(0, 8), 16) || (Date.now() + index),
    companyName: dbReview.company_name,
    reviewerAddress: `${dbReview.wallet_address.substring(0, 6)}...${dbReview.wallet_address.substring(38)}`,
    rating: dbReview.rating,
    title: dbReview.title,
    content: dbReview.content,
    date: dbReview.created_at,
    verified: true,
    upvotes: Math.floor(Math.random() * 50) + 5,
    downvotes: Math.floor(Math.random() * 10) + 1,
    gitcoinScore: Math.floor(Math.random() * 40) + 60,
    trustScore: Math.floor(Math.random() * 3) + 7,
    comments: [
      {
        id: 1,
        author: "CryptoUser123",
        content: "Thanks for this detailed review! Very helpful.",
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        author: "BlockchainExplorer",
        content: "I had a similar experience with this company.",
        date: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ].slice(0, Math.floor(Math.random() * 3)),
    shareReview: () => shareReviewHandler({
      companyName: dbReview.company_name,
      title: dbReview.title
    })
  }));
};

export const enhanceReviews = (
  reviews: any[],
  shareReviewHandler: (review: any) => void
) => {
  return reviews.map(review => ({
    ...review,
    upvotes: review.upvotes || Math.floor(Math.random() * 50) + 5,
    downvotes: review.downvotes || Math.floor(Math.random() * 10) + 1,
    gitcoinScore: review.gitcoinScore || Math.floor(Math.random() * 40) + 60,
    trustScore: review.trustScore || Math.floor(Math.random() * 3) + 7,
    comments: review.comments || [],
    shareReview: () => shareReviewHandler(review)
  }));
};
