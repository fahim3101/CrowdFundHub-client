import React from 'react';

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

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f7f4ec] px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-[#1d3a2f]">Something went wrong</h1>
            <p className="mt-2 text-sm text-gray-600">
              The page ran into an unexpected error. Please reload to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 rounded-full bg-[#c9a227] text-white font-semibold hover:opacity-90 transition"
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
