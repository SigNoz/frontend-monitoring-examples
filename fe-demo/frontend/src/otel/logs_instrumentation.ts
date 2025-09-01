import {
  LoggerProvider,
  SimpleLogRecordProcessor,
} from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { logs } from '@opentelemetry/api-logs';
import { resourceFromAttributes } from '@opentelemetry/resources';
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
  'expense-tracker-frontend';

const loggerProvider = new LoggerProvider({
  resource: resourceFromAttributes({
    'service.name': serviceName,
  }),
  processors: [
    new SimpleLogRecordProcessor(
      new OTLPLogExporter({
        url: `${signozIngestionUrl}/v1/logs`,
        headers: {
          'signoz-ingestion-key': signozIngestionKey,
        },
      })
    ),
  ],
});

logs.setGlobalLoggerProvider(loggerProvider);
