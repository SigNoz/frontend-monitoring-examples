import { metrics } from '@opentelemetry/api';

// Get the meter from the global meter provider
const meter = metrics.getMeter('react-router-metrics');

// Create custom metrics
export const pageVisitsCounter = meter.createCounter('page_visits_total', {
  description: 'Total number of page visits',
});

export const pageLoadTimeHistogram = meter.createHistogram(
  'page_load_time_seconds',
  {
    description: 'Time taken to load pages',
    unit: 's',
  }
);

// Helper function to record page visit
export const recordPageVisit = (route: string) => {
  pageVisitsCounter.add(1, {
    route: route,
    timestamp: new Date().toISOString(),
  });
};

// Helper function to record page load time
export const recordPageLoadTime = (route: string, loadTimeMs: number) => {
  const loadTimeSeconds = loadTimeMs / 1000;
  pageLoadTimeHistogram.record(loadTimeSeconds, {
    route: route,
    timestamp: new Date().toISOString(),
  });
};
