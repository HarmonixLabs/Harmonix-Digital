import { useEffect, useState } from 'react';
import { useWebSocket as useWebSocketHook } from '@/lib/websocket';
import { useAuth } from './use-auth';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';

interface WebSocketMessage {
  type: string;
  data: any;
  organizationId?: number;
}

export function useWebSocket() {
  const { user, organization } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  const handleMessage = (message: WebSocketMessage) => {
    setLastMessage(message);

    // Only process messages for the current organization
    if (message.organizationId && organization?.id !== message.organizationId) {
      return;
    }

    switch (message.type) {
      case 'task_started':
        toast({
          title: "Task Started",
          description: `Processing: ${message.data.title}`,
        });
        queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
        break;

      case 'task_completed':
        toast({
          title: "Task Completed",
          description: `Successfully completed: ${message.data.title}`,
        });
        queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
        queryClient.invalidateQueries({ queryKey: ['/api/agents'] });
        queryClient.invalidateQueries({ queryKey: ['/api/analytics/stats'] });
        break;

      case 'task_failed':
        toast({
          title: "Task Failed",
          description: `Failed to complete: ${message.data.title}`,
          variant: "destructive",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
        break;

      case 'task_updated':
        // Silent update for task status changes
        queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
        break;

      case 'agent_deployed':
        toast({
          title: "Agent Deployed",
          description: `${message.data.name} is now active and ready to work`,
        });
        queryClient.invalidateQueries({ queryKey: ['/api/agents'] });
        queryClient.invalidateQueries({ queryKey: ['/api/analytics/stats'] });
        break;

      case 'token_transaction':
        // Update token-related queries when token transactions occur
        queryClient.invalidateQueries({ queryKey: ['/api/token-transactions'] });
        queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
        break;

      case 'sol_brain_update':
        // Handle SŌL brain intelligence updates
        toast({
          title: "SŌL Brain Update",
          description: message.data.message || "SŌL brain engine has been updated",
        });
        break;

      case 'agent_status_change':
        queryClient.invalidateQueries({ queryKey: ['/api/agents'] });
        break;

      case 'organization_update':
        queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
        queryClient.invalidateQueries({ queryKey: ['/api/analytics/stats'] });
        break;

      default:
        console.log('Unhandled WebSocket message type:', message.type);
    }
  };

  const handleConnect = () => {
    console.log('Connected to SŌL brain engine');
    if (user) {
      // Send identification message
      sendMessage({
        type: 'user_connected',
        data: {
          userId: user.id,
          organizationId: organization?.id,
        },
      });
    }
  };

  const handleDisconnect = () => {
    console.log('Disconnected from SŌL brain engine');
  };

  const handleError = (error: Event) => {
    console.error('SŌL brain engine connection error:', error);
    toast({
      title: "Connection Error",
      description: "Lost connection to SŌL brain engine. Attempting to reconnect...",
      variant: "destructive",
    });
  };

  const {
    isConnected,
    connectionState,
    reconnectAttempts,
    sendMessage,
    connect,
    disconnect,
  } = useWebSocketHook({
    onMessage: handleMessage,
    onConnect: handleConnect,
    onDisconnect: handleDisconnect,
    onError: handleError,
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
  });

  // Send user identification when connection is established and user is available
  useEffect(() => {
    if (isConnected && user && organization) {
      sendMessage({
        type: 'user_identify',
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: user.role,
        },
      });
    }
  }, [isConnected, user, organization, sendMessage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // Helper function to send agent commands
  const sendAgentCommand = (agentId: number, command: string, data?: any) => {
    sendMessage({
      type: 'agent_command',
      data: {
        agentId,
        command,
        data,
        userId: user?.id,
        organizationId: organization?.id,
      },
    });
  };

  // Helper function to request SŌL brain analysis
  const requestSolAnalysis = (taskData: any) => {
    sendMessage({
      type: 'sol_analyze',
      data: {
        ...taskData,
        userId: user?.id,
        organizationId: organization?.id,
      },
    });
  };

  return {
    isConnected,
    connectionState,
    reconnectAttempts,
    lastMessage,
    sendMessage,
    sendAgentCommand,
    requestSolAnalysis,
    connect,
    disconnect,
  };
}

// Custom hook for specific WebSocket events
export function useWebSocketEvent(eventType: string, handler: (data: any) => void) {
  const { lastMessage } = useWebSocket();

  useEffect(() => {
    if (lastMessage && lastMessage.type === eventType) {
      handler(lastMessage.data);
    }
  }, [lastMessage, eventType, handler]);
}

// Hook for monitoring task progress
export function useTaskProgress(taskId?: number) {
  const [progress, setProgress] = useState<{
    status: string;
    percentage: number;
    message: string;
  }>({
    status: 'pending',
    percentage: 0,
    message: 'Waiting to start...',
  });

  useWebSocketEvent('task_progress', (data) => {
    if (!taskId || data.taskId === taskId) {
      setProgress({
        status: data.status,
        percentage: data.percentage || 0,
        message: data.message || '',
      });
    }
  });

  return progress;
}

// Hook for real-time agent status monitoring
export function useAgentStatus(agentId?: number) {
  const [status, setStatus] = useState<{
    isActive: boolean;
    currentTask?: string;
    load: number;
  }>({
    isActive: false,
    load: 0,
  });

  useWebSocketEvent('agent_status', (data) => {
    if (!agentId || data.agentId === agentId) {
      setStatus({
        isActive: data.isActive,
        currentTask: data.currentTask,
        load: data.load || 0,
      });
    }
  });

  return status;
}
