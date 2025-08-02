import { SpanProcessor } from '@opentelemetry/sdk-trace-node';
import { UAParser } from 'ua-parser-js';

export const CONSTANTS = {
  USER_ID: 'user.id',
  BROWSER_NAME: 'browser.name',
  BROWSER_VERSION: 'browser.version',
  LOCATION_CITY: 'location.city',
  LOCATION_COUNTRY: 'location.country',
};

function getBrowserInfo() {
  // You can add your custom browser tracking logic here as well.
  // This example uses the ua-parser-js package.
  const parser = new UAParser();
  const result = parser.getResult();
  return {
    browserName: result.browser.name || '',
    browserVersion: result.browser.version || '',
    userAgent: result.ua || '',
  };
}

function getUserId() {
  // You can add your custom user ID tracking logic here as well.
  // This example uses localStorage.
  const userId = localStorage.getItem('userId');
  return {
    userId: userId || '',
  };
}

export const getLocationInfo = () => {
  return {
    city: 'New York',
    country: 'USA',
  };
};

const CustomSpanProcessor: SpanProcessor = {
  onStart: span => {
    const userData = getUserId();
    const browserInfo = getBrowserInfo();

    span.setAttribute(CONSTANTS.USER_ID, userData.userId);
    span.setAttribute(CONSTANTS.BROWSER_NAME, browserInfo.browserName);
    span.setAttribute(CONSTANTS.BROWSER_VERSION, browserInfo.browserVersion);
  },
  onEnd: () => Promise.resolve(),
  forceFlush: () => Promise.resolve(),
  shutdown: () => Promise.resolve(),
};

export default CustomSpanProcessor;
