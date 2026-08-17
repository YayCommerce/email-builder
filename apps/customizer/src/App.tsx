import { useEffect } from 'react';

import NotificationContextHolder from '@src/components/notification-context-holder';
import DataRouter from '@src/components/router';

import { initializeAddonWindowVariables } from '@src/addon-utils';

function App() {
  useEffect(() => {
    initializeAddonWindowVariables();
    document.dispatchEvent(new CustomEvent('yaymail-loaded'));
    // Load data for addons and third-parties

    const stopUnnecessaryAnimation = (e: DragEvent) => {
      e.preventDefault();
    };
    document.addEventListener('dragover', stopUnnecessaryAnimation);
    return () => {
      document.removeEventListener('dragover', stopUnnecessaryAnimation);
    };
  }, []);

  return (
    <>
      <NotificationContextHolder />
      <DataRouter />
      <div id="yaymail-portal-root" />
      <div id="yaymail-dom-placeholder" />
    </>
  );
}

export default App;
