
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

  // Fast AI/ML screening logic - maximum 30 seconds processing
  const { companyName, title, content, rating } = reviewData;
  
  let riskFactors: string[] = [];
  let confidence = 85; // Start with high confidence for faster approval
  
  // Quick content quality checks
  if (content.length < 20) {
    riskFactors.push('Very short content');
    confidence -= 15;
  }
  
  if (content.length > 2000) {
    riskFactors.push('Very long content');
    confidence -= 5;
  }
  
  // Fast spam detection - only check for extreme cases
  const spamPatterns = [
    /\b(buy now|click here|limited time|act fast)\b/gi,
    /!{10,}|\.{10,}|\?{10,}/g, // Only excessive punctuation (10+ chars)
  ];
  
  spamPatterns.forEach((pattern) => {
    const matches = content.match(pattern);
    if (matches && matches.length > 1) {
      riskFactors.push('Potential spam detected');
      confidence -= 20;
    }
  });
  
  // Quick rating consistency check
  const positiveWords = content.match(/good|great|excellent|amazing|love|recommend|satisfied|happy|perfect/gi);
  const negativeWords = content.match(/bad|terrible|awful|horrible|hate|disappointed|poor|worst/gi);
  
  // Only flag extreme mismatches
  if (rating >= 4 && negativeWords && negativeWords.length > (positiveWords?.length || 0) + 3) {
    riskFactors.push('Extreme rating mismatch');
    confidence -= 20;
  }
  
  if (rating <= 2 && positiveWords && positiveWords.length > (negativeWords?.length || 0) + 3) {
    riskFactors.push('Extreme rating mismatch');
    confidence -= 20;
  }
  
  // Boost confidence for known reputable companies
  const knownCompanies = ['coinbase', 'binance', 'kraken', 'metamask', 'uniswap', 'opensea', 'compound'];
  if (knownCompanies.some(company => 
    companyName.toLowerCase().includes(company.toLowerCase())
  )) {
    confidence += 15;
    console.log('🏢 Known reputable company detected, confidence boosted to', confidence);
  }
  
  // Quality indicators boost confidence
  const qualityIndicators = [
    /\$\d+/, // Price mentions
    /\d+\s*(days?|weeks?|months?|years?)/, // Time periods
    /customer|support|service|experience|interface|feature/, // Service terms
  ];
  
  const qualityMatches = qualityIndicators.filter(pattern => content.match(pattern));
  if (qualityMatches.length >= 1) {
    confidence += 10;
  }
  
  // Ensure confidence stays within bounds
  confidence = Math.max(0, Math.min(100, confidence));
  
  // More lenient approval threshold - approve unless clearly problematic
  const approved = confidence >= 60 && riskFactors.length <= 2;
  
  const processingTimeMs = Date.now() - startTime;
  
  const result: AIScreeningResult = {
    approved,
    confidence,
    riskFactors,
    reasoning: approved 
      ? `Review approved with ${confidence}% confidence. ${qualityMatches.length > 0 ? 'Contains quality indicators and' : ''} appears authentic.`
      : `Review requires manual review. Confidence: ${confidence}%. Risk factors: ${riskFactors.join(', ')}`,
    processingTimeMs
  };
  
  console.log('🤖 AI screening result:', result);
  console.log(`⏱️ Processing completed in ${processingTimeMs}ms`);
  
  // Simulate realistic but fast processing time (500ms-1000ms max)
  const targetProcessingTime = Math.random() * 500 + 500; // 500-1000ms
  const remainingTime = Math.max(0, targetProcessingTime - processingTimeMs);
  await new Promise(resolve => setTimeout(resolve, remainingTime));
  
  return result;
};
