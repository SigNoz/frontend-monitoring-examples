import { metrics } from '@opentelemetry/api';
import { UAParser } from 'ua-parser-js';
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

const pageUrl = window.location.pathname
  .replace(/\?.*$/, '') // remove query params
  .replace(/\/\d+/g, '/:id'); // normalize numeric IDs

export const CONSTANTS = {
  USER_ID: 'user.id',
  USER_AGENT_NAME: 'user_agent.name',
  PAGE_URL: 'url.path_template',
};

function getBrowserInfo() {
  // You can add your custom browser tracking logic here as well.
  // This example uses the ua-parser-js package.
  const parser = new UAParser();
  const result = parser.getResult();
  return result.browser.name || '';
}

function getUserId() {
  // You can add your custom user ID tracking logic here as well.
  // This example uses localStorage.
  const userId = localStorage.getItem('userId');
  return userId || '';
}

const customAttributes = {
  [CONSTANTS.USER_ID]: getUserId(),
  [CONSTANTS.USER_AGENT_NAME]: getBrowserInfo(),
  [CONSTANTS.PAGE_URL]: pageUrl,
};

const meter = metrics.getMeter('web-vitals');
const lcp = meter.createHistogram('lcp');
const cls = meter.createObservableGauge('cls');
const inp = meter.createHistogram('inp');
const ttfb = meter.createHistogram('ttfb');
const fcp = meter.createHistogram('fcp');

function sendToAnalytics(metric: { name: string; value: number }) {
  switch (metric.name) {
    case 'LCP': {
      lcp.record(metric.value, customAttributes);
      break;
    }
    case 'CLS': {
      cls.addCallback(result => {
        result.observe(metric.value, customAttributes);
      });
      break;
    }
    case 'INP': {
      inp.record(metric.value, customAttributes);
      break;
    }
    case 'TTFB': {
      ttfb.record(metric.value, customAttributes);

      break;
    }
    case 'FCP': {
      fcp.record(metric.value, customAttributes);
      break;
    }
    default: {
      console.log('unexpected metric name');
    }
  }
}

onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onLCP(sendToAnalytics);
onTTFB(sendToAnalytics);
onFCP(sendToAnalytics);
