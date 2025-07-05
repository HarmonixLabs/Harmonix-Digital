import { useRef, useEffect, useState, useCallback } from 'react';

interface WebSocketMessage {
  type: string;
  data: any;
  organizationId?: number;
}

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    // Prevent multiple simultaneous connection attempts
    if (wsRef.current?.readyState === WebSocket.OPEN || 
        wsRef.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    // Don't try to connect if there's no auth token
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.log('No authentication token found, skipping WebSocket connection');
      setConnectionState('disconnected');
      return;
    }

    setConnectionState('connecting');

    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const host = import.meta.env.PROD ? window.location.host : 'localhost:5000';
      const wsUrl = `${protocol}//${host}/ws?token=${encodeURIComponent(token)}`;
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        setConnectionState('connected');
        setReconnectAttempts(0);
        onConnect?.();
        console.log('WebSocket connected to SŌL brain engine');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          onMessage?.(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        setConnectionState('disconnected');
        onDisconnect?.();
        console.log('WebSocket disconnected from SŌL brain engine');

        // Debounced reconnection with exponential backoff
        if (reconnectAttempts < maxReconnectAttempts) {
          const backoffDelay = Math.min(
            reconnectInterval * Math.pow(2, reconnectAttempts) + Math.random() * 1000,
            30000 // Max 30 second delay
          );
          
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, backoffDelay);
        }
      };

      wsRef.current.onerror = (error) => {
        setConnectionState('error');
        onError?.(error);
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      setConnectionState('error');
      console.error('Failed to create WebSocket connection:', error);
    }
  }, [onMessage, onConnect, onDisconnect, onError, reconnectInterval, maxReconnectAttempts, reconnectAttempts]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    setConnectionState('disconnected');
    setReconnectAttempts(0);
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    connectionState,
    reconnectAttempts,
    connect,
    disconnect,
    sendMessage,
  };
}

// REMOVED: Global WebSocket manager to eliminate singleton conflicts
// This class was causing competition with the useWebSocket hook, resulting in
// multiple simultaneous connections and rapid connect/disconnect cycles.
// All WebSocket functionality is now centralized in the useWebSocket hook above.
