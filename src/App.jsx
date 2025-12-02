import React, { Suspense } from 'react';
import './index.css';

// Lazy load the main page
const ShipChatPage = React.lazy(() => import('./pages/ShipChatPage'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen bg-slate-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const App = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ShipChatPage />
    </Suspense>
  );
};

export default App;
