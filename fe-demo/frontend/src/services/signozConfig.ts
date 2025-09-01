import { SignozConfig } from '../types';
import { logInfo, logWarn, logError } from '../otel/logger_utils';

const STORAGE_KEY = 'signoz_config';

export const signozConfigService = {
  // Get configuration from localStorage
  getConfig: (): SignozConfig => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const config = JSON.parse(stored);
        logInfo('Signoz configuration retrieved from localStorage', {
          hasIngestionUrl: !!config.ingestionUrl,
          hasIngestionKey: !!config.ingestionKey,
          hasServiceName: !!config.serviceName,
        });
        return config;
      } else {
        logInfo('No stored Signoz configuration found, using defaults');
      }
    } catch (error) {
      logError('Error parsing stored Signoz config from localStorage', {
        error: error instanceof Error ? error.message : String(error),
        storageKey: STORAGE_KEY,
      });
      console.error('Error parsing stored Signoz config:', error);
    }

    // Return default values
    logInfo('Returning default Signoz configuration values');
    return {
      ingestionUrl: '',
      ingestionKey: '',
      serviceName: '',
    };
  },

  // Save configuration to localStorage
  saveConfig: (config: SignozConfig): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      logInfo('Signoz configuration saved to localStorage successfully', {
        ingestionUrl: config.ingestionUrl,
        serviceName: config.serviceName,
        hasIngestionKey: !!config.ingestionKey,
      });
      console.log('✅ Signoz configuration saved successfully');
    } catch (error) {
      logError('Failed to save Signoz config to localStorage', {
        error: error instanceof Error ? error.message : String(error),
        storageKey: STORAGE_KEY,
        config: {
          hasIngestionUrl: !!config.ingestionUrl,
          hasIngestionKey: !!config.ingestionKey,
          hasServiceName: !!config.serviceName,
        },
      });
      console.error('Error saving Signoz config:', error);
      throw new Error('Failed to save configuration');
    }
  },

  // Clear configuration from localStorage
  clearConfig: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      logInfo('Signoz configuration cleared from localStorage', {
        storageKey: STORAGE_KEY,
      });
      console.log('✅ Signoz configuration cleared');
    } catch (error) {
      logError('Error clearing Signoz config from localStorage', {
        error: error instanceof Error ? error.message : String(error),
        storageKey: STORAGE_KEY,
      });
      console.error('Error clearing Signoz config:', error);
    }
  },

  // Check if configuration is complete
  isConfigComplete: (config: SignozConfig): boolean => {
    const isComplete = !!(
      config.ingestionUrl &&
      config.ingestionKey &&
      config.serviceName
    );
    logInfo('Signoz configuration completeness check', {
      isComplete,
      hasIngestionUrl: !!config.ingestionUrl,
      hasIngestionKey: !!config.ingestionKey,
      hasServiceName: !!config.serviceName,
    });
    return isComplete;
  },

  // Validate configuration
  validateConfig: (
    config: SignozConfig
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!config.ingestionUrl) {
      errors.push('Ingestion URL is required');
    } else if (!config.ingestionUrl.startsWith('http')) {
      errors.push('Ingestion URL must be a valid HTTP/HTTPS URL');
    }

    if (!config.ingestionKey) {
      errors.push('Ingestion Key is required');
    }

    if (!config.serviceName) {
      errors.push('Service Name is required');
    }

    const isValid = errors.length === 0;

    if (isValid) {
      logInfo('Signoz configuration validation passed', {
        ingestionUrl: config.ingestionUrl,
        serviceName: config.serviceName,
      });
    } else {
      logWarn('Signoz configuration validation failed', {
        errors,
        config: {
          hasIngestionUrl: !!config.ingestionUrl,
          hasIngestionKey: !!config.ingestionKey,
          hasServiceName: !!config.serviceName,
        },
      });
    }

    return {
      isValid,
      errors,
    };
  },
};
