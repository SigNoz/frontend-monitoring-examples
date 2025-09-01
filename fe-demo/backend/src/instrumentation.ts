import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    'service.name': 'expense-tracker-backend',
  }),
  traceExporter: new OTLPTraceExporter({
    url: `${process.env.SIGNOZ_INGESTION_URL}/v1/traces`,
    headers: {
      'signoz-ingestion-key': process.env.SIGNOZ_INGESTION_KEY || '',
    },
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
