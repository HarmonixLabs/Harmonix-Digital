import { useState } from 'react';
import { 
  Bitcoin, 
  Wallet, 
  ArrowRight, 
  CheckCircle, 
  Copy,
  Loader2,
  AlertCircle,
  Timer,
  CreditCard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface CryptoPaymentProps {
  amount: number;
  itemDescription: string;
  orderId: string;
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
}

const SUPPORTED_CRYPTOS = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ' },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', icon: '₮' },
  { id: 'usdc', name: 'USD Coin', symbol: 'USDC', icon: '$' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', icon: 'S' },
  { id: 'matic', name: 'Polygon', symbol: 'MATIC', icon: 'M' }
];

export function CryptoPayment({ amount, itemDescription, orderId, onSuccess, onCancel }: CryptoPaymentProps) {
  const { toast } = useToast();
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'selecting' | 'processing' | 'waiting' | 'completed'>('selecting');
  const [paymentAddress, setPaymentAddress] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
  
  const handleCryptoSelection = async (cryptoId: string) => {
    setSelectedCrypto(cryptoId);
    setPaymentStatus('processing');
    
    try {
      // Simulate NowPayments API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock payment data
      const mockAddress = `0x${Math.random().toString(16).slice(2, 18)}...${Math.random().toString(16).slice(2, 8)}`;
      const mockCryptoAmount = (amount / (cryptoId === 'btc' ? 42000 : cryptoId === 'eth' ? 2200 : 1)).toFixed(6);
      
      setPaymentAddress(mockAddress);
      setCryptoAmount(mockCryptoAmount);
      setPaymentStatus('waiting');
      
      // Start countdown timer
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 0) {
            clearInterval(timer);
            toast({
              title: "Payment Expired",
              description: "The payment window has expired. Please try again.",
              variant: "destructive"
            });
            onCancel();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Simulate payment detection after 5 seconds
      setTimeout(() => {
        clearInterval(timer);
        setPaymentStatus('completed');
        toast({
          title: "Payment Received!",
          description: "Your crypto payment has been confirmed",
        });
        
        setTimeout(() => {
          onSuccess(`np_${Date.now()}`);
        }, 1500);
      }, 5000);
      
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Failed to generate payment address. Please try again.",
        variant: "destructive"
      });
      setPaymentStatus('selecting');
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Payment address copied to clipboard",
    });
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-harmonix-night-pine border-harmonix-sage-fade/20 max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-harmonix-regal-gold flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Crypto Payment via NowPayments
            </CardTitle>
            <CardDescription className="text-harmonix-sage-fade/70">
              {itemDescription}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-lg">
            ${amount}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {paymentStatus === 'selecting' && (
          <>
            <p className="text-sm text-harmonix-sage-fade/70">
              Select your preferred cryptocurrency:
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {SUPPORTED_CRYPTOS.map((crypto) => (
                <button
                  key={crypto.id}
                  onClick={() => handleCryptoSelection(crypto.id)}
                  className="p-4 flex items-center gap-3 bg-harmonix-deep-forest/50 hover:bg-harmonix-cedar-green/10 rounded-lg border border-harmonix-sage-fade/20 transition-colors"
                >
                  <span className="text-2xl">{crypto.icon}</span>
                  <div className="text-left">
                    <div className="font-medium text-harmonix-sage-fade">{crypto.name}</div>
                    <div className="text-sm text-harmonix-sage-fade/70">{crypto.symbol}</div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="flex items-start gap-2 p-3 bg-harmonix-cedar-green/5 rounded-lg">
              <AlertCircle className="h-4 w-4 text-harmonix-regal-gold flex-shrink-0 mt-0.5" />
              <p className="text-xs text-harmonix-sage-fade/70">
                200+ cryptocurrencies supported. Exchange rates are calculated in real-time.
                Payments are processed securely through NowPayments.
              </p>
            </div>
          </>
        )}
        
        {paymentStatus === 'processing' && (
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-harmonix-regal-gold animate-spin" />
            <p className="text-harmonix-sage-fade">Generating payment address...</p>
          </div>
        )}
        
        {paymentStatus === 'waiting' && selectedCrypto && (
          <>
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Timer className="h-5 w-5 text-orange-500" />
                <span className="text-2xl font-mono text-orange-500">
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <p className="text-sm text-harmonix-sage-fade/70">Time remaining to complete payment</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-harmonix-sage-fade">
                  Send exactly:
                </label>
                <div className="mt-1 p-3 bg-harmonix-deep-forest/50 rounded-lg border border-harmonix-sage-fade/20">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-mono text-harmonix-regal-gold">
                      {cryptoAmount} {SUPPORTED_CRYPTOS.find(c => c.id === selectedCrypto)?.symbol}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(cryptoAmount)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-harmonix-sage-fade">
                  To this address:
                </label>
                <div className="mt-1 p-3 bg-harmonix-deep-forest/50 rounded-lg border border-harmonix-sage-fade/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono text-harmonix-sage-fade break-all">
                      {paymentAddress}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(paymentAddress)}
                      className="flex-shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-3 py-4">
                <div className="h-16 w-16 bg-white p-2 rounded">
                  {/* QR Code placeholder */}
                  <div className="w-full h-full bg-black opacity-20"></div>
                </div>
                <ArrowRight className="h-6 w-6 text-harmonix-sage-fade/50" />
                <Loader2 className="h-8 w-8 text-harmonix-regal-gold animate-spin" />
              </div>
              
              <p className="text-center text-sm text-harmonix-sage-fade/70">
                Waiting for blockchain confirmation...
              </p>
            </div>
          </>
        )}
        
        {paymentStatus === 'completed' && (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-xl font-semibold text-harmonix-sage-fade mb-2">
              Payment Successful!
            </h3>
            <p className="text-harmonix-sage-fade/70">
              Your transaction has been confirmed on the blockchain.
            </p>
            <div className="mt-4 p-3 bg-harmonix-deep-forest/50 rounded-lg">
              <p className="text-xs font-mono text-harmonix-sage-fade/70">
                Transaction ID: {`0x${Math.random().toString(16).slice(2, 18)}`}
              </p>
            </div>
          </div>
        )}
        
        <div className="flex justify-end gap-3 pt-4 border-t border-harmonix-sage-fade/20">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={paymentStatus === 'completed'}
            className="text-harmonix-sage-fade"
          >
            Cancel
          </Button>
          {paymentStatus === 'selecting' && (
            <Button
              variant="outline"
              className="text-harmonix-sage-fade"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Pay with Card Instead
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}