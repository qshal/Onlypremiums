import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { User, AuthContextType } from '@/types';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize authentication
  useEffect(() => {
    let mounted = true;
    
    const initAuth = async () => {
      try {
        logger.log('Initializing authentication...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          logger.error('Session error:', error);
          setIsLoading(false);
          return;
        }
        
        if (!session?.user) {
          logger.log('No active session found');
          setIsLoading(false);
          return;
        }
        
        // Get user profile from database to get correct role
        try {
          const { data: profile, error: profileError } = await (supabase as any)
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          let sessionUser;
          
          if (profileError || !profile) {
            // Create a default user profile if none exists
            logger.log('No profile found, creating default user profile');
            sessionUser = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.email?.split('@')[0] || 'User',
              role: 'user' as 'user' | 'admin',
              createdAt: new Date(),
            };
            
            // Try to create profile in database
            try {
              await (supabase as any)
                .from('profiles')
                .insert({
                  id: session.user.id,
                  email: session.user.email,
                  name: sessionUser.name,
                  role: 'user',
                  created_at: new Date().toISOString(),
                });
              logger.log('Created new profile for user:', session.user.email);
            } catch (insertError) {
              logger.warn('Could not create profile in database:', insertError);
            }
          } else {
            sessionUser = {
              id: session.user.id,
              email: session.user.email || '',
              name: profile.name || session.user.email?.split('@')[0] || 'User',
              role: profile.role || 'user' as 'user' | 'admin',
              createdAt: new Date(profile.created_at || new Date()),
            };
          }
          
          setUser(sessionUser);
          logger.log('Session restore with role:', sessionUser.email, sessionUser.role);
        } catch (error) {
          logger.error('Failed to load user profile:', error);
          // Still create a basic user to allow login
          const sessionUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.email?.split('@')[0] || 'User',
            role: 'user' as 'user' | 'admin',
            createdAt: new Date(),
          };
          setUser(sessionUser);
          logger.log('Created fallback user profile:', sessionUser.email);
        } finally {
          setIsLoading(false);
        }
        
      } catch (error) {
        logger.error('Authentication initialization error:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      logger.log('Auth state change:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session?.user) {
        // Get user profile from database to get correct role
        (async () => {
          try {
            const { data: profile, error: profileError } = await (supabase as any)
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            let sessionUser;
            
            if (profileError || !profile) {
              // Create a default user profile if none exists
              logger.log('No profile found during sign in, creating default user profile');
              sessionUser = {
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.email?.split('@')[0] || 'User',
                role: 'user' as 'user' | 'admin',
                createdAt: new Date(),
              };
              
              // Try to create profile in database
              try {
                await (supabase as any)
                  .from('profiles')
                  .insert({
                    id: session.user.id,
                    email: session.user.email,
                    name: sessionUser.name,
                    role: 'user',
                    created_at: new Date().toISOString(),
                  });
                logger.log('Created new profile during sign in for user:', session.user.email);
              } catch (insertError) {
                logger.warn('Could not create profile in database during sign in:', insertError);
              }
            } else {
              sessionUser = {
                id: session.user.id,
                email: session.user.email || '',
                name: profile.name || session.user.email?.split('@')[0] || 'User',
                role: profile.role || 'user' as 'user' | 'admin',
                createdAt: new Date(profile.created_at || new Date()),
              };
            }
            
            setUser(sessionUser);
            logger.log('Sign in with role:', sessionUser.email, sessionUser.role);
          } catch (error) {
            logger.error('Failed to load user profile during sign in:', error);
            // Still create a basic user to allow login
            const sessionUser = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.email?.split('@')[0] || 'User',
              role: 'user' as 'user' | 'admin',
              createdAt: new Date(),
            };
            setUser(sessionUser);
            logger.log('Created fallback user profile during sign in:', sessionUser.email);
          } finally {
            setIsLoading(false);
          }
        })();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoading(false);
        logger.log('User signed out');
      }
    });
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    logger.log('Starting login for:', email);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      logger.log('Sign in response:', { userId: data?.user?.id, hasError: !!error });

      if (error) {
        logger.error('Sign in error:', error);
        setIsLoading(false);
        throw error;
      }

      logger.log('Sign in successful for user ID:', data.user?.id);
      // The auth state change listener will handle the rest
      
    } catch (error: any) {
      logger.error('Login error:', error);
      setIsLoading(false);
      throw new Error(error.message || 'Login failed. Please check your credentials and try again.');
    }
  }, []);



  const register = useCallback(async (email: string, password: string, name: string) => {
    logger.log('Starting registration for:', email);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            role: 'user',
          },
        },
      });

      logger.log('Registration response:', { hasData: !!data, hasError: !!error });

      if (error) {
        setIsLoading(false);
        throw error;
      }

      if (data.user) {
        logger.log('User created successfully:', data.user.email);
        // The auth state change listener will handle the rest
      }
    } catch (error: any) {
      logger.error('Registration error:', error);
      setIsLoading(false);
      throw new Error(error.message || 'Registration failed. Please check your connection and try again.');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      logger.log('Starting logout...');
      setIsLoading(true);
      
      // Clear user state immediately
      setUser(null);
      
      // Sign out from Supabase with scope 'local' to clear session
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      
      if (error) {
        logger.error('Logout error:', error);
        // Even if there's an error, force clear the session
        setUser(null);
      } else {
        logger.log('Logout successful');
      }
      
      // Force clear any remaining session data
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
    } catch (error) {
      logger.error('Logout error:', error);
      // Force clear user state even on error
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data: profile } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: profile.role as 'user' | 'admin',
          createdAt: new Date(profile.created_at),
        });
        logger.log('User profile refreshed:', profile.email, profile.role);
      }
    } catch (error) {
      logger.error('Failed to refresh user profile:', error);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}