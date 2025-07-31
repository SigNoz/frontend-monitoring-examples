import './tracing';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Lorem ipsum words for generating random text
const loremWords = [
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'sed',
  'do',
  'eiusmod',
  'tempor',
  'incididunt',
  'ut',
  'labore',
  'et',
  'dolore',
  'magna',
  'aliqua',
  'ut',
  'enim',
  'ad',
  'minim',
  'veniam',
  'quis',
  'nostrud',
  'exercitation',
  'ullamco',
  'laboris',
  'nisi',
  'ut',
  'aliquip',
  'ex',
  'ea',
  'commodo',
  'consequat',
  'duis',
  'aute',
  'irure',
  'dolor',
  'in',
  'reprehenderit',
  'voluptate',
  'velit',
  'esse',
  'cillum',
  'dolore',
  'eu',
  'fugiat',
  'nulla',
  'pariatur',
  'excepteur',
  'sint',
  'occaecat',
  'cupidatat',
  'non',
  'proident',
  'sunt',
  'culpa',
  'qui',
  'officia',
  'deserunt',
  'mollit',
  'anim',
  'id',
  'est',
  'laborum',
  'et',
  'dolore',
  'magna',
  'aliqua',
  'ut',
  'enim',
  'ad',
  'minim',
];

// Function to generate random text of specified length
function generateLoremIpsum(length: number): string {
  if (length <= 0) return '';

  let result = '';
  let currentLength = 0;

  while (currentLength < length) {
    const randomWord =
      loremWords[Math.floor(Math.random() * loremWords.length)];

    // Add space if not the first word
    const wordToAdd = currentLength === 0 ? randomWord : ' ' + randomWord;

    // Check if adding this word would exceed the target length
    if (currentLength + wordToAdd.length <= length) {
      result += wordToAdd;
      currentLength += wordToAdd.length;
    } else {
      // If we can't add a full word, add characters to reach the target length
      const remainingLength = length - currentLength;
      if (remainingLength > 0) {
        result += ' ' + randomWord.substring(0, remainingLength);
      }
      break;
    }
  }

  return result;
}

// API Route
app.post('/api/generate-text', (req, res) => {
  try {
    const { length } = req.body;
    // Validate input
    if (typeof length !== 'number' || length <= 0 || length > 10000) {
      return res.status(400).json({
        error: 'Invalid length. Please provide a number between 1 and 10000.',
      });
    }
    const generatedText = generateLoremIpsum(length);
    res.json({
      text: generatedText,
      length: generatedText.length,
      requestedLength: length,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(
    `📝 API endpoint: POST http://localhost:${PORT}/api/generate-text`
  );
});
