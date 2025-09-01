import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { recordPageVisit, recordPageLoadTime } from './metrics';

export const useMetrics = () => {
  const location = useLocation();
  const pageLoadStartTime = useRef<number>(Date.now());

  useEffect(() => {
    const currentRoute = location.pathname;
    const currentTime = Date.now();

    // Record page visit
    recordPageVisit(currentRoute);

    // Record page load time for the previous route (if not initial load)
    if (pageLoadStartTime.current !== Date.now()) {
      const loadTime = currentTime - pageLoadStartTime.current;
      recordPageLoadTime(currentRoute, loadTime);
    }

    // Update start time for next page load measurement
    pageLoadStartTime.current = currentTime;
  }, [location.pathname]);
};
