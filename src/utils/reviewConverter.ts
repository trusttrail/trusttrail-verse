
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
  gitcoinScore?: number;
  trustScore: number;
  comments: Array<{
    id: number;
    author: string;
    content: string;
    date: string;
  }>;
  shareReview: () => void;
}

// Function to get actual Gitcoin score from localStorage or return null
const getActualGitcoinScore = (walletAddress: string): number | null => {
  try {
    // Check for stored passport data using wallet address
    const walletKey = `gitcoin_passport_wallet_${walletAddress}`;
    const storedData = localStorage.getItem(walletKey);
    
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      return parsedData.score || 0;
    }
    
    // Also check for any other user IDs that might have this wallet
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('gitcoin_passport_')) {
        const data = localStorage.getItem(key);
        if (data) {
          const parsedData = JSON.parse(data);
          if (parsedData.address === walletAddress) {
            return parsedData.score || 0;
          }
        }
      }
    }
    
    return null; // No verified score found
  } catch (error) {
    console.error('Error retrieving Gitcoin score:', error);
    return null;
  }
};

// Enhanced trust score calculation (0-100 scale, similar to Reddit karma)
const calculateTrustScore = (
  upvotes: number = 0,
  downvotes: number = 0,
  comments: number = 0,
  reviewAge: number = 0, // days since review
  gitcoinScore: number | null = null
): number => {
  // Base score from voting (Reddit-style algorithm)
  const totalVotes = upvotes + downvotes;
  let voteScore = 0;
  
  if (totalVotes > 0) {
    const ratio = upvotes / totalVotes;
    const confidence = Math.min(totalVotes / 10, 1); // Confidence increases with more votes
    voteScore = (ratio * 2 - 1) * confidence * 40; // -40 to +40 range
  }
  
  // Comment engagement bonus (up to 15 points)
  const commentBonus = Math.min(comments * 2, 15);
  
  // Time decay factor (newer reviews get slight bonus)
  const ageFactor = Math.max(0, 1 - (reviewAge / 365)) * 5; // Up to 5 points for new reviews
  
  // Gitcoin verification bonus (up to 25 points)
  let gitcoinBonus = 0;
  if (gitcoinScore !== null) {
    gitcoinBonus = Math.min(gitcoinScore / 4, 25); // Scale down to max 25 points
  }
  
  // Base score for having any engagement
  const baseScore = totalVotes > 0 || comments > 0 ? 20 : 10;
  
  // Calculate final score
  const rawScore = baseScore + voteScore + commentBonus + ageFactor + gitcoinBonus;
  
  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, Math.round(rawScore)));
};

export const convertDatabaseReviews = (
  databaseReviews: DatabaseReview[],
  shareReviewHandler: (review: { companyName: string; title: string }) => void
): ConvertedReview[] => {
  return databaseReviews.map((dbReview, index) => {
    // Get actual Gitcoin score - don't generate fake ones
    const actualGitcoinScore = getActualGitcoinScore(dbReview.wallet_address);
    
    // NO MOCK DATA - use 0 for all voting metrics since we don't have real voting system yet
    const upvotes = 0;
    const downvotes = 0;
    const commentCount = 0;
    
    // Calculate days since review
    const reviewAge = Math.floor((Date.now() - new Date(dbReview.created_at).getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate proper trust score based on real data only
    const trustScore = calculateTrustScore(upvotes, downvotes, commentCount, reviewAge, actualGitcoinScore);
    
    return {
      id: parseInt(dbReview.id.replace(/-/g, '').substring(0, 8), 16) || (Date.now() + index),
      companyName: dbReview.company_name,
      reviewerAddress: `${dbReview.wallet_address.substring(0, 6)}...${dbReview.wallet_address.substring(38)}`,
      rating: dbReview.rating,
      title: dbReview.title,
      content: dbReview.content,
      date: dbReview.created_at,
      verified: dbReview.status === 'approved',
      upvotes: 0, // Real data only - no votes yet
      downvotes: 0, // Real data only - no votes yet
      gitcoinScore: actualGitcoinScore, // Use actual score or undefined
      trustScore,
      comments: [], // Real data only - no comments yet
      shareReview: () => shareReviewHandler({
        companyName: dbReview.company_name,
        title: dbReview.title
      })
    };
  });
};

export const enhanceReviews = (
  reviews: any[],
  shareReviewHandler: (review: any) => void
) => {
  return reviews.map(review => {
    // Get actual Gitcoin score for enhanced reviews too
    const actualGitcoinScore = review.reviewerAddress ? 
      getActualGitcoinScore(review.reviewerAddress) : null;
    
    // NO MOCK DATA - use real values only
    const upvotes = 0; // Real data only
    const downvotes = 0; // Real data only
    const commentCount = 0; // Real data only
    
    // Calculate days since review
    const reviewAge = Math.floor((Date.now() - new Date(review.date).getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate proper trust score based on real data only
    const trustScore = calculateTrustScore(upvotes, downvotes, commentCount, reviewAge, actualGitcoinScore);
    
    return {
      ...review,
      upvotes: 0, // Real data only
      downvotes: 0, // Real data only
      gitcoinScore: actualGitcoinScore, // Use actual score or undefined
      trustScore,
      verified: review.verified || false,
      comments: [], // Real data only - no fake comments
      shareReview: () => shareReviewHandler(review)
    };
  });
};
