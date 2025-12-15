import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { logger } from '@/lib/logger';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';


const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { login, user, isLoading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);



  // Redirect if user is available
  useEffect(() => {
    if (user && !authLoading) {
      logger.log('User available, redirecting to:', user.role === 'admin' ? '/admin' : '/dashboard');
      const redirectTo = user.role === 'admin' ? '/admin' : '/dashboard';
      setIsLoading(false);
      navigate(redirectTo, { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Timeout for login success without user data (fallback)
  useEffect(() => {
    if (loginSuccess && !user && !authLoading) {
      const timeout = setTimeout(() => {
        logger.warn('Login success but no user data after 3s, forcing redirect to dashboard');
        setIsLoading(false);
        navigate('/dashboard', { replace: true });
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [loginSuccess, user, authLoading, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    setIsLoading(true);
    setLoginSuccess(false);
    
    try {
      logger.log('Starting login for', data.email);
      await login(data.email, data.password);
      logger.log('Login successful, waiting for user data...');
      setLoginSuccess(true);
      // Don't navigate immediately - wait for user state to update
    } catch (err) {
      logger.error('❌ LoginPage: Login failed:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
      setIsLoading(false);
      setLoginSuccess(false);
    }
  };

  // Show loading while auth is initializing (with timeout)
  const [showInitializing, setShowInitializing] = useState(true);
  
  useEffect(() => {
    // Hide initializing after 10 seconds even if auth is still loading
    const timeout = setTimeout(() => {
      logger.log('Initializing timeout, showing login form');
      setShowInitializing(false);
    }, 10000);
    
    // Hide immediately if auth finishes loading
    if (!authLoading) {
      setShowInitializing(false);
      clearTimeout(timeout);
    }
    
    return () => clearTimeout(timeout);
  }, [authLoading]);

  if (authLoading && showInitializing) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Initializing...</span>
        </div>
      </div>
    );
  }

  // Show loading after successful login
  if (loginSuccess && !user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Signing you in...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md glass-neuro rounded-3xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-white/70">Sign in to your account to continue</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {error && (
              <div className="card-glass rounded-2xl p-4 border-red-400/30">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="input-glass"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-white font-medium">Password</Label>
                <Link to="/forgot-password" className="text-sm text-white/80 hover:text-white underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="input-glass"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>
          </div>
          <div className="mt-8 space-y-4">
            <button 
              type="submit" 
              className="w-full btn-glass rounded-2xl py-4 text-white font-semibold text-lg hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign in
            </button>
            <p className="text-sm text-white/60 text-center">
              Don't have an account?{' '}
              <Link to="/register" className="text-white/80 hover:text-white underline">
                Sign up
              </Link>
            </p>
          </div>
        </form>
        <div className="mt-6">
          <p className="text-sm text-white/60 text-center">
            Please use your registered account or{' '}
            <Link to="/register" className="text-white/80 hover:text-white underline">
              create a new account
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
