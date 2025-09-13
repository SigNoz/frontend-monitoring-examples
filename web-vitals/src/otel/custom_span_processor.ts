import type { SpanProcessor } from '@opentelemetry/sdk-trace-web';
import { UAParser } from 'ua-parser-js';

export const CONSTANTS = {
  USER_ID: 'user.id',
  USER_AGENT_ORIGINAL: 'user_agent.original',
  USER_AGENT_VERSION: 'user_agent.version',
  USER_AGENT_NAME: 'user_agent.name',
};

function getBrowserInfo() {
  // You can add your custom browser tracking logic here as well.
  // This example uses the ua-parser-js package.
  const parser = new UAParser();
  const result = parser.getResult();
  return {
    userAgentOriginal: result.ua || '',
    userAgentVersion: result.browser.version || '',
    userAgentName: result.browser.name || '',
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

const CustomSpanProcessor: SpanProcessor = {
  onStart: span => {
    const userData = getUserId();
    const browserInfo = getBrowserInfo();

    span.setAttribute(CONSTANTS.USER_ID, userData.userId);
    span.setAttribute(
      CONSTANTS.USER_AGENT_ORIGINAL,
      browserInfo.userAgentOriginal
    );
    span.setAttribute(
      CONSTANTS.USER_AGENT_VERSION,
      browserInfo.userAgentVersion
    );
    span.setAttribute(CONSTANTS.USER_AGENT_NAME, browserInfo.userAgentName);
  },
  onEnd: () => Promise.resolve(),
  forceFlush: () => Promise.resolve(),
  shutdown: () => Promise.resolve(),
};

export default CustomSpanProcessor;
