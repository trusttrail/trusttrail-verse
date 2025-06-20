
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Award, MessageSquare, Globe, Building, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MerchantFormData {
  companyName: string;
  email: string;
  category: string;
  contactName: string;
}

const BusinessesTab = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<MerchantFormData>({
    companyName: '',
    email: '',
    category: '',
    contactName: ''
  });

  const handleInputChange = (field: keyof MerchantFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.companyName || !formData.email || !formData.category || !formData.contactName) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Send email notification to admin
      const response = await fetch('/api/send-merchant-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          adminEmail: 'hellotrustrail@gmail.com'
        }),
      });

      if (response.ok) {
        toast({
          title: "Application Submitted Successfully",
          description: "Thank you for your interest! Our team will review your application and contact you within 2-3 business days.",
        });
        
        // Reset form
        setFormData({
          companyName: '',
          email: '',
          category: '',
          contactName: ''
        });
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting merchant application:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-2">Merchant Analytics Subscription</h2>
      <p className="text-muted-foreground mb-8">Join TrustTrail's merchant program to access customized analytics and make data-driven decisions based on verified user reviews</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-trustpurple-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Award className="text-trustpurple-500" size={28} />
            </div>
            <CardTitle>Analytics Dashboard</CardTitle>
            <CardDescription>Access detailed analytics about your business performance and customer feedback trends</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-trustpurple-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <MessageSquare className="text-trustpurple-500" size={28} />
            </div>
            <CardTitle>Review Management</CardTitle>
            <CardDescription>Monitor and respond to customer reviews with advanced filtering and categorization tools</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-trustpurple-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Globe className="text-trustpurple-500" size={28} />
            </div>
            <CardTitle>Data-Driven Insights</CardTitle>
            <CardDescription>Leverage blockchain-verified feedback to identify problems and improve your Web3 presence</CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <Card className="bg-gradient-to-r from-trustpurple-500/10 to-trustblue-500/10">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <Building className="text-trustpurple-500" size={28} />
            Apply for Merchant Analytics Access
          </CardTitle>
          <CardDescription className="text-lg">
            Subscribe to our merchant analytics program and unlock powerful insights to grow your Web3 business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="company-name" className="block text-sm font-medium mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <Input 
                id="company-name" 
                placeholder="Enter your company name"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="business-category" className="block text-sm font-medium mb-2">
                Business Category <span className="text-red-500">*</span>
              </label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="defi">DeFi Protocol</SelectItem>
                  <SelectItem value="cex">Centralized Exchange</SelectItem>
                  <SelectItem value="dex">Decentralized Exchange</SelectItem>
                  <SelectItem value="nft">NFT Marketplace</SelectItem>
                  <SelectItem value="gaming">Gaming Platform</SelectItem>
                  <SelectItem value="lending">Lending Platform</SelectItem>
                  <SelectItem value="dao">DAO</SelectItem>
                  <SelectItem value="layer1">Layer 1 Blockchain</SelectItem>
                  <SelectItem value="layer2">Layer 2 Solution</SelectItem>
                  <SelectItem value="other">Other Web3 Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium mb-2">
                Contact Person Name <span className="text-red-500">*</span>
              </label>
              <Input 
                id="contact-name" 
                placeholder="Your full name"
                value={formData.contactName}
                onChange={(e) => handleInputChange('contactName', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Business Email <span className="text-red-500">*</span>
              </label>
              <Input 
                id="email" 
                type="email" 
                placeholder="business@company.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500 w-full h-12 text-white font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  'Submit Merchant Application'
                )}
              </Button>
            </div>
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">What happens next?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Our team will review your application within 2-3 business days</li>
              <li>• You'll receive an email with subscription details and pricing</li>
              <li>• Once approved, you'll get access to your merchant analytics dashboard</li>
              <li>• Start leveraging verified user feedback to improve your business</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessesTab;
