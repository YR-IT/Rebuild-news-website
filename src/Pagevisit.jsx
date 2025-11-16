// hooks/usePageTracking.js
import { useEffect, useRef } from 'react';

const API_BASE_URL ="https://rebuilt-backend-beta.vercel.app" || 'http://localhost:4000';

const usePageTracking = (pageName) => {
  const startTimeRef = useRef(null);
  const isActiveRef = useRef(true);

  useEffect(() => {
    // Record page visit and start time
    startTimeRef.current = Date.now();
    
    // Send page visit event
    const sendPageVisit = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/analytics/visit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            page: pageName,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Page visit tracked:', data);
      } catch (error) {
        console.error('Error tracking page visit:', error);
      }
    };

    sendPageVisit();

    // Handle visibility change (tab switching)
    const handleVisibilityChange = () => {
      isActiveRef.current = !document.hidden;
    };

    // Handle page unload/navigation
    const handleBeforeUnload = () => {
      const endTime = Date.now();
      const timeSpent = Math.round((endTime - startTimeRef.current) / 1000);
      
      // Use sendBeacon for reliable tracking on page exit
      const data = JSON.stringify({
        page: pageName,
        timeSpent: timeSpent,
        timestamp: new Date().toISOString()
      });
      
      navigator.sendBeacon(
        `${API_BASE_URL}/api/analytics/time`,
        new Blob([data], { type: 'application/json' })
      );
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
    };
  }, [pageName]);
};

export default usePageTracking;
