import { Configuration, OpenAIApi } from 'openai';
import { Summary, Fallacy } from './App.types';

const configuration = new Configuration({
  apiKey: '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',
});

const openai = new OpenAIApi(configuration);

export async function callChatGPT(prompt: string): Promise<any> {
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt,
    temperature: 0.6,
    max_tokens: 1000,
  });
  const text = completion.data.choices[0].text;
  console.debug('text', text);
  return text;
}

export const fallacyColumns = [
  {
    title: 'Fallacy',
    dataIndex: 'fallacy',
    key: 'fallacy',
  },
  {
    title: 'Evidence',
    dataIndex: 'evidence',
    key: 'evidence',
  },
  {
    title: 'Explanation',
    dataIndex: 'explanation',
    key: 'explanation',
  },
];

export function stringify(obj) {
  if (typeof obj === 'string') {
    return obj;
  }

  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return obj.toString();
  }

  if (obj === null || obj === undefined) {
    return '';
  }

  if (Array.isArray(obj)) {
    return `[${obj.map(stringify).join(',')}]`;
  }

  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    if (keys.length === 0) {
      return '{}';
    }

    return `{${keys
      .map((key) => `"${key}":${stringify(obj[key])}`)
      .join(',')}}`;
  }

  return '';
}

const connectorPhrase = (action) => {
  switch (action) {
    case 'agree':
      return 'with the argument that ';
    case 'disagree':
      return 'with the argument that ';
    case 'deny':
      return 'the argument that ';
    case 'ignore':
      return 'and do not respond to the argument that ';
    case 'explain':
      return 'Make the counter-argument that ';
  }
};

function capitalize(string) {
  const words = string.split(' ');
  const capitalized = words.map(
    (word) => word[0].toUpperCase() + word.slice(1).toLowerCase(),
  );
  return capitalized.join(' ');
}

export function transform(data: Summary[]): string {
  let result = '';
  console.debug('data', data);
  for (const item of data) {
    if (item.explain) {
      result +=
        '• ' +
        capitalize('deny') +
        ' ' +
        connectorPhrase('deny') +
        ' ' +
        item.argument +
        ' ' +
        connectorPhrase(item.action) +
        ' ' +
        item.explain +
        '\n';
    } else {
      result +=
        '• ' +
        capitalize(item.action) +
        ' ' +
        connectorPhrase(item.action) +
        item.argument.toLowerCase() +
        ' ' +
        '\n';
    }
  }
  return result;
}

export function parseFallacies(fallacies: Fallacy[]): string {
  let result = '';
  for (const fallacy of fallacies) {
    result += `• Make the point that when you wrote "${fallacy.evidence}" that's an example of ${fallacy.fallacy}. ${fallacy.explanation}\n`;
  }
  return result;
}

export function wordCount(str) {
  // Split the string into an array of words
  const words = str.split(' ');

  // Return the length of the array
  return words.length;
}

export function fixJSONError(jsonString) {
  try {
    // Attempt to parse the JSON string
    const parsedJSON = JSON.parse(jsonString);
    return parsedJSON;
  } catch (error) {
    if (
      error instanceof SyntaxError &&
      error.message.includes('Unexpected token')
    ) {
      // If a SyntaxError is raised and the message includes "Unexpected token", it means there's an issue with the JSON string
      // We can fix this by removing any invalid characters that appear after the valid JSON data
      const fixedJSON = jsonString.split('}')[0] + '}';
      const parsedJSON = JSON.parse(fixedJSON);
      return parsedJSON;
    } else {
      // If the error is not a SyntaxError or the message does not include "Unexpected token", throw the original error
      throw error;
    }
  }
}
