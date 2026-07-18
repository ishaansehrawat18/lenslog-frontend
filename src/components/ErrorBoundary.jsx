import { Component } from "react";
import { AlertTriangle } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 px-4 text-center">
          <AlertTriangle size={36} className="text-gray-300" strokeWidth={1.3} />
          <h1 className="text-xl font-bold text-black">Something went wrong</h1>
          <p className="max-w-sm text-sm text-gray-500">
            We hit an unexpected error. Please try reloading the page.
          </p>
          <button
            onClick={this.handleReload}
            className="mt-2 rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Back to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;