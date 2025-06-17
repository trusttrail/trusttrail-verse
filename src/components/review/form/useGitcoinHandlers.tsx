
import { useToast } from '@/hooks/use-toast';

interface UseGitcoinHandlersProps {
  walletAddress: string | null;
  verifyPassport: (walletAddress: string) => Promise<boolean>;
  refreshPassportScore: (walletAddress: string) => Promise<boolean>;
}

export const useGitcoinHandlers = ({
  walletAddress,
  verifyPassport,
  refreshPassportScore,
}: UseGitcoinHandlersProps) => {
  const { toast } = useToast();

  const handleVerifyGitcoin = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    await verifyPassport(walletAddress);
  };

  const handleRefreshGitcoin = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    await refreshPassportScore(walletAddress);
  };

  return {
    handleVerifyGitcoin,
    handleRefreshGitcoin,
  };
};
