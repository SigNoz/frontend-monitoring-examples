import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { SignozConfig } from '../types';
import { signozConfigService } from '../services/signozConfig';
import { logInfo, logWarn, logError } from '../otel/logger_utils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [config, setConfig] = useState<SignozConfig>({
    ingestionUrl: '',
    ingestionKey: '',
    serviceName: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing config when modal opens
  useEffect(() => {
    if (isOpen) {
      logInfo('SettingsModal opened - loading existing configuration');
      const existingConfig = signozConfigService.getConfig();
      setConfig(existingConfig);
      setErrors([]);
      logInfo('SettingsModal configuration loaded', {
        hasIngestionUrl: !!existingConfig.ingestionUrl,
        hasIngestionKey: !!existingConfig.ingestionKey,
        hasServiceName: !!existingConfig.serviceName,
      });
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof SignozConfig, value: string) => {
    logInfo('User modified configuration field', {
      field,
      valueLength: value.length,
    });
    setConfig(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrors([]);
      logInfo('User attempting to save Signoz configuration', {
        hasIngestionUrl: !!config.ingestionUrl,
        hasIngestionKey: !!config.ingestionKey,
        hasServiceName: !!config.serviceName,
      });

      // Validate configuration
      const validation = signozConfigService.validateConfig(config);
      if (!validation.isValid) {
        logWarn('Configuration validation failed', {
          errors: validation.errors,
          config: {
            hasIngestionUrl: !!config.ingestionUrl,
            hasIngestionKey: !!config.ingestionKey,
            hasServiceName: !!config.serviceName,
          },
        });
        setErrors(validation.errors);
        return;
      }

      // Save configuration
      signozConfigService.saveConfig(config);
      logInfo('Signoz configuration saved successfully', {
        ingestionUrl: config.ingestionUrl,
        serviceName: config.serviceName,
      });

      // Show success toast and close modal
      toast.success('Configuration saved successfully!');
      onClose();
    } catch (error) {
      logError('Failed to save Signoz configuration', {
        error: error instanceof Error ? error.message : String(error),
        config: {
          hasIngestionUrl: !!config.ingestionUrl,
          hasIngestionKey: !!config.ingestionKey,
          hasServiceName: !!config.serviceName,
        },
      });
      console.error('Failed to save Signoz configuration:', error);
      toast.error('Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      logInfo('SettingsModal closed by user');
      onClose();
    } else {
      logWarn('SettingsModal close attempt blocked - save in progress');
    }
  };

  if (!isOpen) return null;

  return (
    <div className='modal-overlay' onClick={handleClose}>
      <div className='modal-content' onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900'>
            Signoz Configuration
          </h2>
          <button
            onClick={handleClose}
            disabled={isSaving}
            className='p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50'>
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Content */}
        <div className='p-6 space-y-6'>
          {/* Description */}
          <div className='text-sm text-gray-600'>
            Configure your Signoz monitoring settings. These values will be
            stored locally in your browser.
          </div>

          {/* Form Fields */}
          <div className='space-y-4'>
            {/* Ingestion URL */}
            <div>
              <label
                htmlFor='ingestionUrl'
                className='block text-sm font-medium text-gray-700 mb-2'>
                Signoz Ingestion URL *
              </label>
              <input
                type='url'
                id='ingestionUrl'
                value={config.ingestionUrl}
                onChange={e =>
                  handleInputChange('ingestionUrl', e.target.value)
                }
                placeholder='https://your-signoz-instance.com:8080'
                className='input-field'
                disabled={isSaving}
              />
            </div>

            {/* Ingestion Key */}
            <div>
              <label
                htmlFor='ingestionKey'
                className='block text-sm font-medium text-gray-700 mb-2'>
                Signoz Ingestion Key *
              </label>
              <input
                type='password'
                id='ingestionKey'
                value={config.ingestionKey}
                onChange={e =>
                  handleInputChange('ingestionKey', e.target.value)
                }
                placeholder='Enter your ingestion key'
                className='input-field'
                disabled={isSaving}
              />
            </div>

            {/* Service Name */}
            <div>
              <label
                htmlFor='serviceName'
                className='block text-sm font-medium text-gray-700 mb-2'>
                Service Name *
              </label>
              <input
                type='text'
                id='serviceName'
                value={config.serviceName}
                onChange={e => handleInputChange('serviceName', e.target.value)}
                placeholder='expense-manager-frontend'
                className='input-field'
                disabled={isSaving}
              />
            </div>
          </div>

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
              <div className='flex items-start space-x-3'>
                <AlertCircle className='w-5 h-5 text-red-500 mt-0.5 flex-shrink-0' />
                <div className='text-sm text-red-700'>
                  <ul className='list-disc list-inside space-y-1'>
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Success/Error Message */}
          {/* Removed as per edit hint */}
        </div>

        {/* Footer */}
        <div className='flex items-center justify-end space-x-3 p-6 border-t border-gray-200'>
          <button
            onClick={handleClose}
            disabled={isSaving}
            className='btn-secondary'>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={
              isSaving ||
              !config.ingestionUrl ||
              !config.ingestionKey ||
              !config.serviceName
            }
            className='btn-primary disabled:opacity-50 disabled:cursor-not-allowed'>
            {isSaving ? (
              <div className='flex items-center space-x-2'>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                <span>Saving...</span>
              </div>
            ) : (
              <div className='flex items-center space-x-2'>
                <Save className='w-4 h-4' />
                <span>Save Configuration</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
