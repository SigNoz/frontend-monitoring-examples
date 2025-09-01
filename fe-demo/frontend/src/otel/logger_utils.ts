import {
  logs,
  SeverityNumber,
  type AnyValueMap,
} from '@opentelemetry/api-logs';

const logger = logs.getLogger('frontend-logger');

export function logInfo(body: string, attrs: AnyValueMap = {}) {
  logger.emit({
    body,
    severityNumber: SeverityNumber.INFO,
    severityText: 'INFO',
    attributes: attrs,
  });
}

export function logWarn(body: string, attrs: AnyValueMap = {}) {
  logger.emit({
    body,
    severityNumber: SeverityNumber.WARN,
    severityText: 'WARN',
    attributes: attrs,
  });
}

export function logError(body: string, attrs: AnyValueMap = {}) {
  logger.emit({
    body,
    severityNumber: SeverityNumber.ERROR,
    severityText: 'ERROR',
    attributes: attrs,
  });
}
