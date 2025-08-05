import { onFCP, onINP, onTTFB, onLCP, onCLS, type Metric } from 'web-vitals';
import { trace, context, type Context } from '@opentelemetry/api';
import { hrTime } from '@opentelemetry/core';

const webVitalsTracer = trace.getTracer('web-vitals-instrumentation');

let webVitalsContext: Context | null = null;
let isContextCreated = false;

function createWebVitalsContext() {
  if (!isContextCreated) {
    const parentSpan = webVitalsTracer.startSpan('web-vitals');
    webVitalsContext = trace.setSpan(context.active(), parentSpan);
    parentSpan.end();
    isContextCreated = true;
  }
  return webVitalsContext;
}

function createWebVitalsSpan(metric: Metric) {
  const ctx = createWebVitalsContext();
  if (!ctx) {
    console.warn('Web vitals context not available for:', metric.name);
    return;
  }

  const now = hrTime();
  const webVitalsSpan = webVitalsTracer.startSpan(
    metric.name,
    { startTime: now },
    ctx
  );

  webVitalsSpan.setAttributes({
    'web_vital.name': metric.name,
    'web_vital.id': metric.id,
    'web_vital.navigationType': metric.navigationType,
    'web_vital.delta': metric.delta,
    'web_vital.rating': metric.rating,
    'web_vital.value': metric.value,
    'page.url': window.location.href,
    'page.title': document.title,
    timestamp: Date.now(),
  });

  webVitalsSpan.end();
  return webVitalsSpan;
}

createWebVitalsContext();

onFCP(metric => {
  createWebVitalsSpan(metric);
});

onINP(metric => {
  createWebVitalsSpan(metric);
});

onTTFB(metric => {
  createWebVitalsSpan(metric);
});

onLCP(metric => {
  createWebVitalsSpan(metric);
});

onCLS(metric => {
  createWebVitalsSpan(metric);
});
