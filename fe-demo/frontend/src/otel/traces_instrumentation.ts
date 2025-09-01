import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { STORAGE_KEYS } from './constants';
import { UserInteractionInstrumentation } from '@opentelemetry/instrumentation-user-interaction';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import CustomSpanProcessor from './custom_span_processor';
import { ZoneContextManager } from '@opentelemetry/context-zone';

const signozIngestionUrl =
  localStorage.getItem(STORAGE_KEYS.SIGNOZ_INGESTION_URL) ||
  (import.meta as any).env.VITE_SIGNOZ_INGESTION_URL ||
  '';

const exporter = new OTLPTraceExporter({
  url: `${signozIngestionUrl}/v1/traces`,
  headers: {
    'signoz-ingestion-key':
      localStorage.getItem(STORAGE_KEYS.SIGNOZ_INGESTION_KEY) ||
      (import.meta as any).env.VITE_SIGNOZ_INGESTION_KEY ||
      '',
  },
});

const provider = new WebTracerProvider({
  resource: resourceFromAttributes({
    'service.name':
      (import.meta as any).env.VITE_SIGNOZ_SERVICE_NAME ||
      localStorage.getItem(STORAGE_KEYS.SIGNOZ_SERVICE_NAME) ||
      'expense-tracker-frontend',
  }),
  spanProcessors: [new BatchSpanProcessor(exporter), CustomSpanProcessor],
});

provider.register({
  contextManager: new ZoneContextManager(),
});

registerInstrumentations({
  instrumentations: [
    new FetchInstrumentation({
      // Selects which backend servers are allowed to receive trace headers for linking traces across services.
      // Using /.*/ acts as a wildcard. For safer usage in production, replace with specific domains:
      // e.g. propagateTraceHeaderCorsUrls: [/api\.example\.com/, /my-backend\.internal/]
      propagateTraceHeaderCorsUrls: /.*/,
    }),
    new UserInteractionInstrumentation({
      eventNames: ['click', 'input', 'submit', 'error', 'change'],
    }),
    new XMLHttpRequestInstrumentation({
      propagateTraceHeaderCorsUrls: /.*/,
    }),
  ],
});
