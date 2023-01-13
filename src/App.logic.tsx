import { Tag } from 'antd';
import { Configuration, OpenAIApi } from 'openai';
import { Summary, Fallacy } from './App.types';

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function callChatGPT(
  prompt: string,
  temperature = 0.6,
  context?,
): Promise<any> {
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt,
    temperature,
    max_tokens: 1000,
    stop: ['INTERVIEW:'],
  });
  console.debug('completion', completion);
  const text = completion.data.choices[0].text;
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

export const connectorPhrase = (action) => {
  switch (action) {
    case 'agree':
      return 'with the argument that';
    case 'disagree':
      return 'with the argument that';
    case 'deny':
      return 'the argument that';
    case 'ignore':
      return 'and do not respond to the argument that';
    case 'explain':
      return 'Make the counter-argument that';
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
  if (data.length === 0) {
    return '';
  }
  const result = data.map((item) => {
    if (item.action === 'explain') {
      return `•  ${connectorPhrase(item.action)} ${item.explain}\n`;
    } else {
      return `• ${capitalize(item.action)} ${connectorPhrase(
        item.action,
      )} ${item.argument.toLowerCase()}\n`;
    }
  });
  return result.join('');
}

export function parseFallacies(fallacies: Fallacy[]): string {
  return fallacies.reduce((result, fallacy) => {
    return (
      result +
      `• Make the point that when you wrote "${fallacy.evidence}" that's an example of ${fallacy.fallacy}. ${fallacy.explanation}\n`
    );
  }, '');
}

export function wordCount(str) {
  if (!str.trim()) {
    return 0;
  }

  // Split the string into an array of words using a regular expression to match one or more spaces
  const words = str.trim().split(/\s+/);

  // Return the length of the array
  return words.length;
}

export function formatDate(timestamp) {
  const date = new Date(timestamp);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const month = months[date.getMonth()];
  const day = date.getDate();
  let hours: string | number = date.getHours();
  let minutes: string | number = date.getMinutes();
  let seconds: string | number = date.getSeconds();
  let ampm = 'AM';
  if (hours >= 12) {
    ampm = 'PM';
    hours -= 12;
  }
  if (hours === 0) {
    hours = 12;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `(${month} ${day}) ${hours}:${minutes} ${ampm}`;
}

export function getTags(
  descriptors: string[],
  languageLevelCategory: string,
  languageLevelSubChoices: any[],
  writingStyle: string,
) {
  const descriptorColors = {
    Brief: '#FF7F50',
    Clear: '#ADD8E6',
    Compelling: '#FF69B4',
    Concise: '#00FFFF',
    Convincing: '#800080',
    Descriptive: '#D2691E',
    Detailed: '#00FF7F',
    Dynamic: '#FFA500',
    Elaborate: '#FFD700',
    Engaging: '#FFFF00',
    Evocative: '#00FF00',
    Expressive: '#00FF7F',
    Forceful: '#0000FF',
    Firm: '#9400D3',
    Friendly: '#077007',
    Informative: '#00008B',
    Passionate: '#FF69B4',
    Persuasive: '#FFA500',
    Poetic: '#800080',
    Powerful: '#FF69B4',
    Precise: '#0000FF',
    Succinct: '#FFFF00',
    Vivid: '#FFC0CB',
  };
  const toneTags = descriptors.map((tone) => {
    return (
      <Tag style={{ fontWeight: 'bold' }} color={descriptorColors[tone]}>
        {tone}
      </Tag>
    );
  });
  const languageLevelCategoryTag = languageLevelCategory !==
    'Ignore Complexity' && (
    <Tag style={{ fontWeight: 'bold' }} color='gray'>
      {languageLevelCategory}
    </Tag>
  );
  const languageLevelSubChoicesTags = languageLevelSubChoices.map(
    (subChoice) => {
      return (
        <Tag key={subChoice} style={{ fontWeight: 'bold' }}>
          {subChoice}
        </Tag>
      );
    },
  );
  const descriptionTag = (
    <Tag color='default'>{writingStyle.replace(/\s*\(.*?\)/, '')}</Tag>
  );
  return {
    toneTags,
    languageLevelCategoryTag,
    languageLevelSubChoicesTags,
    descriptionTag,
  };
}
