"use client";

import React from "react";

type State = { error: Error | null };

export class MapErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  State
> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <div className="flex h-[60dvh] flex-col items-center justify-center gap-3 bg-slate-100 px-6 text-center">
            <p className="font-semibold text-slate-800">Map could not load</p>
            <p className="text-sm text-slate-600">{this.state.error.message}</p>
            <button
              type="button"
              className="rounded-xl bg-brand px-4 py-2 text-white"
              onClick={() => this.setState({ error: null })}
            >
              Retry
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
