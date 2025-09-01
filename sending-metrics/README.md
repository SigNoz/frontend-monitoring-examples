# Sending Metrics

A React application that demonstrates sending custom metrics to SigNoz using OpenTelemetry.
Please follow the guide [here](https://signoz.io/docs/frontend-monitoring/sending-metrics/) for full instructions.

## What it does

- React frontend with React Router navigation
- OpenTelemetry metrics instrumentation
- Custom metrics for route changes and page load times
- Sends application metrics to SigNoz for monitoring and visualization

## Framework Adaptation

The OpenTelemetry instrumentation in the `otel` folder is framework-agnostic. To use with other frameworks, simply import the `instrument.ts` file in your application's entry point.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Your SignOz cloud ingestion region (e.g., us-east-1, eu-west-1)
VITE_INGESTION_REGION=your-region-here

# Your SignOz cloud ingestion key
VITE_INGESTION_KEY=your-ingestion-key-here
```

## Custom Metrics

The application automatically captures the following metrics:

- **Page Visits**: `page_visits_total` - Counter for each page visit
- **Page Load Times**: `page_load_time_seconds` - Histogram for page load performance

## How to run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (see above)

3. Start the application:
   ```bash
   npm run dev
   ```

This will start the frontend server (typically on port 5173).
