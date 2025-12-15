import { Component, ReactNode } from 'react';
import { AlertTriangle, Database, Settings } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SupabaseErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Supabase Configuration Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const isSupabaseError = this.state.error?.message?.includes('Supabase configuration');

      if (isSupabaseError) {
        return (
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-neuro rounded-3xl p-12 max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 mx-auto mb-8 rounded-3xl glass-neuro flex items-center justify-center">
                <Database className="h-10 w-10 text-red-400" />
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">Database Configuration Required</h1>
              
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                OnlyPremiums requires a Supabase database connection to function. 
                Please configure your environment variables to continue.
              </p>

              <div className="glass rounded-2xl p-6 mb-8 text-left">
                <div className="flex items-center gap-3 mb-4">
                  <Settings className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Required Configuration</h3>
                </div>
                
                <div className="space-y-3 text-sm">
                  <p className="text-white/80">Create a <code className="glass px-2 py-1 rounded text-blue-300">.env.local</code> file in your project root:</p>
                  
                  <div className="glass-dark rounded-xl p-4 font-mono text-sm">
                    <div className="text-green-400"># Supabase Configuration</div>
                    <div className="text-white">VITE_SUPABASE_URL=https://your-project.supabase.co</div>
                    <div className="text-white">VITE_SUPABASE_ANON_KEY=your_anon_key_here</div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 mb-8 text-left">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Setup Steps</h3>
                </div>
                
                <ol className="space-y-2 text-sm text-white/80">
                  <li className="flex gap-3">
                    <span className="glass rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-blue-400">1</span>
                    Create a new project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">supabase.com</a>
                  </li>
                  <li className="flex gap-3">
                    <span className="glass rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-blue-400">2</span>
                    Copy your project URL and anon key from Settings → API
                  </li>
                  <li className="flex gap-3">
                    <span className="glass rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-blue-400">3</span>
                    Run the SQL migrations from the <code className="glass px-1 py-0.5 rounded text-xs">supabase/</code> folder
                  </li>
                  <li className="flex gap-3">
                    <span className="glass rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-blue-400">4</span>
                    Restart your development server
                  </li>
                </ol>
              </div>

              <button 
                onClick={() => window.location.reload()} 
                className="btn-glass px-8 py-4 rounded-2xl text-white font-semibold hover:bg-white/20 transition-all"
              >
                Retry Connection
              </button>
            </div>
          </div>
        );
      }
    }

    return this.props.children;
  }
}