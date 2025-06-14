
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  BookOpen, 
  Terminal, 
  ExternalLink, 
  Copy, 
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';

export const DeploymentInstructions: React.FC = () => {
  const { toast } = useToast();
  const [copiedCommand, setCopiedCommand] = useState<string>('');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(label);
    setTimeout(() => setCopiedCommand(''), 2000);
    
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const CommandBlock = ({ command, label }: { command: string; label: string }) => (
    <div className="relative bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm">
      <pre className="whitespace-pre-wrap break-all pr-10">{command}</pre>
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2 h-8 w-8 p-0"
        onClick={() => copyToClipboard(command, label)}
      >
        {copiedCommand === label ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Deployment Instructions
          </CardTitle>
          <CardDescription>
            Follow these steps to deploy your TrustTrail smart contracts to Mumbai testnet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Step 1: Environment Setup */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Step 1</Badge>
              <h3 className="text-lg font-semibold">Environment Setup</h3>
            </div>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                First, set up your environment variables. You'll need a MetaMask private key and Mumbai MATIC tokens.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <p className="text-sm font-medium">Copy environment template:</p>
              <CommandBlock 
                command="cp .env.example .env" 
                label="Copy env command"
              />
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Required in .env file:</h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• <code>PRIVATE_KEY</code> - Your MetaMask private key (without 0x prefix)</li>
                <li>• <code>MUMBAI_RPC_URL</code> - Already configured</li>
                <li>• <code>POLYGONSCAN_API_KEY</code> - Optional, for contract verification</li>
              </ul>
            </div>

            <Button 
              variant="outline" 
              onClick={() => window.open('https://faucet.polygon.technology/', '_blank')}
              className="w-full"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Get Mumbai MATIC Tokens
            </Button>
          </div>

          {/* Step 2: Deploy Contracts */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Step 2</Badge>
              <h3 className="text-lg font-semibold">Deploy to Mumbai Testnet</h3>
            </div>
            
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertDescription>
                This command will deploy both TrustTrailToken and TrustTrailReviews contracts.
              </AlertDescription>
            </Alert>

            <CommandBlock 
              command="npx hardhat run scripts/deploy.js --network mumbai" 
              label="Deploy command"
            />

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">What this does:</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Deploys TrustTrailToken with initial supply</li>
                <li>• Deploys TrustTrailReviews contract</li>
                <li>• Sets up permissions and token allocation</li>
                <li>• Updates contract addresses in web3Service.ts</li>
                <li>• Saves deployment info to deployments/ folder</li>
              </ul>
            </div>
          </div>

          {/* Step 3: Verify Contracts */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Step 3</Badge>
              <h3 className="text-lg font-semibold">Verify Contracts (Optional)</h3>
            </div>
            
            <CommandBlock 
              command="npx hardhat run scripts/verify.js deployments/mumbai-[timestamp].json" 
              label="Verify command"
            />

            <p className="text-sm text-muted-foreground">
              Replace [timestamp] with the actual timestamp from your deployment file
            </p>
          </div>

          {/* Step 4: Test Integration */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Step 4</Badge>
              <h3 className="text-lg font-semibold">Test Integration</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Command Line Testing:</h4>
                <CommandBlock 
                  command="npx hardhat run scripts/test-integration.js --network mumbai" 
                  label="Test command"
                />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">UI Testing:</h4>
                <p className="text-sm text-muted-foreground">
                  Use the "Run Deployment Tests" button above to test through the interface
                </p>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Keep your private key secure and never commit it to version control. 
              The deployment script will automatically update your contract addresses in the frontend.
            </AlertDescription>
          </Alert>

        </CardContent>
      </Card>
    </div>
  );
};

export default DeploymentInstructions;
