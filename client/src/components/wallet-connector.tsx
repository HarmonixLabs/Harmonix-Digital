import { useState, useEffect } from 'react';
import { Wallet, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface WalletConnectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (address: string) => void;
}

export function WalletConnector({ open, onOpenChange, onConnect }: WalletConnectorProps) {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  
  const walletOptions = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      description: 'Connect using MetaMask wallet'
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '💰',
      description: 'Connect using Coinbase Wallet'
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '🔗',
      description: 'Connect using WalletConnect protocol'
    }
  ];
  
  const handleConnect = async (walletId: string) => {
    setIsConnecting(true);
    
    try {
      // Simulate wallet connection
      // In production, this would use ethers.js or web3.js
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock wallet address
      const mockAddress = `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`;
      
      setConnectedAddress(mockAddress);
      onConnect(mockAddress);
      
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${walletId}`,
      });
      
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
      
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleDisconnect = () => {
    setConnectedAddress(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-harmonix-night-pine border-harmonix-sage-fade/20">
        <DialogHeader>
          <DialogTitle className="text-harmonix-regal-gold flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Your Wallet
          </DialogTitle>
          <DialogDescription className="text-harmonix-sage-fade/70">
            Connect your Web3 wallet to mint agent NFTs and receive creator payouts
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          {connectedAddress ? (
            <div className="p-4 bg-harmonix-cedar-green/10 rounded-lg border border-harmonix-sage-fade/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-harmonix-sage-fade">Connected</span>
                </div>
                <Badge variant="secondary">{connectedAddress}</Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                className="mt-3 w-full text-harmonix-sage-fade"
              >
                Disconnect Wallet
              </Button>
            </div>
          ) : (
            <>
              {walletOptions.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleConnect(wallet.id)}
                  disabled={isConnecting}
                  className="w-full p-4 flex items-center gap-4 bg-harmonix-deep-forest/50 hover:bg-harmonix-cedar-green/10 rounded-lg border border-harmonix-sage-fade/20 transition-colors"
                >
                  <span className="text-2xl">{wallet.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-harmonix-sage-fade">{wallet.name}</div>
                    <div className="text-sm text-harmonix-sage-fade/70">{wallet.description}</div>
                  </div>
                  {isConnecting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-harmonix-regal-gold border-t-transparent" />
                  )}
                </button>
              ))}
            </>
          )}
        </div>
        
        <div className="mt-4 p-3 bg-harmonix-cedar-green/5 rounded-lg">
          <div className="flex gap-2">
            <AlertCircle className="h-4 w-4 text-harmonix-regal-gold flex-shrink-0 mt-0.5" />
            <p className="text-xs text-harmonix-sage-fade/70">
              By connecting your wallet, you agree to our terms of service and acknowledge that you're responsible for your wallet's security.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}