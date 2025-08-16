import logger from "@hey/helpers/logger";
import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";
import SiteError from "@/components/Shared/SiteError";

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    message: ""
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen items-center justify-center">
          <SiteError message={this.state.message} />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
