import type { SpanProcessor } from '@opentelemetry/sdk-trace-node';
import { UAParser } from 'ua-parser-js';

export const CONSTANTS = {
  USER_ID: 'user.id',
  BROWSER_NAME: 'browser.name',
  BROWSER_VERSION: 'browser.version',
  PAGE_URL: 'page.url',
  PAGE_PATH: 'page.path',
  PAGE_SEARCH: 'page.search',
  PAGE_HASH: 'page.hash',
  PAGE_FULL_PATH: 'page.full_path',
  PAGE_FULL_URL: 'page.full_url',
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

function getPageUrl() {
  return {
    pathname: window.location.pathname, // "/users"
    search: window.location.search, // "?id=123"
    hash: window.location.hash, // "#section"
    fullPath:
      window.location.pathname + window.location.search + window.location.hash,
    fullUrl: window.location.href,
  };
}

const CustomSpanProcessor: SpanProcessor = {
  onStart: span => {
    const userData = getUserId();
    const browserInfo = getBrowserInfo();
    const pageUrl = getPageUrl();

    span.setAttribute(CONSTANTS.USER_ID, userData.userId);
    span.setAttribute(CONSTANTS.BROWSER_NAME, browserInfo.browserName);
    span.setAttribute(CONSTANTS.BROWSER_VERSION, browserInfo.browserVersion);
    span.setAttribute(CONSTANTS.PAGE_URL, pageUrl.fullUrl);
    span.setAttribute(CONSTANTS.PAGE_PATH, pageUrl.pathname);
    span.setAttribute(CONSTANTS.PAGE_SEARCH, pageUrl.search);
    span.setAttribute(CONSTANTS.PAGE_HASH, pageUrl.hash);
    span.setAttribute(CONSTANTS.PAGE_FULL_PATH, pageUrl.fullPath);
    span.setAttribute(CONSTANTS.PAGE_FULL_URL, pageUrl.fullUrl);
  },
  onEnd: () => Promise.resolve(),
  forceFlush: () => Promise.resolve(),
  shutdown: () => Promise.resolve(),
};

export default CustomSpanProcessor;
