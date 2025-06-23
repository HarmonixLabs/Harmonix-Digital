import { useEffect, useRef, useCallback } from 'react';

interface ConnectionManagerProps {
  onMessage?: (data: any) => void;
  onConnectionChange?: (connected: boolean) => void;
  autoReconnect?: boolean;
  maxRetries?: number;
}

export function useWebSocketConnection({
  onMessage,
  onConnectionChange,
  autoReconnect = true,
  maxRetries = 5
}: ConnectionManagerProps = {}) {
  const wsRef = useRef<WebSocket | null>(null);
  const retryCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected to SŌL brain engine');
        retryCountRef.current = 0;
        onConnectionChange?.(true);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage?.(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected from SŌL brain engine');
        onConnectionChange?.(false);
        
        if (autoReconnect && retryCountRef.current < maxRetries) {
          const delay = Math.pow(2, retryCountRef.current) * 1000; // Exponential backoff
          retryCountRef.current++;
          
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Attempting WebSocket reconnection (${retryCountRef.current}/${maxRetries})`);
            connect();
          }, delay);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('SŌL brain engine connection error:', error);
      };

    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
      onConnectionChange?.(false);
    }
  }, [onMessage, onConnectionChange, autoReconnect, maxRetries]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const sendMessage = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    sendMessage,
    reconnect: connect,
    disconnect,
    isConnected: wsRef.current?.readyState === WebSocket.OPEN
  };
}