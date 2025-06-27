import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Calendar, DollarSign, TrendingUp } from 'lucide-react';

interface PricingTier {
  name: string;
  tier: string;
  fullPrice: number;
  splitTotal: number;
  upfront: number;
  milestone1: number;
  completion: number;
  savings: number;
}

interface SplitPaymentOptionsProps {
  onSelectPayment: (tier: string, paymentType: 'full' | 'split_upfront' | 'split_milestone1' | 'split_completion', amount: number) => void;
}

export function SplitPaymentOptions({ onSelectPayment }: SplitPaymentOptionsProps) {
  const [selectedTier, setSelectedTier] = useState<string>('growth');

  const pricingTiers: PricingTier[] = [
    {
      name: 'Harmony Starter',
      tier: 'starter',
      fullPrice: 4400,
      splitTotal: 5148,
      upfront: 2574,
      milestone1: 1287,
      completion: 1287,
      savings: 4400 * 0.3 // 30% early bird
    },
    {
      name: 'Harmony Growth',
      tier: 'growth',
      fullPrice: 8000,
      splitTotal: 9360,
      upfront: 4680,
      milestone1: 2340,
      completion: 2340,
      savings: 8000 * 0.3
    },
    {
      name: 'Harmony Expansion',
      tier: 'expansion',
      fullPrice: 15000,
      splitTotal: 17550,
      upfront: 8775,
      milestone1: 4388,
      completion: 4388,
      savings: 15000 * 0.3
    },
    {
      name: 'Harmony Enterprise',
      tier: 'enterprise',
      fullPrice: 21500,
      splitTotal: 25155,
      upfront: 12578,
      milestone1: 6289,
      completion: 6289,
      savings: 21500 * 0.3
    }
  ];

  const selectedTierData = pricingTiers.find(t => t.tier === selectedTier)!;

  return (
    <div className="space-y-8">
      {/* Tier Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pricingTiers.map((tier) => (
          <Card 
            key={tier.tier}
            className={`cursor-pointer transition-all duration-200 ${
              selectedTier === tier.tier 
                ? 'border-harmonix-gold bg-harmonix-gold/5' 
                : 'border-jade-blue/30 hover:border-jade-blue/50'
            }`}
            onClick={() => setSelectedTier(tier.tier)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-jade-blue">{tier.name}</CardTitle>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-harmonix-gold">
                  ${tier.fullPrice.toLocaleString()}
                </div>
                <div className="text-sm text-jade-blue/70">
                  or ${tier.splitTotal.toLocaleString()} split
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Payment Options */}
      <Tabs defaultValue="full" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-deep-space-black border-jade-blue/30">
          <TabsTrigger value="full" className="text-jade-blue data-[state=active]:bg-harmonix-gold data-[state=active]:text-deep-space-black">
            Full Payment
          </TabsTrigger>
          <TabsTrigger value="split" className="text-jade-blue data-[state=active]:bg-harmonix-gold data-[state=active]:text-deep-space-black">
            Split Payments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="full" className="mt-6">
          <Card className="border-jade-blue/30">
            <CardHeader>
              <CardTitle className="text-jade-blue flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Full Payment Option
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-harmonix-gold">
                    ${(selectedTierData.fullPrice - selectedTierData.savings).toLocaleString()}
                  </div>
                  <div className="text-sm text-jade-blue/70">
                    Original: ${selectedTierData.fullPrice.toLocaleString()}
                  </div>
                </div>
                <Badge className="bg-harmonix-gold/20 text-harmonix-gold">
                  Save ${selectedTierData.savings.toLocaleString()}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-jade-blue">
                  <CheckCircle className="h-4 w-4 text-harmonix-gold" />
                  30% Early Bird Discount
                </div>
                <div className="flex items-center gap-2 text-jade-blue">
                  <CheckCircle className="h-4 w-4 text-harmonix-gold" />
                  Immediate Full Access
                </div>
                <div className="flex items-center gap-2 text-jade-blue">
                  <CheckCircle className="h-4 w-4 text-harmonix-gold" />
                  No Additional Fees
                </div>
              </div>

              <Button 
                onClick={() => onSelectPayment(selectedTier, 'full', selectedTierData.fullPrice - selectedTierData.savings)}
                className="w-full bg-harmonix-gold hover:bg-harmonix-gold/90 text-deep-space-black font-semibold py-3"
              >
                Pay ${(selectedTierData.fullPrice - selectedTierData.savings).toLocaleString()} Now
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="split" className="mt-6">
          <div className="space-y-4">
            <Card className="border-jade-blue/30">
              <CardHeader>
                <CardTitle className="text-jade-blue flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Split Payment Schedule
                  <Badge className="bg-orange-500/20 text-orange-400 ml-2">
                    +17% Total
                  </Badge>
                </CardTitle>
                <div className="text-sm text-jade-blue/70">
                  Total project cost: ${selectedTierData.splitTotal.toLocaleString()} (17% increase for payment plan)
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Upfront Payment */}
                  <Card className="border-harmonix-gold/30 bg-harmonix-gold/5">
                    <CardContent className="p-4">
                      <div className="text-center space-y-2">
                        <div className="text-sm font-medium text-jade-blue">50% Upfront</div>
                        <div className="text-xl font-bold text-harmonix-gold">
                          ${selectedTierData.upfront.toLocaleString()}
                        </div>
                        <div className="text-xs text-jade-blue/70">Due now</div>
                        <Button 
                          onClick={() => onSelectPayment(selectedTier, 'split_upfront', selectedTierData.upfront)}
                          className="w-full bg-harmonix-gold hover:bg-harmonix-gold/90 text-deep-space-black text-sm"
                        >
                          Pay Upfront
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Milestone 1 */}
                  <Card className="border-jade-blue/30">
                    <CardContent className="p-4">
                      <div className="text-center space-y-2">
                        <div className="text-sm font-medium text-jade-blue">25% Milestone 1</div>
                        <div className="text-xl font-bold text-jade-blue">
                          ${selectedTierData.milestone1.toLocaleString()}
                        </div>
                        <div className="text-xs text-jade-blue/70">At 50% completion</div>
                        <Button 
                          onClick={() => onSelectPayment(selectedTier, 'split_milestone1', selectedTierData.milestone1)}
                          variant="outline"
                          className="w-full border-jade-blue/30 text-jade-blue hover:bg-jade-blue/10 text-sm"
                          disabled
                        >
                          Future Payment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Completion */}
                  <Card className="border-jade-blue/30">
                    <CardContent className="p-4">
                      <div className="text-center space-y-2">
                        <div className="text-sm font-medium text-jade-blue">25% Completion</div>
                        <div className="text-xl font-bold text-jade-blue">
                          ${selectedTierData.completion.toLocaleString()}
                        </div>
                        <div className="text-xs text-jade-blue/70">At project completion</div>
                        <Button 
                          onClick={() => onSelectPayment(selectedTier, 'split_completion', selectedTierData.completion)}
                          variant="outline"
                          className="w-full border-jade-blue/30 text-jade-blue hover:bg-jade-blue/10 text-sm"
                          disabled
                        >
                          Future Payment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-jade-blue/5 border border-jade-blue/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-harmonix-gold mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-medium text-jade-blue">Split Payment Benefits</div>
                      <div className="text-sm text-jade-blue/80">
                        • Start immediately with 50% down payment<br/>
                        • Milestone-based payments ensure project progress<br/>
                        • Final payment only due upon completion<br/>
                        • Full project value: ${selectedTierData.splitTotal.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}