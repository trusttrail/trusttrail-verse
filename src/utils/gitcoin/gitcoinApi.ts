
const GITCOIN_API_BASE = 'https://api.scorer.gitcoin.co';
const GITCOIN_COMMUNITY_ID = '335'; // Default community ID for basic scoring

export const fetchGitcoinScore = async (walletAddress: string): Promise<number | null> => {
  try {
    console.log('Fetching Gitcoin Passport score for:', walletAddress);
    
    // Try the official Gitcoin Passport API
    const response = await fetch(`${GITCOIN_API_BASE}/registry/score/${GITCOIN_COMMUNITY_ID}/${walletAddress}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Gitcoin API response:', data);
      
      // Parse the score from the API response
      const score = parseFloat(data.score) || 0;
      console.log('Parsed score:', score);
      
      return score > 0 ? score : null;
    } else if (response.status === 404) {
      console.log('No passport found for this address');
      return null;
    } else {
      console.warn('Gitcoin API returned status:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Error fetching Gitcoin score:', error);
    return null;
  }
};

// Alternative API endpoint for stamp verification
export const fetchGitcoinStamps = async (walletAddress: string): Promise<any[]> => {
  try {
    const response = await fetch(`${GITCOIN_API_BASE}/registry/stamps/${walletAddress}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.items || [];
    }
  } catch (error) {
    console.error('Error fetching Gitcoin stamps:', error);
  }
  
  return [];
};
