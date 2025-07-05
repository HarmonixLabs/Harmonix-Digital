import { useWebSocket } from '@/lib/websocket';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export function ConnectionStatus() {
  const { isConnected, connectionState, reconnectAttempts } = useWebSocket();

  if (isConnected) {
    return null; // Don't show anything when connected
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Alert variant="destructive" className="bg-red-900/90 border-red-700">
        <div className="flex items-center gap-2">
          {connectionState === 'connecting' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription className="text-sm">
            {connectionState === 'connecting' 
              ? 'Connecting to SŌL brain engine...'
              : `Connection to SŌL lost${reconnectAttempts > 0 ? ` (Retry ${reconnectAttempts})` : ''}`
            }
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
}