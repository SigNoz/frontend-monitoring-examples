import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { metrics } from '@opentelemetry/api';

// Define your resource, e.g., service name, environment.
const resource = resourceFromAttributes({
  'service.name': 'web-vitals-with-metrics',
});

// Create a metric reader with OTLP exporter configured to send metrics to a local collector.
const metricReader = new PeriodicExportingMetricReader({
  exporter: new OTLPMetricExporter({
    url: 'http://127.0.0.1:4318/v1/metrics',
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
