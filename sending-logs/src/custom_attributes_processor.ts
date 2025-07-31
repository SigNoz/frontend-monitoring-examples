import type { LogRecordProcessor, SdkLogRecord } from '@opentelemetry/sdk-logs';
import { UAParser } from 'ua-parser-js';

function getBrowserInfo() {
  // You can add your custom browser tracking logic here as well.
  // This example uses the ua-parser-js package.
  const parser = new UAParser();
  const result = parser.getResult();
  return {
    browserName: result.browser.name,
    browserVersion: result.browser.version,
    userAgent: result.ua,
  };
}

function getUserId() {
  // You can add your custom user ID tracking logic here as well.
  // This example uses localStorage.
  const userId = localStorage.getItem('userId');
  return {
    userId,
  };
}

function getAdditionalAttributes() {
  return {
    ...getBrowserInfo(),
    ...getUserId(),
  };
}

export class CustomAttributesProcessor implements LogRecordProcessor {
  onEmit(logRecord: SdkLogRecord) {
    const additionalAttrs = getAdditionalAttributes();
    logRecord.setAttributes(additionalAttrs);
  }

  shutdown(): Promise<void> {
    return Promise.resolve();
  }

  forceFlush(): Promise<void> {
    return Promise.resolve();
  }
}
