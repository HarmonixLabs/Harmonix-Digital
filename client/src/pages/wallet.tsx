import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Wallet, 
  TrendingUp, 
  CreditCard, 
  Smartphone, 
  Mail, 
  Fingerprint,
  ChevronRight,
  Plus,
  Minus
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { formatDistanceToNow } from "date-fns";

export default function WalletPage() {
  const { user, organization } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tokenTransactions = [] } = useQuery({
    queryKey: ['/api/token-transactions'],
    enabled: !!user,
  });

  const { data: nfts = [] } = useQuery({
    queryKey: ['/api/nfts'],
    enabled: !!user,
  });

  const purchaseTokensMutation = useMutation({
    mutationFn: async (amount: number) => {
      return apiRequest("POST", "/api/token-transactions", {
        type: "purchase",
        amount: amount,
        description: `Purchased ${amount} Harmony tokens`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/token-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      toast({
        title: "Tokens Purchased Successfully",
        description: "Your Harmony tokens have been added to your balance.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to purchase tokens. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mock chart data for balance visualization
  const chartData = [
    { month: 'Jan', balance: 800 },
    { month: 'Feb', balance: 1200 },
    { month: 'Mar', balance: user?.tokenBalance || 1250 },
  ];

  const recentTransactions = tokenTransactions.slice(0, 5);

  const accountOptions = [
    { icon: Mail, label: "Email", connected: true },
    { icon: () => "G", label: "Google", connected: true },
    { icon: () => "🍎", label: "Apple", connected: false },
    { icon: Fingerprint, label: "Biometrics", connected: true },
  ];

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <p className="text-gray-400 mb-4">Please log in to access your wallet.</p>
              <Button>Sign In</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const tokenValue = user.tokenBalance * 3.86; // Mock conversion rate

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            <span className="harmony-gold">Harmony</span> Wallet
          </h1>
          <p className="text-xl text-gray-300">Manage your tokens, earnings, and agent assets</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Wallet Balance */}
          <div className="lg:col-span-2">
            <Card className="card-hover border-gray-800">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Balance</h3>
                  <div className="harmony-gold text-2xl">
                    <Wallet size={32} />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Balance Chart */}
                  <div>
                    <div className="h-32 mb-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <XAxis 
                            dataKey="month" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                          />
                          <YAxis hide />
                          <Line 
                            type="monotone" 
                            dataKey="balance" 
                            stroke="hsl(188, 60%, 58%)" 
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center">
                    <div className="space-y-2">
                      <div className="text-3xl font-bold harmony-gold">
                        {user.tokenBalance.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">Harmony</div>
                      <div className="text-2xl font-semibold">
                        ${tokenValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        className="flex-1 bg-harmony-teal hover:bg-cyan-400 text-harmony-dark font-semibold"
                        onClick={() => purchaseTokensMutation.mutate(500)}
                        disabled={purchaseTokensMutation.isPending}
                      >
                        {purchaseTokensMutation.isPending ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-harmony-dark border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </div>
                        ) : (
                          <>
                            <Plus size={16} className="mr-2" />
                            Recharge
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-harmony-gold text-harmony-gold hover:bg-harmony-gold hover:text-harmony-dark"
                      >
                        <TrendingUp size={16} className="mr-2" />
                        History
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="card-hover border-gray-800 mt-8">
              <CardHeader>
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {recentTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-b-0">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            transaction.type === 'purchase' ? 'bg-green-600' :
                            transaction.type === 'usage' ? 'bg-blue-600' : 'bg-red-600'
                          }`}>
                            {transaction.type === 'purchase' ? <Plus size={16} /> :
                             transaction.type === 'usage' ? <Minus size={16} /> :
                             <TrendingUp size={16} />}
                          </div>
                          <div>
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-sm text-gray-400">
                              {formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                        <div className={`font-semibold ${
                          transaction.type === 'purchase' ? 'text-green-500' : 
                          transaction.type === 'usage' ? 'text-red-500' : 'text-gray-400'
                        }`}>
                          {transaction.type === 'purchase' ? '+' : '-'}{transaction.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <CreditCard size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No transactions yet</p>
                    <p className="text-sm">Your transaction history will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* NFT Collection & Account */}
          <div className="space-y-6">
            {/* NFT Collection */}
            <Card className="card-hover border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg">NFT Collection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-harmony-gold to-harmony-teal rounded-xl flex items-center justify-center">
                    <div className="text-white text-lg">🪷</div>
                  </div>
                  <div>
                    <div className="font-semibold">{nfts.length} NFTs</div>
                    <div className="text-sm text-gray-400">Agent Collectibles</div>
                  </div>
                </div>
                
                {nfts.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {nfts.slice(0, 4).map((nft) => (
                      <div key={nft.id} className="aspect-square bg-gradient-to-br from-harmony-gold/20 to-harmony-teal/20 rounded-lg flex items-center justify-center border border-gray-700">
                        <div className="text-2xl">🤖</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-400">
                    <div className="text-3xl mb-2">🎨</div>
                    <p className="text-sm">No NFTs yet</p>
                    <p className="text-xs">Earn NFTs by using agents</p>
                  </div>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4 border-harmony-teal text-harmony-teal hover:bg-harmony-teal hover:text-harmony-dark"
                >
                  View Gallery <ChevronRight size={16} className="ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Account Options */}
            <Card className="card-hover border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg">Account</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {accountOptions.map((option, index) => {
                    const IconComponent = option.icon;
                    return (
                      <button 
                        key={index}
                        className="flex flex-col items-center p-3 rounded-lg border border-gray-700 hover:border-harmony-gold transition-colors relative"
                      >
                        {option.connected && (
                          <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                        <div className="harmony-gold text-lg mb-1">
                          {typeof IconComponent === 'function' && IconComponent.name ? (
                            <IconComponent size={20} />
                          ) : typeof IconComponent === 'function' ? (
                            <span>{IconComponent()}</span>
                          ) : (
                            <IconComponent size={20} />
                          )}
                        </div>
                        <span className="text-xs">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
                
                <div className="space-y-3 mt-6">
                  <Button 
                    variant="outline" 
                    className="w-full justify-between border-gray-700 hover:border-harmony-gold"
                  >
                    Token Balance <ChevronRight size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between border-gray-700 hover:border-harmony-gold"
                  >
                    NFT Gallery <ChevronRight size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between border-gray-700 hover:border-harmony-gold"
                  >
                    Recharge Settings <ChevronRight size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
