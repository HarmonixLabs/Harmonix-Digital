import { useState, useEffect } from 'react';
import { 
  Rocket, 
  CheckCircle, 
  Loader2, 
  AlertCircle,
  Save,
  Upload,
  Shield,
  Coins
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface DeploymentStep {
  id: string;
  name: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
}

interface DeploymentPipelineProps {
  agentConfig: {
    name: string;
    description: string;
    prompt: string;
    licenseType: string;
    price?: number;
  };
  onComplete: (result: { nftTokenId: string; deploymentId: string }) => void;
  onCancel: () => void;
}

export function DeploymentPipeline({ agentConfig, onComplete, onCancel }: DeploymentPipelineProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const deploymentSteps: DeploymentStep[] = [
    {
      id: 'save',
      name: 'Saving Configuration',
      description: 'Storing agent JSON config and flow definition',
      icon: Save,
      status: 'pending'
    },
    {
      id: 'deploy',
      name: 'Deploying Agent',
      description: 'Creating agent instance in your dashboard',
      icon: Upload,
      status: 'pending'
    },
    {
      id: 'mint',
      name: 'Minting NFT',
      description: 'Creating ERC-721 token on Polygon blockchain',
      icon: Shield,
      status: 'pending'
    },
    {
      id: 'payment',
      name: 'Processing Payment',
      description: 'Handling deployment fee and subscription',
      icon: Coins,
      status: 'pending'
    }
  ];

  const [steps, setSteps] = useState(deploymentSteps);
  
  useEffect(() => {
    runDeploymentPipeline();
  }, []);
  
  const runDeploymentPipeline = async () => {
    try {
      // Step 1: Save Configuration
      await executeStep(0, async () => {
        // Simulate saving config to backend
        await new Promise(resolve => setTimeout(resolve, 2000));
        return { success: true };
      });
      
      // Step 2: Deploy Agent
      await executeStep(1, async () => {
        // Simulate deploying agent
        await new Promise(resolve => setTimeout(resolve, 3000));
        return { success: true, deploymentId: `dep_${Date.now()}` };
      });
      
      // Step 3: Mint NFT
      await executeStep(2, async () => {
        // Simulate NFT minting
        await new Promise(resolve => setTimeout(resolve, 4000));
        const tokenId = `${Math.floor(Math.random() * 10000)}`;
        return { success: true, tokenId };
      });
      
      // Step 4: Process Payment
      await executeStep(3, async () => {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        return { success: true };
      });
      
      // Complete!
      toast({
        title: "Deployment Complete!",
        description: `${agentConfig.name} has been deployed and minted as NFT`,
      });
      
      setTimeout(() => {
        onComplete({
          nftTokenId: `${Math.floor(Math.random() * 10000)}`,
          deploymentId: `dep_${Date.now()}`
        });
      }, 1000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deployment failed');
      toast({
        title: "Deployment Failed",
        description: "Please try again or contact support",
        variant: "destructive"
      });
    }
  };
  
  const executeStep = async (stepIndex: number, action: () => Promise<any>) => {
    setCurrentStep(stepIndex);
    
    // Update step status to in-progress
    setSteps(prev => prev.map((step, idx) => ({
      ...step,
      status: idx === stepIndex ? 'in-progress' : 
              idx < stepIndex ? 'completed' : 'pending'
    })));
    
    try {
      const result = await action();
      
      // Update step status to completed
      setSteps(prev => prev.map((step, idx) => ({
        ...step,
        status: idx === stepIndex ? 'completed' : step.status
      })));
      
      return result;
    } catch (error) {
      // Update step status to failed
      setSteps(prev => prev.map((step, idx) => ({
        ...step,
        status: idx === stepIndex ? 'failed' : step.status
      })));
      throw error;
    }
  };
  
  const getStepIcon = (step: DeploymentStep) => {
    const Icon = step.icon;
    
    if (step.status === 'completed') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (step.status === 'in-progress') {
      return <Loader2 className="h-5 w-5 text-harmonix-regal-gold animate-spin" />;
    } else if (step.status === 'failed') {
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    } else {
      return <Icon className="h-5 w-5 text-harmonix-sage-fade/50" />;
    }
  };
  
  const getProgressValue = () => {
    const completedSteps = steps.filter(s => s.status === 'completed').length;
    return (completedSteps / steps.length) * 100;
  };

  return (
    <Card className="bg-harmonix-night-pine border-harmonix-sage-fade/20 max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Rocket className="h-6 w-6 text-harmonix-regal-gold" />
            <CardTitle className="text-harmonix-regal-gold">Deploying {agentConfig.name}</CardTitle>
          </div>
          <Badge variant="secondary">
            {steps.filter(s => s.status === 'completed').length}/{steps.length} Complete
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-harmonix-sage-fade">
            <span>Overall Progress</span>
            <span>{Math.round(getProgressValue())}%</span>
          </div>
          <Progress value={getProgressValue()} className="h-2" />
        </div>
        
        <div className="space-y-4">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
                step.status === 'in-progress' 
                  ? 'bg-harmonix-cedar-green/10 border-harmonix-regal-gold'
                  : step.status === 'completed'
                  ? 'bg-green-500/10 border-green-500/20'
                  : step.status === 'failed'
                  ? 'bg-red-500/10 border-red-500/20'
                  : 'bg-harmonix-deep-forest/30 border-harmonix-sage-fade/20'
              }`}
            >
              <div className="mt-0.5">
                {getStepIcon(step)}
              </div>
              
              <div className="flex-1">
                <h4 className={`font-medium ${
                  step.status === 'pending' ? 'text-harmonix-sage-fade/50' : 'text-harmonix-sage-fade'
                }`}>
                  {step.name}
                </h4>
                <p className={`text-sm mt-1 ${
                  step.status === 'pending' ? 'text-harmonix-sage-fade/30' : 'text-harmonix-sage-fade/70'
                }`}>
                  {step.description}
                </p>
                
                {step.status === 'in-progress' && (
                  <div className="mt-2">
                    <Progress value={50} className="h-1" />
                  </div>
                )}
                
                {step.id === 'mint' && step.status === 'completed' && (
                  <div className="mt-2 p-2 bg-harmonix-deep-forest/50 rounded text-xs font-mono text-harmonix-sage-fade/70">
                    NFT Token ID: #{Math.floor(Math.random() * 10000)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {error && (
          <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-500">Deployment Failed</p>
                <p className="text-sm text-harmonix-sage-fade/70 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end gap-3 pt-4 border-t border-harmonix-sage-fade/20">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={currentStep > 0 && !error}
            className="text-harmonix-sage-fade"
          >
            Cancel
          </Button>
          {error && (
            <Button
              onClick={() => {
                setError(null);
                setCurrentStep(0);
                runDeploymentPipeline();
              }}
              className="bg-harmonix-regal-gold text-black hover:bg-harmonix-regal-gold/90"
            >
              Retry Deployment
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}