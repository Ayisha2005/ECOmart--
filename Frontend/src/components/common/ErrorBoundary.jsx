import React from 'react';
import EcoMartLogo from './EcoMartLogo';
import { AlertTriangle, RefreshCw, Home, ShieldCheck } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ECO MART Application Error Caught:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
            <EcoMartLogo size="md" showTagline={true} className="mx-auto" />

            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex flex-col items-center gap-2 text-rose-300">
              <AlertTriangle className="w-8 h-8 text-rose-400" />
              <h3 className="font-extrabold text-base text-white">Something went wrong while rendering</h3>
              <p className="text-xs text-rose-200">The application caught a runtime component exception.</p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-950 rounded-xl text-left border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-40">
                <p className="font-bold text-rose-400">{this.state.error.toString()}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-1/2 py-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
              >
                <RefreshCw className="w-4 h-4 text-slate-950" />
                <span>Reload Application</span>
              </button>
              <a
                href="/register"
                className="w-1/2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Home className="w-4 h-4" />
                <span>Go to Marketplace</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
