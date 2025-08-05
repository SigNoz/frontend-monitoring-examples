import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import {
  WebTracerProvider,
  BatchSpanProcessor,
} from '@opentelemetry/sdk-trace-web';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { resourceFromAttributes } from '@opentelemetry/resources';
import CustomSpanProcessor from './custom_span_processor';

const exporter = new OTLPTraceExporter({
  url: `${import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`,
});

const provider = new WebTracerProvider({
  resource: resourceFromAttributes({
    'service.name': 'web-vitals-demo-app-testing-2',
  }),
  spanProcessors: [new BatchSpanProcessor(exporter), CustomSpanProcessor],
});

provider.register({
  contextManager: new ZoneContextManager(),
});
