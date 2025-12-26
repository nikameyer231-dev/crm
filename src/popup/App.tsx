import React, { useEffect } from 'react';
import { initializeAddons } from '../addons/bootloader';
import localAuth from '../infra/localAuth';

// This App component will call the bootloader after successful login
// and on startup if a session exists.

const App: React.FC = () => {
  useEffect(() => {
    // bootstrap local auth (dev user creation only)
    localAuth.bootstrapLocalAuth().catch(() => {});

    // On startup, if there is a session stored, initialize addons
    try {
      const session = localStorage.getItem('session');
      if (session) {
        initializeAddons().catch((e) => console.warn('failed to initialize addons on startup', e));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Example of handling a successful login elsewhere; if you have a global login flow
  // you should call initializeAddons() after a successful login. For convenience
  // we expose it on window in case other modules want to call it.
  (window as any).initializeAddons = initializeAddons;

  return (
    <div>
      {/* Existing App rendering should be here. We keep this light so it won't conflict. */}
      <h1>CRM Popup</h1>
    </div>
  );
};

export default App;
