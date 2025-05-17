
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Award, MessageSquare, Globe, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BusinessesView = () => {
  const { toast } = useToast();
  
  const handleContact = () => {
    toast({
      title: "Request Submitted",
      description: "Thank you for your interest. Our team will contact you soon.",
    });
  };
  
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-2">For Businesses</h2>
      <p className="text-muted-foreground mb-8">Leverage blockchain-verified reviews to build trust with your customers</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-trustpurple-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Award className="text-trustpurple-500" size={28} />
            </div>
            <CardTitle>Build Credibility</CardTitle>
            <CardDescription>Showcase verified reviews to build trust with potential customers</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-trustpurple-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <MessageSquare className="text-trustpurple-500" size={28} />
            </div>
            <CardTitle>Gather Feedback</CardTitle>
            <CardDescription>Collect authentic feedback from real users with wallet verification</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-trustpurple-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Globe className="text-trustpurple-500" size={28} />
            </div>
            <CardTitle>Web3 Presence</CardTitle>
            <CardDescription>Strengthen your presence in the Web3 ecosystem with transparent reviews</CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <Card className="bg-gradient-to-r from-trustpurple-500/10 to-trustblue-500/10">
        <CardHeader>
          <CardTitle className="text-2xl">Claim Your Business Profile</CardTitle>
          <CardDescription className="text-lg">Take control of your company's reviews and build trust with the Web3 community</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="business-name" className="block text-sm font-medium mb-2">Business Name</label>
              <Input id="business-name" placeholder="Enter your business name" />
            </div>
            <div>
              <label htmlFor="business-category" className="block text-sm font-medium mb-2">Business Category</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="defi">DeFi</SelectItem>
                  <SelectItem value="nft">NFT Marketplaces</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium mb-2">Contact Name</label>
              <Input id="contact-name" placeholder="Your name" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>
            <div className="md:col-span-2">
              <Button onClick={handleContact} className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500 w-full">
                Request Business Verification
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessesView;
