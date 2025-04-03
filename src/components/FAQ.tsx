
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What is TrustTrail?",
      answer: "TrustTrail is a blockchain-based review platform where users are rewarded with $NOCAP tokens for leaving genuine reviews. Every review is verified and stored on the blockchain for complete transparency and trust."
    },
    {
      question: "How do I earn $NOCAP tokens?",
      answer: "You can earn $NOCAP tokens by submitting verified reviews on the platform. The amount of tokens earned depends on the quality of your review, your reputation score, and your engagement history. Additional tokens can be earned through staking and participating in community governance."
    },
    {
      question: "Are my reviews anonymous?",
      answer: "TrustTrail gives you control over your identity. You can choose to review anonymously while still verifying your identity with your wallet signature. Alternatively, you can build a public reviewer profile to increase your reputation and earn more rewards."
    },
    {
      question: "How does the blockchain verification work?",
      answer: "When you submit a review, it's cryptographically signed using your wallet and then stored on the blockchain with a timestamp. This creates an immutable record that can't be altered or deleted, ensuring that all reviews remain authentic and free from tampering."
    },
    {
      question: "What can I do with my $NOCAP tokens?",
      answer: "You can stake your tokens to earn additional rewards, use them to access premium features, vote on platform governance proposals, or exchange them on supported cryptocurrency exchanges for other tokens or fiat currency."
    },
    {
      question: "How do businesses benefit from TrustTrail?",
      answer: "Businesses get access to genuine customer feedback verified on the blockchain, increasing trust with potential customers. Our AI-powered analytics tools provide valuable insights from review data to help businesses improve their products and services. Businesses can also engage directly with reviewers through the platform."
    },
    {
      question: "What are TrustTrail NFTs?",
      answer: "TrustTrail NFTs are special digital assets that users can earn based on their review activity and reputation. These NFTs can provide benefits such as increased token rewards, access to exclusive platform features, and status within the community."
    },
    {
      question: "How is TrustTrail different from other review platforms?",
      answer: "TrustTrail stands apart by combining blockchain verification for trustworthiness, a token reward system to incentivize genuine reviews, and AI-powered insights for businesses. This creates a more balanced ecosystem that benefits both reviewers and businesses."
    },
  ];

  return (
    <section id="faq" className="section-padding">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Get answers to the most common questions about TrustTrail and how it works
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto glass-card p-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium py-4">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-foreground/70">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
