import https from 'https';

export const handler = async (event, context) => {
  const apiKey = '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';
  const requestBody = JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: 'Generate a single-word unique and random team name for trivia game:' }]
  });

  const options = {
    hostname: 'api.openai.com',
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': requestBody.length,
      'Authorization': `Bearer ${apiKey}`
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    });

    req.on('error', reject);
    req.write(requestBody);
    req.end();
  });
};
