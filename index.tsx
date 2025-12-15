import React, { ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Composant de gestion d'erreur global (Empêche l'écran blanc total)
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  readonly props: Readonly<ErrorBoundaryProps>;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: '#f8fafc', 
          fontFamily: 'sans-serif', 
          padding: '20px', 
          color: '#1e293b'
        }}>
          <div style={{ maxWidth: '600px', width: '100%', backgroundColor: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
            <h1 style={{ color: '#ef4444', fontSize: '24px', marginBottom: '16px', fontWeight: 'bold' }}>Oups ! Une erreur est survenue.</h1>
            <p style={{ marginBottom: '24px', lineHeight: '1.5' }}>
              L'application a rencontré un problème inattendu au démarrage. Cela arrive souvent après une mise à jour ou un changement de domaine.
            </p>
            
            <details style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px', marginBottom: '24px', cursor: 'pointer' }}>
              <summary style={{ fontWeight: 'bold', fontSize: '14px', color: '#64748b' }}>Voir le détail technique</summary>
              <pre style={{ marginTop: '10px', fontSize: '12px', overflowX: 'auto', whiteSpace: 'pre-wrap', color: '#dc2626' }}>
                {this.state.error?.toString()}
              </pre>
            </details>

            <button
              onClick={() => {
                 // Vide le cache local et recharge
                 localStorage.clear();
                 if ('caches' in window) {
                    caches.keys().then((names) => {
                        names.forEach(name => {
                            caches.delete(name);
                        });
                    });
                 }
                 window.location.reload();
              }}
              style={{ 
                width: '100%',
                padding: '12px 24px', 
                backgroundColor: '#0ea5e9', 
                color: 'white', 
                border: 'none', 
                borderRadius: '12px', 
                fontWeight: 'bold', 
                cursor: 'pointer', 
                fontSize: '16px',
                transition: 'background-color 0.2s'
              }}
            >
              ♻️ Réinitialiser et Recharger
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);