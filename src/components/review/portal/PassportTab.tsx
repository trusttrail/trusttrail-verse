
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, CheckCircle, AlertCircle, RefreshCw, ExternalLink, Award, Star, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PassportTabProps {
  isWalletConnected: boolean;
  connectWallet: () => void;
  walletAddress?: string;
}

interface PassportStamp {
  id: string;
  provider: string;
  credential: {
    credentialSubject: {
      provider: string;
      hash: string;
    };
  };
  verified: boolean;
  score: number;
}

interface PassportData {
  score: number;
  stamps: PassportStamp[];
  lastUpdated: Date;
  isVerified: boolean;
}

const PassportTab = ({ isWalletConnected, connectWallet, walletAddress }: PassportTabProps) => {
  const { toast } = useToast();
  const [passportData, setPassportData] = useState<PassportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnectingPassport, setIsConnectingPassport] = useState(false);

  // Mock passport providers for demonstration
  const availableProviders = [
    { id: 'github', name: 'GitHub', description: 'Verify your GitHub account', score: 2.5, icon: '🐙' },
    { id: 'twitter', name: 'Twitter', description: 'Verify your Twitter account', score: 2.0, icon: '🐦' },
    { id: 'discord', name: 'Discord', description: 'Verify your Discord account', score: 1.5, icon: '💬' },
    { id: 'google', name: 'Google', description: 'Verify your Google account', score: 2.0, icon: '📧' },
    { id: 'linkedin', name: 'LinkedIn', description: 'Verify your LinkedIn profile', score: 3.0, icon: '💼' },
    { id: 'brightid', name: 'BrightID', description: 'Prove you are a unique human', score: 4.0, icon: '🌟' },
    { id: 'poh', name: 'Proof of Humanity', description: 'Humanness verification', score: 5.0, icon: '👤' },
    { id: 'ens', name: 'ENS Domain', description: 'Own an ENS domain', score: 1.5, icon: '🌐' }
  ];

  useEffect(() => {
    if (isWalletConnected && walletAddress) {
      loadPassportData();
    }
  }, [isWalletConnected, walletAddress]);

  const loadPassportData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to Gitcoin Passport
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock passport data
      const mockData: PassportData = {
        score: 12.5,
        stamps: [
          {
            id: '1',
            provider: 'github',
            credential: {
              credentialSubject: {
                provider: 'GitHub',
                hash: 'abc123'
              }
            },
            verified: true,
            score: 2.5
          },
          {
            id: '2',
            provider: 'twitter',
            credential: {
              credentialSubject: {
                provider: 'Twitter',
                hash: 'def456'
              }
            },
            verified: true,
            score: 2.0
          }
        ],
        lastUpdated: new Date(),
        isVerified: true
      };

      setPassportData(mockData);
    } catch (error) {
      toast({
        title: "Failed to Load Passport",
        description: "Could not retrieve your Gitcoin Passport data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const connectPassport = async () => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first to access Gitcoin Passport.",
        variant: "destructive",
      });
      return;
    }

    setIsConnectingPassport(true);
    try {
      // Simulate connecting to Gitcoin Passport
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Passport Connected",
        description: "Successfully connected to your Gitcoin Passport!",
      });

      await loadPassportData();
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Gitcoin Passport. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnectingPassport(false);
    }
  };

  const addStamp = async (providerId: string) => {
    if (!passportData) return;

    try {
      toast({
        title: "Adding Stamp",
        description: "Redirecting to verify your account...",
      });

      // Simulate adding a stamp
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const provider = availableProviders.find(p => p.id === providerId);
      if (provider) {
        const newStamp: PassportStamp = {
          id: Date.now().toString(),
          provider: providerId,
          credential: {
            credentialSubject: {
              provider: provider.name,
              hash: Math.random().toString(36).substring(7)
            }
          },
          verified: true,
          score: provider.score
        };

        setPassportData(prev => prev ? {
          ...prev,
          stamps: [...prev.stamps, newStamp],
          score: prev.score + provider.score,
          lastUpdated: new Date()
        } : null);

        toast({
          title: "Stamp Added",
          description: `Successfully verified your ${provider.name} account!`,
        });
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Could not verify your account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const refreshPassport = async () => {
    await loadPassportData();
    toast({
      title: "Passport Refreshed",
      description: "Your passport data has been updated.",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 20) return "text-green-600";
    if (score >= 10) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreDescription = (score: number) => {
    if (score >= 20) return "Excellent reputation";
    if (score >= 10) return "Good reputation";
    if (score >= 5) return "Fair reputation";
    return "Low reputation";
  };

  if (!isWalletConnected) {
    return (
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Gitcoin Passport</h2>
        <p className="text-muted-foreground mb-8">Verify your identity and build your reputation score</p>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="text-blue-500" size={20} />
              Connect Your Wallet
            </CardTitle>
            <CardDescription>
              You need to connect your wallet to access Gitcoin Passport verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={connectWallet} className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-2">Gitcoin Passport</h2>
      <p className="text-muted-foreground mb-8">Verify your identity and build your reputation score</p>

      {!passportData && !isLoading ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="text-blue-500" size={20} />
              Connect Gitcoin Passport
            </CardTitle>
            <CardDescription>
              Connect your Gitcoin Passport to start building your reputation score and unlock platform benefits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Why verify with Gitcoin Passport?</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Build trust with other users</li>
                <li>• Access premium platform features</li>
                <li>• Earn reputation-based rewards</li>
                <li>• Prevent Sybil attacks</li>
              </ul>
            </div>
            <Button 
              onClick={connectPassport} 
              disabled={isConnectingPassport}
              className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500"
            >
              {isConnectingPassport ? (
                <>
                  <RefreshCw className="animate-spin mr-2" size={16} />
                  Connecting...
                </>
              ) : (
                <>
                  <Shield className="mr-2" size={16} />
                  Connect Passport
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.open('https://passport.gitcoin.co/', '_blank')}
            >
              <ExternalLink className="mr-2" size={16} />
              Learn More
            </Button>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <RefreshCw className="animate-spin mx-auto mb-4" size={32} />
            <p>Loading your Gitcoin Passport...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Passport Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="text-green-500" size={20} />
                  Your Passport Score
                </CardTitle>
                <Button variant="outline" size="sm" onClick={refreshPassport}>
                  <RefreshCw size={14} className="mr-1" />
                  Refresh
                </Button>
              </div>
              <CardDescription>
                Last updated: {passportData?.lastUpdated.toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(passportData?.score || 0)}`}>
                    {passportData?.score.toFixed(1)}
                  </div>
                  <p className="text-sm text-muted-foreground">Reputation Score</p>
                  <Badge variant={passportData?.score >= 10 ? "default" : "secondary"} className="mt-1">
                    {getScoreDescription(passportData?.score || 0)}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">
                    {passportData?.stamps.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Verified Stamps</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600">
                    {passportData?.isVerified ? (
                      <CheckCircle className="mx-auto text-green-500" size={32} />
                    ) : (
                      <AlertCircle className="mx-auto text-yellow-500" size={32} />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {passportData?.isVerified ? "Verified" : "Pending"}
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progress to Next Level</span>
                  <span className="text-sm text-muted-foreground">
                    {passportData?.score.toFixed(1)}/20
                  </span>
                </div>
                <Progress value={(passportData?.score || 0) * 5} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="stamps" className="w-full">
            <TabsList>
              <TabsTrigger value="stamps">My Stamps</TabsTrigger>
              <TabsTrigger value="available">Available Verifications</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
            </TabsList>

            <TabsContent value="stamps" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {passportData?.stamps.map((stamp) => {
                  const provider = availableProviders.find(p => p.id === stamp.provider);
                  return (
                    <Card key={stamp.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{provider?.icon}</span>
                            <span className="font-medium">{provider?.name}</span>
                          </div>
                          {stamp.verified && (
                            <CheckCircle className="text-green-500" size={16} />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Score: +{stamp.score}
                        </p>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Verified
                        </Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="available" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableProviders
                  .filter(provider => !passportData?.stamps.some(stamp => stamp.provider === provider.id))
                  .map((provider) => (
                    <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{provider.icon}</span>
                          <span className="font-medium">{provider.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {provider.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">
                            +{provider.score} score
                          </Badge>
                          <Button 
                            size="sm" 
                            onClick={() => addStamp(provider.id)}
                            className="bg-gradient-to-r from-trustpurple-500 to-trustblue-500"
                          >
                            Verify
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="benefits" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="text-yellow-500" size={20} />
                      Reputation Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Star className="text-yellow-500" size={16} />
                      <div>
                        <p className="font-medium">Trusted Reviewer Badge</p>
                        <p className="text-sm text-muted-foreground">Score ≥ 10</p>
                      </div>
                      {(passportData?.score || 0) >= 10 ? (
                        <CheckCircle className="text-green-500 ml-auto" size={16} />
                      ) : (
                        <Lock className="text-gray-400 ml-auto" size={16} />
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Star className="text-yellow-500" size={16} />
                      <div>
                        <p className="font-medium">Priority Review Processing</p>
                        <p className="text-sm text-muted-foreground">Score ≥ 15</p>
                      </div>
                      {(passportData?.score || 0) >= 15 ? (
                        <CheckCircle className="text-green-500 ml-auto" size={16} />
                      ) : (
                        <Lock className="text-gray-400 ml-auto" size={16} />
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Star className="text-yellow-500" size={16} />
                      <div>
                        <p className="font-medium">Expert Reviewer Status</p>
                        <p className="text-sm text-muted-foreground">Score ≥ 20</p>
                      </div>
                      {(passportData?.score || 0) >= 20 ? (
                        <CheckCircle className="text-green-500 ml-auto" size={16} />
                      ) : (
                        <Lock className="text-gray-400 ml-auto" size={16} />
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="text-blue-500" size={20} />
                      Platform Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Shield className="text-blue-500" size={16} />
                      <div>
                        <p className="font-medium">Enhanced Review Weight</p>
                        <p className="text-sm text-muted-foreground">Higher impact on scores</p>
                      </div>
                      <CheckCircle className="text-green-500 ml-auto" size={16} />
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="text-blue-500" size={16} />
                      <div>
                        <p className="font-medium">Reduced Review Delays</p>
                        <p className="text-sm text-muted-foreground">Faster moderation</p>
                      </div>
                      <CheckCircle className="text-green-500 ml-auto" size={16} />
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="text-blue-500" size={16} />
                      <div>
                        <p className="font-medium">Access to Beta Features</p>
                        <p className="text-sm text-muted-foreground">Early access to new tools</p>
                      </div>
                      {(passportData?.score || 0) >= 10 ? (
                        <CheckCircle className="text-green-500 ml-auto" size={16} />
                      ) : (
                        <Lock className="text-gray-400 ml-auto" size={16} />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default PassportTab;
