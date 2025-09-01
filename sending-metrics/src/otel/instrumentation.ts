import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { metrics } from '@opentelemetry/api';

// Define your resource, e.g., service name, environment.
const resource = resourceFromAttributes({
  'service.name': 'sending-metrics-demo',
});

// Create a metric reader with OTLP exporter configured to send metrics to a local collector.
const metricReader = new PeriodicExportingMetricReader({
  exporter: new OTLPMetricExporter({
    url: `https://ingest.${
      import.meta.env.VITE_INGESTION_REGION
    }.staging.signoz.cloud:443/v1/metrics`,
    headers: {
      'signoz-ingestion-key': import.meta.env.VITE_INGESTION_KEY,
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
