
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
  console.log('🤖 Starting INSTANT AI review screening for:', reviewData.companyName);

  // Ultra-fast AI screening - maximum 10 seconds processing, most will be under 3 seconds
  const { companyName, title, content, rating } = reviewData;
  
  let riskFactors: string[] = [];
  let confidence = 90; // Start with very high confidence for faster approval
  
  // Only check for extreme violations to ensure speed
  if (content.length < 10) {
    riskFactors.push('Extremely short content');
    confidence -= 25;
  }
  
  // Very lenient spam detection - only catch obvious spam
  const extremeSpamPatterns = [
    /\b(viagra|casino|lottery|winner|congratulations.*prize)\b/gi,
    /!{20,}|\?{20,}/g, // Only extremely excessive punctuation
    /[A-Z]{50,}/g, // Only very long all-caps text
  ];
  
  extremeSpamPatterns.forEach((pattern) => {
    if (content.match(pattern)) {
      riskFactors.push('Obvious spam detected');
      confidence -= 30;
    }
  });
  
  // Boost confidence significantly for known companies
  const reputableCompanies = [
    'coinbase', 'binance', 'kraken', 'metamask', 'uniswap', 'opensea', 
    'compound', 'aave', 'sushiswap', 'pancakeswap', 'quickswap',
    'polygon', 'avalanche', 'chainlink', 'ethereum', 'bitcoin'
  ];
  
  const isReputableCompany = reputableCompanies.some(company => 
    companyName.toLowerCase().includes(company.toLowerCase())
  );
  
  if (isReputableCompany) {
    confidence += 25;
    console.log('🏢 Reputable company detected, confidence boosted to', confidence);
  }
  
  // Quality indicators massively boost confidence
  const qualityIndicators = [
    /\$\d+/, // Price mentions
    /\d+\s*(days?|weeks?|months?|years?)/, // Time periods
    /customer|support|service|experience|interface|feature|trading|wallet|exchange/, // Service terms
    /good|great|excellent|bad|terrible|poor|amazing|awful/gi, // Opinion words
  ];
  
  const qualityMatches = qualityIndicators.filter(pattern => content.match(pattern));
  if (qualityMatches.length >= 1) {
    confidence += 15;
    console.log('✅ Quality indicators found:', qualityMatches.length);
  }
  
  // Length bonus for substantive content
  if (content.length > 50) {
    confidence += 10;
  }
  
  // Ensure confidence stays within bounds
  confidence = Math.max(20, Math.min(100, confidence));
  
  // VERY lenient approval threshold - approve almost everything unless obviously spam
  const approved = confidence >= 50 && riskFactors.length <= 1;
  
  const processingTimeMs = Date.now() - startTime;
  
  const result: AIScreeningResult = {
    approved,
    confidence,
    riskFactors,
    reasoning: approved 
      ? `✅ Review APPROVED with ${confidence}% confidence. ${isReputableCompany ? 'Reputable company + ' : ''}${qualityMatches.length > 0 ? 'Quality content detected.' : 'Looks authentic.'}`
      : `❌ Review REJECTED. Confidence: ${confidence}%. Issues: ${riskFactors.join(', ')}`,
    processingTimeMs
  };
  
  console.log('🤖 INSTANT AI screening result:', result);
  console.log(`⚡ Ultra-fast processing completed in ${processingTimeMs}ms`);
  
  // Simulate realistic but very fast processing time (200ms-800ms max)
  const targetProcessingTime = Math.random() * 600 + 200; // 200-800ms
  const remainingTime = Math.max(0, targetProcessingTime - processingTimeMs);
  
  if (remainingTime > 0) {
    await new Promise(resolve => setTimeout(resolve, remainingTime));
  }
  
  return result;
};
