import React from 'react';
import { captureError } from '../utils/sentry';

// Catches render crashes anywhere below it so one broken component
// never leaves the user staring at a blank white page.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // No-op unless VITE_SENTRY_DSN is set — never breaks the fallback UI.
    captureError(error);
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-paper px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-pine">Something went wrong</h1>
            <p className="mt-2 text-sm text-gray-600">
              The page ran into an unexpected error. Please reload to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="focus-ring mt-6 px-6 py-2 rounded-full bg-gold text-white font-semibold hover:opacity-90 transition"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
