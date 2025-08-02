import {
  LoggerProvider,
  SimpleLogRecordProcessor,
} from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { logs } from '@opentelemetry/api-logs';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { CustomAttributesProcessor } from './custom_attributes_processor';

const loggerProvider = new LoggerProvider({
  resource: resourceFromAttributes({
    'service.name': 'demo-logs-app',
  }),
  processors: [
    new CustomAttributesProcessor(),
    new SimpleLogRecordProcessor(
      new OTLPLogExporter({
        url: `${import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT}/v1/logs`,
      })
    ),
  ],
});

logs.setGlobalLoggerProvider(loggerProvider);
