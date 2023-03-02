import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function callChatGPT(
  prompt: string,
  temperature = 0.6,
  context?,
): Promise<any> {
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'system', content: prompt }],
    temperature,
    max_tokens: 3000,
  });
  console.debug('completion', completion);
  const text = completion.data.choices[0].message.content;
  return text;
}
