import express from 'express';
import cors from 'cors';
import axios from 'axios';
import OpenAI from 'openai'; // 👈 corrected import
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/analyze', async (req, res) => {
  const { urls, labels } = req.body;

  if (!urls?.length || !labels?.length) {
    return res.status(400).json({ error: 'Missing urls or labels' });
  }

  const cards = [];

  for (const url of urls) {
    try {
      const response = await axios.get(url);
      const text = extractTextFromHtml(response.data);

      const prompt = `
You are an intelligent assistant analyzing the content of a website to extract specific information.

1. Detect the language of the website content.
2. If the language is not English, translate the following labels into the detected language:
${labels.map((l) => `- ${l}`).join('\n')}

3. Your task:
   - Extract the relevant information from the websites content
   - If the information for a given label is missing or unclear, map it to: "not found"
   - if "not found" information belongs to a label that is not part of the given labels, return it within a list of "suggested labels to add"
   - if the "suggested labels to add" list contains more than 3 items, pick the 3 most important ones within the website context
   - Only return results for the labels provided — do not create or answer any extra ones.

Your response should consist of only the following and nothing else:
- The original labels matched to their values.
- A line with suggested labels (if any and a max of 3).
- Nothing else.

Website content:
${text}
`;



      const chatResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      });

      const result = chatResponse.choices[0].message.content;
      const lines = result.split('\n').filter(Boolean);

const values = {};
let suggested = [];

for (let line of lines) {
  if (line.toLowerCase().startsWith('suggested labels to add')) {
    const match = line.match(/add:\s*(.*)/i);
    if (match) {
      suggested = match[1].split(',').map(label => label.trim());
    }
  } else {
    const [label, ...rest] = line.split(':');
    if (label && rest.length > 0) {
      values[label.trim()] = rest.join(':').trim();
    }
  }
}

cards.push({
  url,
  values,
  suggested,
  rawText: text
});

      

    } catch (error) {
      console.error(`Error processing ${url}:`, error.message);
      cards.push({ url, data: `❌ Failed to analyze: ${error.message}` });
    }
  }

  res.json({ cards });
});

app.post('/infer-label', async (req, res) => {
  const { label, rawText } = req.body;
  console.log('[INFER] label:', label);
  console.log('[INFER] rawText snippet:', rawText?.slice(0, 100));
  if (!label || !rawText) {
    return res.status(400).json({ error: 'Missing label or rawText' });
  }


  const prompt = `
You are analyzing a website. Try to infer the value of the following label based on the content below.
If no clear information is available, respond with "not found".

Label:
- ${label}

Website content:
${rawText}
  `.trim();

  try {
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const answer = chatResponse.choices[0].message.content.trim();
    res.json({ value: answer });
  } catch (error) {
    console.error('Follow-up GPT error:', error.message);
    res.status(500).json({ error: 'GPT inference failed' });
  }
});


function extractTextFromHtml(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

app.listen(3001, () => {
  console.log('✅ Server running at http://localhost:3001');
});
