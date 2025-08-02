# Sending Traces

A full-stack application that demonstrates sending traces from both frontend and backend to SigNoz.
Please follow the guide [here](https://signoz.io/docs/frontend-monitoring/sending-traces/) for full instructions.

## What it does

- React frontend
- Express.js backend
   - This backend is only meant for showcasing the distributed tracing feature.
   - Please follow the guide [here](https://signoz.io/docs/instrumentation/overview/) to setup traces in your backend applications.
- Sends traces to SigNoz for monitoring and visualization

## Framework Adaptation

The OpenTelemetry instrumentation in the `otel` folder is framework-agnostic. To use with other frameworks, simply import the `instrument.ts` file in your application's entry point.

## How to run

1. Install dependencies:
   ```bash
   npm run install:all
   ```

2. Start the application:
   ```bash
   npm run dev
   ```

This will start both the frontend (port 3000) and backend (port 3001) servers.
