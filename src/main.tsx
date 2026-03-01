import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import React from 'react';

class ErrorBoundary extends React.Component<{ children: any }, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, background: '#fef2f2', color: '#991b1b', height: '100vh' }}>
          <h1>App Crashed during Render</h1>
          <pre>{this.state.error?.message}</pre>
          <pre style={{ fontSize: 12 }}>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

import { initSupabase } from './lib/supabase';

// Helper to fetch runtime config and initialize Supabase
async function init() {
  try {
    const res = await fetch('/api/config');
    const { supabaseUrl, supabaseAnonKey } = await res.json();
    initSupabase(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.warn("Failed to load /api/config. Falling back to Vite env variables.");
    initSupabase(
      import.meta.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co',
      import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy_key_for_dev'
    );
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
}

init();
