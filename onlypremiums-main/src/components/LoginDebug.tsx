import { useAuth } from '@/contexts/AuthContext';

export function LoginDebug() {
  const { user, isLoading } = useAuth();
  
  // Only show in development
  if (import.meta.env.PROD) return null;
  
  return (
    <div className="fixed bottom-4 right-4 glass rounded-lg p-3 text-xs text-white/80 max-w-xs">
      <div className="font-bold mb-1">Auth Debug:</div>
      <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
      <div>User: {user ? user.email : 'None'}</div>
      <div>Role: {user?.role || 'N/A'}</div>
      <div>ID: {user?.id?.slice(0, 8) || 'N/A'}...</div>
    </div>
  );
}