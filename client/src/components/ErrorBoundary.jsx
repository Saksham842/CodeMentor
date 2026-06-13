import { Component } from "react";
import { Home, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Dashboard error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full min-h-[60vh] p-8">
          <div className="max-w-md text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <span className="text-2xl">⚠</span>
            </div>
            <h2 className="text-xl font-display font-bold text-white">Render Error</h2>
            <p className="text-sm text-stardust/60 font-mono">
              Something went wrong rendering this page. This may be due to stale data.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  localStorage.removeItem("codementor-project-store");
                  window.location.href = "/";
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-void border border-rift text-sm text-stardust hover:text-white hover:border-nebula/40 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Reset &amp; Reload
              </button>
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-nebula/20 border border-nebula/30 text-sm text-white hover:bg-nebula/30 transition-all"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
