
export interface AIScreeningResult {
  approved: boolean;
  confidence: number;
  riskFactors: string[];
  reasoning: string;
  processingTimeMs: number;
}

export const screenReviewWithAI = async (reviewData: {
  companyName: string;
  category: string;
  title: string;
  content: string;
  rating: number;
}): Promise<AIScreeningResult> => {
  const startTime = Date.now();
  console.log('🤖 Starting AI review screening for:', reviewData.companyName);
  console.log('🤖 TEST PHASE: Quick AI review screening for:', reviewData.companyName);
  
  // Enhanced AI screening for TEST PHASE - more lenient approval
  const { companyName, title, content, rating } = reviewData;
  
  let riskFactors: string[] = [];
  let confidence = 85; // Start with higher confidence for test phase
  
  // Content length analysis - more lenient
  if (content.length < 10) {
    riskFactors.push('Very short content');
    confidence -= 10; // Reduced penalty
  } else if (content.length < 25) {
    riskFactors.push('Short content');
    confidence -= 5; // Reduced penalty
  }
  
  // Spam detection patterns - only severe spam
  const spamPatterns = [
    /\b(viagra|casino|lottery)\b/gi, // Removed milder patterns
    /!{20,}|\?{20,}/g, // Only excessive punctuation (20+ instead of 10+)
    /[A-Z]{50,}/g, // Only very long all-caps text (50+ instead of 30+)
  ];
  
  spamPatterns.forEach((pattern) => {
    if (content.match(pattern)) {
      riskFactors.push('Severe spam content detected');
      confidence -= 15; // Reduced penalty
    }
  });
  
  // Reputation boost for known companies - enhanced
  const reputableCompanies = [
    'coinbase', 'binance', 'kraken', 'metamask', 'uniswap', 'opensea', 
    'compound', 'aave', 'sushiswap', 'pancakeswap', 'quickswap',
    'polygon', 'avalanche', 'chainlink', 'ethereum', 'bitcoin',
    'curve', 'balancer', 'synthetix', 'maker', 'yearn'
  ];
  
  const isReputableCompany = reputableCompanies.some(company => 
    companyName.toLowerCase().includes(company.toLowerCase())
  );
  
  if (isReputableCompany) {
    confidence += 10; // Bonus for reputable companies
    console.log('🏢 Reputable company detected, confidence boosted to', confidence);
  }
  
  // Quality indicators analysis - more generous
  const qualityIndicators = [
    /\$\d+/, // Price mentions
    /\d+\s*(days?|weeks?|months?|years?)/, // Time periods
    /customer|support|service|experience|interface|feature|trading|wallet|exchange|liquidity|staking|yield|rewards/gi, // More terms
    /good|great|excellent|bad|terrible|poor|amazing|awful|fantastic|horrible|nice|decent|okay|solid|impressive/gi, // More opinion words
    /because|since|however|although|while|despite|actually|really|very|quite|pretty|fairly/gi, // More reasoning words
  ];
  
  const qualityMatches = qualityIndicators.filter(pattern => content.match(pattern));
  if (qualityMatches.length >= 1) { // Reduced requirement from 2 to 1
    confidence += 8; // Generous bonus
    console.log('✅ Quality indicators found:', qualityMatches.length);
  }
  
  // Rating consistency check - more lenient
  const negativeWords = /\b(bad|terrible|awful|horrible|worst|hate|scam|fraud)\b/gi;
  const positiveWords = /\b(good|great|excellent|amazing|best|love|fantastic|awesome)\b/gi;
  
  if (rating >= 4 && negativeWords.test(content)) {
    riskFactors.push('Rating inconsistent with negative content');
    confidence -= 10; // Reduced penalty
  } else if (rating <= 2 && positiveWords.test(content)) {
    riskFactors.push('Rating inconsistent with positive content');
    confidence -= 10; // Reduced penalty
  }
  
  // Length bonus for substantive content - more generous
  if (content.length > 50) { // Reduced requirement
    confidence += 5;
  }
  if (content.length > 150) { // Additional bonus
    confidence += 5;
  }
  
  // TEST PHASE: Extra lenient approval threshold
  confidence = Math.max(30, Math.min(98, confidence)); // Higher floor, higher ceiling
  
  // Very lenient approval threshold for testing
  const approved = confidence >= 45 && riskFactors.length <= 3; // Much more lenient
  
  const result: AIScreeningResult = {
    approved,
    confidence,
    riskFactors,
    reasoning: approved 
      ? `✅ TEST PHASE: Review APPROVED with ${confidence}% confidence. ${isReputableCompany ? 'Reputable company + ' : ''}${qualityMatches.length > 0 ? 'Quality content detected.' : 'Content appears authentic.'}`
      : `❌ TEST PHASE: Review needs review. Confidence: ${confidence}%. Issues: ${riskFactors.join(', ')}`,
    processingTimeMs: Date.now() - startTime
  };
  
  console.log('🤖 Quick AI screening complete:', result);
  return result;
};
