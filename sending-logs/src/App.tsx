import './App.css';
import { logInfo, logWarn, logError } from './utils';

function App() {
  const handleInfoLog = () => {
    logInfo('User clicked Info button', {
      buttonType: 'info',
      timestamp: new Date().toISOString(),
    });
  };

  const handleWarningLog = () => {
    logWarn('User clicked Warning button - this is a demo warning', {
      buttonType: 'warning',
      timestamp: new Date().toISOString(),
      severity: 'medium',
    });
  };

  const handleErrorLog = () => {
    logError('User clicked Error button - this is a demo error', {
      buttonType: 'error',
      timestamp: new Date().toISOString(),
      severity: 'high',
      errorCode: 'DEMO_ERROR_001',
    });
  };

  return (
    <div className='app-container'>
      <header className='app-header'>
        <h1>Logs Demo Application</h1>
        <p className='app-description'>
          Click the buttons below to trigger different types of logs and see how
          they appear in your logging system.
        </p>
      </header>

      <main className='main-content'>
        <div className='logs-demo-section'>
          <h2>Logging Demo</h2>
          <p className='section-description'>
            Each button will trigger a different log level with contextual
            information.
          </p>

          <div className='buttons-container'>
            <div className='log-button-group'>
              <button className='log-button log-info' onClick={handleInfoLog}>
                📝 Log Info
              </button>
              <p className='button-description'>
                Triggers an INFO level log with general information about the
                action.
              </p>
            </div>

            <div className='log-button-group'>
              <button
                className='log-button log-warning'
                onClick={handleWarningLog}>
                ⚠️ Log Warning
              </button>
              <p className='button-description'>
                Triggers a WARNING level log to demonstrate warning scenarios.
              </p>
            </div>

            <div className='log-button-group'>
              <button className='log-button log-error' onClick={handleErrorLog}>
                🚨 Log Error
              </button>
              <p className='button-description'>
                Triggers an ERROR level log to demonstrate error handling.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className='app-footer'>
        <p>Check the logs explorer in SigNoz to see the generated logs.</p>
      </footer>
    </div>
  );
}

export default App;
