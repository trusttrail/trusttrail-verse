
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ParticleContainer from '@/components/ParticleContainer';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star } from 'lucide-react';
import { sampleCompanies } from '@/data/companyData';
import ReviewCard from '@/components/review/ReviewCard';
import { Card, CardContent } from '@/components/ui/card';

const CompanyReviews = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { toast } = useToast();
  const [company, setCompany] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompanyData = () => {
      const foundCompany = sampleCompanies.find(c => c.id === parseInt(companyId || '0'));
      
      if (!foundCompany) {
        toast({
          title: "Company Not Found",
          description: "The company you're looking for doesn't exist.",
          variant: "destructive",
        });
        navigate('/review-portal');
        return;
      }

      setCompany(foundCompany);

      // Sample reviews for demonstration - in a real app, fetch from API
      const sampleReviews = [
        {
          id: 1,
          companyName: foundCompany.name,
          reviewerAddress: "0x1234...5678",
          rating: 5,
          title: `Excellent experience with ${foundCompany.name}`,
          content: `I've been using ${foundCompany.name} for several months now and the experience has been outstanding. The platform is user-friendly, secure, and offers great features.`,
          date: "2024-01-15",
          verified: true,
          upvotes: 24,
          downvotes: 2,
          gitcoinScore: 85.5,
          trustScore: 9.2,
          hasUserVoted: false,
          userVoteType: null
        },
        {
          id: 2,
          companyName: foundCompany.name,
          reviewerAddress: "0x9876...4321",
          rating: 4,
          title: `Good platform with room for improvement`,
          content: `${foundCompany.name} is a solid platform overall. The interface could be more intuitive, but the core functionality works well. Customer support is responsive.`,
          date: "2024-01-10",
          verified: true,
          upvotes: 18,
          downvotes: 5,
          gitcoinScore: 72.3,
          trustScore: 8.1,
          hasUserVoted: false,
          userVoteType: null
        }
      ];

      // Only show reviews if company has reviews (for demo, show reviews for first 10 companies)
      if (foundCompany.id <= 10) {
        setReviews(sampleReviews);
      } else {
        setReviews([]);
      }

      setLoading(false);
    };

    loadCompanyData();
  }, [companyId, toast, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        <ParticleContainer theme={theme} />
        <div className="flex-grow container mx-auto px-4 pt-24 pb-16 relative z-10">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading company reviews...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!company) {
    return null;
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <ParticleContainer theme={theme} />
      <div className="flex-grow container mx-auto px-4 pt-24 pb-16 relative z-10">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/review-portal')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Review Portal
          </Button>
        </div>

        {/* Company Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              {company.logo && (
                <img 
                  src={company.logo} 
                  alt={`${company.name} logo`}
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <div>
                <h1 className="text-3xl font-bold">{company.name}</h1>
                <p className="text-muted-foreground">{company.category}</p>
              </div>
            </div>
            
            {reviews.length > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={`${
                        star <= averageRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-medium">{averageRating.toFixed(1)}</span>
                </div>
                <span className="text-muted-foreground">
                  {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">
            Reviews for {company.name}
          </h2>
          
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <Star className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">No Reviews Found</h3>
                    <p className="text-muted-foreground mb-4">
                      {company.name} doesn't have any reviews yet. Be the first to share your experience!
                    </p>
                    <Button 
                      onClick={() => navigate('/review-portal?tab=write-review')}
                      className="bg-trustpurple-500 hover:bg-trustpurple-600"
                    >
                      Write a Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CompanyReviews;
