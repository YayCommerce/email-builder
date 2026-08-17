import { ErrorBoundary } from 'react-error-boundary';

import AntdConfigProvider from '@src/components/antd-config-provider';

import App from '@src/App';

import CustomQueryClientProvider from './components/custom-query-client-provider';

import '@src/assets/styles/override-ant.scss';
import '@src/index.scss';

import '@src/utils/css-variables-supplier';

const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Something went wrong:</h2>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: '10px',
          padding: '8px 16px',
          backgroundColor: '#007cba',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Reload Page
      </button>
    </div>
  );
};

const root = document.getElementById('yaymail-main-pages');

if (root != null) {
  // Use React 18's createRoot for better compatibility
  if ((window.ReactDOM as any).createRoot) {
    const reactRoot = (window.ReactDOM as any).createRoot(root);
    reactRoot.render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AntdConfigProvider>
          <CustomQueryClientProvider enableDevtools>
            <App />
          </CustomQueryClientProvider>
        </AntdConfigProvider>
      </ErrorBoundary>,
    );
  } else {
    // Fallback to React 17 render method
    window.ReactDOM.render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AntdConfigProvider>
          <CustomQueryClientProvider enableDevtools>
            <App />
          </CustomQueryClientProvider>
        </AntdConfigProvider>
      </ErrorBoundary>,
      root,
    );
  }
}
