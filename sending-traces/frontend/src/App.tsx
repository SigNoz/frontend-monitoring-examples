import React, { useState } from 'react';

interface GenerateTextResponse {
  text: string;
  length: number;
  requestedLength: number;
}

function App() {
  const [length, setLength] = useState<number>(100);
  const [generatedText, setGeneratedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [stats, setStats] = useState<{
    length: number;
    requestedLength: number;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!length || length <= 0) {
      setError('Please enter a valid number greater than 0');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedText('');

    try {
      const response = await fetch('/api/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ length }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate text');
      }

      const data: GenerateTextResponse = await response.json();
      setGeneratedText(data.text);
      setStats({
        length: data.length,
        requestedLength: data.requestedLength,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setLength(value);
    setError('');
  };

  return (
    <div className='container'>
      <h1 className='title'>Lorem Ipsum Generator</h1>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='length' className='label'>
            Number of characters:
          </label>
          <input
            id='length'
            type='number'
            className='input'
            value={length}
            onChange={handleInputChange}
            min='1'
            max='10000'
            placeholder='Enter number of characters'
            disabled={isLoading}
          />
          <button
            type='submit'
            className='button'
            disabled={isLoading || !length || length <= 0}>
            {isLoading && <span className='loading'></span>}
            {isLoading ? 'Generating...' : 'Generate Text'}
          </button>
        </div>
      </form>

      {error && <div className='error'>{error}</div>}

      {generatedText && (
        <div className='result-container'>
          <h3>Generated Text:</h3>
          <div className='result-text'>{generatedText}</div>
          {stats && (
            <div className='stats'>
              Requested: {stats.requestedLength} characters | Generated:{' '}
              {stats.length} characters
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
