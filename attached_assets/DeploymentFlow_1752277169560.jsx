import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { usePermissions, ProtectedComponent } from './RoleBasedAccess'
import PaymentIntegration from './PaymentIntegration'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  Rocket, 
  Settings, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Loader2,
  Zap,
  Crown,
  Shield,
  Webhook,
  Database,
  CreditCard,
  Play,
  Pause,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  DollarSign
} from 'lucide-react'

const DeploymentFlow = ({ agentId, onDeploymentComplete, onCancel }) => {
  const { user, organization } = useAuth()
  const { hasPermission } = usePermissions()
  const [currentStep, setCurrentStep] = useState(0)
  const [deploymentData, setDeploymentData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [paymentRequired, setPaymentRequired] = useState(false)
  const [deploymentStatus, setDeploymentStatus] = useState('pending')

  const deploymentSteps = [
    {
      id: 'validation',
      title: 'Validation',
      description: 'Checking requirements and permissions',
      icon: Shield,
      automated: true
    },
    {
      id: 'payment',
      title: 'Payment',
      description: 'Process setup and deployment fees',
      icon: CreditCard,
      automated: false,
      conditional: true
    },
    {
      id: 'configuration',
      title: 'Configuration',
      description: 'Setting up agent parameters and webhooks',
      icon: Settings,
      automated: true
    },
    {
      id: 'deployment',
      title: 'Deployment',
      description: 'Deploying agent to production environment',
      icon: Rocket,
      automated: true
    },
    {
      id: 'verification',
      title: 'Verification',
      description: 'Testing agent functionality and connections',
      icon: CheckCircle,
      automated: true
    }
  ]

  useEffect(() => {
    initializeDeployment()
  }, [agentId])

  const initializeDeployment = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/deployments/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          agent_id: agentId,
          organization_id: organization?.id,
          user_id: user?.id
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        setDeploymentData(data.deployment)
        setPaymentRequired(data.payment_required)
        
        if (!data.payment_required) {
          // Skip payment step
          setCurrentStep(2)
          await startAutomatedDeployment()
        }
      } else {
        setError(data.message || 'Failed to initialize deployment')
      }
    } catch (error) {
      setError('Failed to initialize deployment')
      console.error('Deployment initialization error:', error)
    } finally {
      setLoading(false)
    }
  }

  const startAutomatedDeployment = async () => {
    setLoading(true)
    setDeploymentStatus('deploying')

    try {
      // Step 1: Configuration
      await executeDeploymentStep('configuration')
      setCurrentStep(2)
      
      // Step 2: Deployment
      await executeDeploymentStep('deployment')
      setCurrentStep(3)
      
      // Step 3: Verification
      await executeDeploymentStep('verification')
      setCurrentStep(4)
      
      setDeploymentStatus('completed')
      onDeploymentComplete && onDeploymentComplete(deploymentData)
      
    } catch (error) {
      setDeploymentStatus('failed')
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const executeDeploymentStep = async (stepId) => {
    const response = await fetch(`/api/deployments/execute-step`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        deployment_id: deploymentData.id,
        step: stepId,
        agent_id: agentId
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || `Failed to execute ${stepId} step`)
    }

    return data
  }

  const handlePaymentSuccess = async (paymentResult) => {
    setCurrentStep(2)
    await startAutomatedDeployment()
  }

  const handlePaymentCancel = () => {
    onCancel && onCancel()
  }

  const StepIndicator = ({ step, index, isActive, isCompleted, isError }) => {
    const Icon = step.icon
    
    return (
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
          isError 
            ? 'border-red-500 bg-red-900/20' 
            : isCompleted 
              ? 'border-green-500 bg-green-900/20' 
              : isActive 
                ? 'border-purple-500 bg-purple-900/20' 
                : 'border-slate-600 bg-slate-800'
        }`}>
          {isError ? (
            <AlertTriangle className="h-5 w-5 text-red-400" />
          ) : isCompleted ? (
            <CheckCircle className="h-5 w-5 text-green-400" />
          ) : isActive && loading ? (
            <Loader2 className="h-5 w-5 text-purple-400 animate-spin" />
          ) : (
            <Icon className={`h-5 w-5 ${
              isActive ? 'text-purple-400' : 'text-slate-400'
            }`} />
          )}
        </div>
        
        <div className="ml-3 flex-1">
          <h3 className={`font-medium ${
            isActive ? 'text-white' : 'text-slate-400'
          }`}>
            {step.title}
          </h3>
          <p className="text-sm text-slate-500">{step.description}</p>
        </div>
        
        {index < deploymentSteps.length - 1 && (
          <div className={`w-8 h-0.5 ml-4 ${
            isCompleted ? 'bg-green-500' : 'bg-slate-700'
          }`} />
        )}
      </div>
    )
  }

  if (!hasPermission('deploy_agents')) {
    return (
      <ProtectedComponent requiredPermission="deploy_agents">
        <div>This should not be visible</div>
      </ProtectedComponent>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Agent Deployment
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Deploy your AI agent with automated setup, configuration, and testing
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Rocket className="h-5 w-5 mr-2 text-purple-400" />
            Deployment Progress
          </CardTitle>
          <CardDescription className="text-slate-400">
            {deploymentStatus === 'pending' && 'Ready to begin deployment'}
            {deploymentStatus === 'deploying' && 'Deployment in progress...'}
            {deploymentStatus === 'completed' && 'Deployment completed successfully'}
            {deploymentStatus === 'failed' && 'Deployment failed - please retry'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Progress</span>
              <span className="text-white">
                {Math.round((currentStep / (deploymentSteps.length - 1)) * 100)}%
              </span>
            </div>
            <Progress 
              value={(currentStep / (deploymentSteps.length - 1)) * 100} 
              className="h-2"
            />
          </div>

          {/* Step Indicators */}
          <div className="space-y-4">
            {deploymentSteps.map((step, index) => {
              // Skip payment step if not required
              if (step.id === 'payment' && !paymentRequired) {
                return null
              }
              
              const adjustedIndex = paymentRequired ? index : index > 1 ? index - 1 : index
              const isActive = adjustedIndex === currentStep
              const isCompleted = adjustedIndex < currentStep
              const isError = deploymentStatus === 'failed' && isActive
              
              return (
                <StepIndicator
                  key={step.id}
                  step={step}
                  index={adjustedIndex}
                  isActive={isActive}
                  isCompleted={isCompleted}
                  isError={isError}
                />
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      <div className="space-y-6">
        {/* Validation Step */}
        {currentStep === 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Validating Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white">User permissions verified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white">Organization limits checked</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white">Agent configuration validated</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Step */}
        {currentStep === 1 && paymentRequired && (
          <PaymentIntegration
            agentId={agentId}
            deploymentType="setup"
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentCancel={handlePaymentCancel}
          />
        )}

        {/* Configuration Step */}
        {currentStep === 2 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="h-5 w-5 mr-2 text-blue-400" />
                Configuring Agent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  {loading ? (
                    <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  )}
                  <span className="text-white">Setting up webhooks</span>
                </div>
                <div className="flex items-center space-x-2">
                  {loading ? (
                    <Clock className="h-5 w-5 text-slate-400" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  )}
                  <span className="text-white">Configuring API endpoints</span>
                </div>
                <div className="flex items-center space-x-2">
                  {loading ? (
                    <Clock className="h-5 w-5 text-slate-400" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  )}
                  <span className="text-white">Setting up monitoring</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Deployment Step */}
        {currentStep === 3 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Rocket className="h-5 w-5 mr-2 text-purple-400" />
                Deploying to Production
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  {loading ? (
                    <Loader2 className="h-5 w-5 text-purple-400 animate-spin" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  )}
                  <span className="text-white">Deploying agent instance</span>
                </div>
                <div className="flex items-center space-x-2">
                  {loading ? (
                    <Clock className="h-5 w-5 text-slate-400" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  )}
                  <span className="text-white">Connecting to Pipedream</span>
                </div>
                <div className="flex items-center space-x-2">
                  {loading ? (
                    <Clock className="h-5 w-5 text-slate-400" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  )}
                  <span className="text-white">Initializing agent services</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Verification Step */}
        {currentStep === 4 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                Verification Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white">Agent is responding correctly</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white">Webhooks are functioning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white">Monitoring is active</span>
                </div>
                
                <div className="mt-6 p-4 bg-green-900/20 border border-green-500 rounded-lg">
                  <h4 className="text-green-400 font-medium mb-2">Deployment Successful!</h4>
                  <p className="text-green-200 text-sm">
                    Your agent is now live and ready to handle requests. You can monitor its performance in the dashboard.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <Card className="bg-red-900/20 border-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <span className="text-red-400 font-medium">Deployment Error</span>
            </div>
            <p className="text-red-200 mt-2">{error}</p>
            <div className="mt-4 flex gap-2">
              <Button 
                onClick={() => {
                  setError(null)
                  setCurrentStep(0)
                  initializeDeployment()
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Deployment
              </Button>
              <Button 
                variant="outline" 
                onClick={onCancel}
                className="border-slate-600 text-slate-200"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {!loading && currentStep === 0 && (
        <div className="flex justify-center gap-4">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="border-slate-600 text-slate-200"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => setCurrentStep(paymentRequired ? 1 : 2)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Rocket className="h-4 w-4 mr-2" />
            Start Deployment
          </Button>
        </div>
      )}

      {deploymentStatus === 'completed' && (
        <div className="flex justify-center">
          <Button 
            onClick={() => onDeploymentComplete && onDeploymentComplete(deploymentData)}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Button>
        </div>
      )}
    </div>
  )
}

export default DeploymentFlow

