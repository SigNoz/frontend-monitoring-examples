# Sending Logs

A React application that demonstrates sending logs to SigNoz.
Please follow the guide [here](https://signoz.io/docs/frontend-monitoring/sending-logs/) for full instructions.

## What it does

- React frontend with OpenTelemetry logging
- Sends application logs to SigNoz for monitoring and visualization

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
