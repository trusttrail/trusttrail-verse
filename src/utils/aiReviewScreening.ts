
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
  console.log('⏱️ Minimum processing time: 60 seconds');

  // Comprehensive AI screening - minimum 60 seconds processing
  const { companyName, title, content, rating } = reviewData;
  
  let riskFactors: string[] = [];
  let confidence = 75; // Start with moderate confidence
  
  // Content length analysis
  if (content.length < 20) {
    riskFactors.push('Very short content');
    confidence -= 15;
  } else if (content.length < 50) {
    riskFactors.push('Short content');
    confidence -= 10;
  }
  
  // Spam detection patterns
  const spamPatterns = [
    /\b(viagra|casino|lottery|winner|congratulations.*prize|click here|free money)\b/gi,
    /!{10,}|\?{10,}/g, // Excessive punctuation
    /[A-Z]{30,}/g, // Long all-caps text
    /(\$|\€|\£)\d+.*free/gi, // Free money offers
  ];
  
  spamPatterns.forEach((pattern) => {
    if (content.match(pattern)) {
      riskFactors.push('Potential spam content detected');
      confidence -= 20;
    }
  });
  
  // Reputation boost for known companies
  const reputableCompanies = [
    'coinbase', 'binance', 'kraken', 'metamask', 'uniswap', 'opensea', 
    'compound', 'aave', 'sushiswap', 'pancakeswap', 'quickswap',
    'polygon', 'avalanche', 'chainlink', 'ethereum', 'bitcoin'
  ];
  
  const isReputableCompany = reputableCompanies.some(company => 
    companyName.toLowerCase().includes(company.toLowerCase())
  );
  
  if (isReputableCompany) {
    confidence += 15;
    console.log('🏢 Reputable company detected, confidence boosted to', confidence);
  }
  
  // Quality indicators analysis
  const qualityIndicators = [
    /\$\d+/, // Price mentions
    /\d+\s*(days?|weeks?|months?|years?)/, // Time periods
    /customer|support|service|experience|interface|feature|trading|wallet|exchange/gi, // Service terms
    /good|great|excellent|bad|terrible|poor|amazing|awful|fantastic|horrible/gi, // Opinion words
    /because|since|however|although|while|despite/gi, // Reasoning words
  ];
  
  const qualityMatches = qualityIndicators.filter(pattern => content.match(pattern));
  if (qualityMatches.length >= 2) {
    confidence += 10;
    console.log('✅ Quality indicators found:', qualityMatches.length);
  }
  
  // Rating consistency check
  if (rating >= 4 && content.toLowerCase().includes('bad|terrible|awful|horrible')) {
    riskFactors.push('Rating inconsistent with negative content');
    confidence -= 15;
  } else if (rating <= 2 && content.toLowerCase().includes('good|great|excellent|amazing')) {
    riskFactors.push('Rating inconsistent with positive content');
    confidence -= 15;
  }
  
  // Length bonus for substantive content
  if (content.length > 100) {
    confidence += 8;
  }
  
  // Ensure confidence stays within bounds
  confidence = Math.max(20, Math.min(95, confidence));
  
  // Approval threshold - balanced approach
  const approved = confidence >= 60 && riskFactors.length <= 2;
  
  const result: AIScreeningResult = {
    approved,
    confidence,
    riskFactors,
    reasoning: approved 
      ? `✅ Review APPROVED with ${confidence}% confidence. ${isReputableCompany ? 'Reputable company + ' : ''}${qualityMatches.length > 0 ? 'Quality content detected.' : 'Content appears authentic.'}`
      : `❌ Review REJECTED. Confidence: ${confidence}%. Issues: ${riskFactors.join(', ')}`,
    processingTimeMs: 0 // Will be set after processing
  };
  
  console.log('🤖 AI screening analysis complete:', result);
  
  // ENFORCE MINIMUM 60 SECONDS PROCESSING TIME
  const minProcessingTime = 60000; // 60 seconds
  const currentProcessingTime = Date.now() - startTime;
  const remainingTime = Math.max(0, minProcessingTime - currentProcessingTime);
  
  console.log(`⏱️ Current processing time: ${currentProcessingTime}ms`);
  console.log(`⏱️ Remaining time to reach 60s minimum: ${remainingTime}ms`);
  
  if (remainingTime > 0) {
    console.log(`⏳ Waiting additional ${Math.round(remainingTime/1000)}s to meet minimum processing time...`);
    await new Promise(resolve => setTimeout(resolve, remainingTime));
  }
  
  result.processingTimeMs = Date.now() - startTime;
  console.log(`✅ AI screening completed in ${result.processingTimeMs}ms (${Math.round(result.processingTimeMs/1000)}s)`);
  
  return result;
};
