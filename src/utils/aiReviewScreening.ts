
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

  // Simulate AI/ML screening logic with more realistic processing
  const { companyName, title, content, rating } = reviewData;
  
  let riskFactors: string[] = [];
  let confidence = 88; // Start with high confidence
  
  // Check for suspicious patterns - made less strict
  const suspiciousPatterns = [
    /amazing|incredible|best ever|changed my life/gi,
    /worst|terrible|scam|fraud|steal/gi,
    /buy now|limited time|act fast|don't miss/gi,
    /!{5,}|\.{5,}|\?{5,}/g, // Only flag excessive punctuation (5+ instead of 3+)
  ];
  
  // Content quality checks - more lenient
  if (content.length < 30) {
    riskFactors.push('Content very short');
    confidence -= 10;
  }
  
  if (content.length > 3000) {
    riskFactors.push('Content extremely long');
    confidence -= 5;
  }
  
  // Check for excessive patterns - made more lenient
  suspiciousPatterns.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches && matches.length > 3) { // Increased threshold from 2 to 3
      if (index === 0) riskFactors.push('Excessive enthusiasm');
      if (index === 1) riskFactors.push('Excessive negativity');
      if (index === 2) riskFactors.push('Promotional language');
      if (index === 3) riskFactors.push('Excessive punctuation');
      confidence -= 8; // Reduced penalty from 10 to 8
    }
  });
  
  // Rating consistency check - more forgiving
  const positiveWords = content.match(/good|great|excellent|love|recommend|satisfied|happy/gi);
  const negativeWords = content.match(/bad|terrible|hate|awful|horrible|disappointed|poor/gi);
  
  if (rating >= 4 && negativeWords && negativeWords.length > (positiveWords?.length || 0) + 2) {
    riskFactors.push('Rating-content mismatch');
    confidence -= 15;
  }
  
  if (rating <= 2 && positiveWords && positiveWords.length > (negativeWords?.length || 0) + 2) {
    riskFactors.push('Rating-content mismatch');
    confidence -= 15;
  }
  
  // Check for specific details (positive indicators)
  const specificIndicators = [
    /\$\d+/, // Mentions prices
    /\d+\s*(days?|weeks?|months?|years?)/, // Time periods
    /version|update|feature|interface|dashboard|app|website/, // Technical terms
    /support|customer service|help|team|staff/, // Service interactions
    /experience|used|tried|tested/, // Experience indicators
  ];
  
  const specificMatches = specificIndicators.filter(pattern => 
    content.match(pattern)
  );
  
  if (specificMatches.length >= 2) {
    confidence += 12; // Boost confidence for specific details
  }
  
  if (specificMatches.length >= 4) {
    confidence += 8; // Additional boost for very detailed reviews
  }
  
  // Company reputation boost (for well-known companies)
  const knownCompanies = ['coinbase', 'binance', 'kraken', 'metamask', 'uniswap'];
  if (knownCompanies.some(company => 
    companyName.toLowerCase().includes(company.toLowerCase())
  )) {
    confidence += 5;
    console.log('🏢 Known reputable company detected, confidence boosted');
  }
  
  // Ensure confidence doesn't exceed 100
  confidence = Math.min(100, confidence);
  
  // More lenient approval threshold
  const approved = confidence >= 65 && riskFactors.length <= 3;
  
  const processingTimeMs = Date.now() - startTime;
  
  const result: AIScreeningResult = {
    approved,
    confidence,
    riskFactors,
    reasoning: approved 
      ? `Review approved with ${confidence}% confidence. ${specificMatches.length > 0 ? 'Contains specific details and' : ''} appears authentic.`
      : `Review flagged for manual review. Confidence: ${confidence}%. Risk factors: ${riskFactors.join(', ')}`,
    processingTimeMs
  };
  
  console.log('🤖 AI screening result:', result);
  console.log(`⏱️ Processing completed in ${processingTimeMs}ms`);
  
  // Simulate realistic AI processing time (1-2 seconds)
  const remainingTime = Math.max(0, 1200 - processingTimeMs);
  await new Promise(resolve => setTimeout(resolve, remainingTime));
  
  return result;
};
