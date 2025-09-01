import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { metrics } from '@opentelemetry/api';
import { STORAGE_KEYS } from './constants';

const signozIngestionUrl =
  localStorage.getItem(STORAGE_KEYS.SIGNOZ_INGESTION_URL) ||
  (import.meta as any).env.VITE_SIGNOZ_INGESTION_URL ||
  '';
const signozIngestionKey =
  localStorage.getItem(STORAGE_KEYS.SIGNOZ_INGESTION_KEY) ||
  (import.meta as any).env.VITE_SIGNOZ_INGESTION_KEY ||
  '';
const serviceName =
  (import.meta as any).env.VITE_SIGNOZ_SERVICE_NAME ||
  localStorage.getItem(STORAGE_KEYS.SIGNOZ_SERVICE_NAME) ||
  'admin-dashboard-frontend';

// Define your resource, e.g., service name, environment.
const resource = resourceFromAttributes({
  'service.name': serviceName,
});

// Create a metric reader with OTLP exporter configured to send metrics to a local collector.
const metricReader = new PeriodicExportingMetricReader({
  exporter: new OTLPMetricExporter({
    url: `${signozIngestionUrl}/v1/metrics`,
    headers: {
      'signoz-ingestion-key': signozIngestionKey,
    },
  }),
  exportIntervalMillis: 10000, // Export metrics every 10 seconds.
});

// Initialize a MeterProvider with the above configurations.
const myServiceMeterProvider = new MeterProvider({
  resource,
  readers: [metricReader],
});

// Set the initialized MeterProvider as global to enable metric collection across the app.
metrics.setGlobalMeterProvider(myServiceMeterProvider);
