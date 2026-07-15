import { Component } from "react";

// Error boundaries must be class components — React does not yet
// provide a hooks equivalent (getDerivedStateFromError / componentDidCatch
// have no hook version). This catches render-time errors anywhere in its
// child tree and shows a fallback UI instead of a blank white screen.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // In a real production app, this is where you'd send the error
    // to a logging service (e.g. Sentry). For now, log to console.
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-page">
          <h1>Something went wrong</h1>
          <p>We hit an unexpected error. Please try reloading the page.</p>
          <button onClick={this.handleReload}>Back to Home</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;