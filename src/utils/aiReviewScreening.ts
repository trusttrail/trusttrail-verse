
export interface AIScreeningResult {
  approved: boolean;
  confidence: number;
  riskFactors: string[];
  reasoning: string;
}

export const screenReviewWithAI = async (reviewData: {
  companyName: string;
  category: string;
  title: string;
  content: string;
  rating: number;
}): Promise<AIScreeningResult> => {
  console.log('🤖 Starting AI review screening for:', reviewData.companyName);

  // Simulate AI/ML screening logic
  // In production, this would call your actual AI service
  const { companyName, title, content, rating } = reviewData;
  
  let riskFactors: string[] = [];
  let confidence = 85; // Base confidence
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /amazing|incredible|best ever|changed my life/gi,
    /worst|terrible|scam|fraud|steal/gi,
    /buy now|limited time|act fast|don't miss/gi,
    /!{3,}|\.{3,}|\?{3,}/g, // Multiple punctuation
  ];
  
  // Check content quality
  if (content.length < 50) {
    riskFactors.push('Content too short');
    confidence -= 15;
  }
  
  if (content.length > 2000) {
    riskFactors.push('Content unusually long');
    confidence -= 5;
  }
  
  // Check for excessive enthusiasm or negativity
  suspiciousPatterns.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches && matches.length > 2) {
      if (index === 0) riskFactors.push('Excessive enthusiasm');
      if (index === 1) riskFactors.push('Excessive negativity');
      if (index === 2) riskFactors.push('Promotional language');
      if (index === 3) riskFactors.push('Excessive punctuation');
      confidence -= 10;
    }
  });
  
  // Check rating consistency
  const positiveWords = content.match(/good|great|excellent|love|recommend/gi);
  const negativeWords = content.match(/bad|terrible|hate|awful|horrible/gi);
  
  if (rating >= 4 && negativeWords && negativeWords.length > positiveWords?.length) {
    riskFactors.push('Rating inconsistent with content sentiment');
    confidence -= 20;
  }
  
  if (rating <= 2 && positiveWords && positiveWords.length > negativeWords?.length) {
    riskFactors.push('Rating inconsistent with content sentiment');
    confidence -= 20;
  }
  
  // Check for generic content
  const genericPhrases = [
    'this product', 'this service', 'this company', 'highly recommend',
    'five stars', 'ten out of ten', 'perfect', 'exactly what I needed'
  ];
  
  const genericMatches = genericPhrases.filter(phrase => 
    content.toLowerCase().includes(phrase.toLowerCase())
  );
  
  if (genericMatches.length > 3) {
    riskFactors.push('Generic language patterns');
    confidence -= 15;
  }
  
  // Check for specific details (positive signal)
  const specificIndicators = [
    /\$\d+/, // Mentions prices
    /\d+\s*(days?|weeks?|months?|years?)/, // Time periods
    /version|update|feature|interface/, // Technical terms
    /support|customer service|help/, // Service interactions
  ];
  
  const specificMatches = specificIndicators.filter(pattern => 
    content.match(pattern)
  );
  
  if (specificMatches.length >= 2) {
    confidence += 10;
  }
  
  // Final decision
  const approved = confidence >= 70 && riskFactors.length <= 2;
  
  const result: AIScreeningResult = {
    approved,
    confidence,
    riskFactors,
    reasoning: approved 
      ? `Review approved with ${confidence}% confidence. Contains specific details and appears authentic.`
      : `Review flagged for manual review. Confidence: ${confidence}%. Risk factors: ${riskFactors.join(', ')}`
  };
  
  console.log('🤖 AI screening result:', result);
  
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return result;
};
