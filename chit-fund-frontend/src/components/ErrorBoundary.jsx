import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error(error, errorInfo); }

  render() {
    if (this.state.hasError) {
      return <h2 className="text-center mt-20">Something went wrong.</h2>;
    }
    return this.props.children;
  }
}
