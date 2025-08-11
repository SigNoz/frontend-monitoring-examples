# Web Vitals Monitoring

A React application that demonstrates monitoring Core Web Vitals using OpenTelemetry and sending them to SigNoz.
Please follow the guide [here](https://signoz.io/docs/frontend-monitoring/opentelemetry-web-vitals/) for full instructions.

## What it does

- React frontend
- Monitors Core Web Vitals (FCP, INP, TTFB, LCP, CLS) using the web-vitals library
- Sends web vitals metrics as OpenTelemetry traces to SigNoz for monitoring and visualization

## Framework Adaptation

The OpenTelemetry instrumentation in the `otel` folder is framework-agnostic. To use with other frameworks, simply import the `instrument.ts` file in your application's entry point.

## How to run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the application:
   ```bash
   npm run dev
   ```

This will start the frontend server (typically on port 5173).
