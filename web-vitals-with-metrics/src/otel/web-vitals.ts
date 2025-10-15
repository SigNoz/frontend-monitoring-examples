import { metrics } from '@opentelemetry/api';
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

const pageUrl = window.location.pathname
  .replace(/\?.*$/, '') // remove query params
  .replace(/\/\d+/g, '/:id'); // normalize numeric IDs

const PAGE_URL_KEY = 'url.path_template';

const meter = metrics.getMeter('web-vitals');
const lcp = meter.createHistogram('lcp');
const cls = meter.createObservableGauge('cls');
const inp = meter.createHistogram('inp');
const ttfb = meter.createHistogram('ttfb');
const fcp = meter.createHistogram('fcp');

function sendToAnalytics(metric: { name: string; value: number }) {
  switch (metric.name) {
    case 'LCP': {
      lcp.record(metric.value, {
        [PAGE_URL_KEY]: pageUrl,
      });
      break;
    }
    case 'CLS': {
      cls.addCallback(result => {
        result.observe(metric.value, {
          [PAGE_URL_KEY]: pageUrl,
        });
      });
      break;
    }
    case 'INP': {
      inp.record(metric.value, {
        [PAGE_URL_KEY]: pageUrl,
      });
      break;
    }
    case 'TTFB': {
      ttfb.record(metric.value, {
        [PAGE_URL_KEY]: pageUrl,
      });
      break;
    }
    case 'FCP': {
      fcp.record(metric.value, {
        [PAGE_URL_KEY]: pageUrl,
      });
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
