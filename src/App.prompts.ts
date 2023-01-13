import smartlookClient from 'smartlook-client';
import { v4 as uuidv4 } from 'uuid';

import { callChatGPT, parseFallacies, transform } from './App.logic';
import {
  Fallacy,
  GetRootPromptReturn,
  IRootPromptOptions,
  ISelectedSentence,
  ISentenceSuggestion,
  State,
  Summary,
} from './App.types';
import { Interview } from './hooks/useInterviewer';

export async function getFallacies({
  state,
  isSendEmail,
}: {
  state: State;
  isSendEmail: boolean;
}): Promise<State> {
  const newOrReplyEmail = getNewOrReplyEmail(isSendEmail, state);
  const fallacyFinderPrompt = getFallacyFinderPrompt(newOrReplyEmail);
  const fallacies_: string = await callChatGPT(fallacyFinderPrompt);
  trackFallacyFinder(fallacyFinderPrompt, fallacies_);
  const fallacies: Fallacy[] = getFallaciesArray(fallacies_);

  return {
    ...state,
    fallacies,
  };
}

function getNewOrReplyEmail(isSendEmail: boolean, state: State) {
  return isSendEmail ? state.emailResponse : state.email;
}

function getFallacyFinderPrompt(newOrReplyEmail: string) {
  return `Here is the email for context:${newOrReplyEmail}"\nI want you to act as a fallacy finder. You will be on the lookout for invalid arguments so you can call out any logical errors or inconsistencies that may be present in statements and discourse in this email. Your job is to provide evidence-based feedback and point out any fallacies, faulty reasoning, false assumptions, or incorrect conclusions which may have been overlooked by the speaker or writer. \nFormat as an array of objects. Add a key called explanation that explains what the fallacy means, a fallacy key that labels the fallacy, and an evidence key that provides the sentence being labeled.\n\nConvert to  stringified JSON.`;
}

function trackFallacyFinder(fallacyFinderPrompt: string, fallacies_: string) {
  smartlookClient.track('fallacy finder', {
    prompt: fallacyFinderPrompt,
    response: fallacies_,
  });
}

function getFallaciesArray(fallacies_: string): Fallacy[] {
  return JSON.parse(fallacies_)?.map((argument) => ({
    ...argument,
    key: uuidv4(),
  }));
}

interface GetSummaryReturn extends State {
  summary: Summary[];
}

export async function getSummary({
  state,
}: {
  state: State;
}): Promise<GetSummaryReturn> {
  const summaryPrompt = `${state.email}\nCreate a summary of ${state.sender}'s arguments in this email provided for context.\n Format as a string with each summary bullet separated by a semi-colon.`;
  const summary_: string = await callChatGPT(summaryPrompt);
  trackSummary(summaryPrompt, summary_);
  const summary: Summary[] = getSummaryArray(summary_);

  return {
    ...state,
    summary,
  };
}

export function trackSummary(summaryPrompt: string, summary_: string) {
  smartlookClient.track('summarizer', {
    prompt: summaryPrompt,
    response: summary_,
  });
}

export function getSummaryArray(summary_: string): Summary[] {
  return summary_.split('; ').map((summaryPoint) => ({
    action: 'ignore',
    explain: '',
    argument: summaryPoint.trimStart(),
    key: uuidv4(),
  }));
}

interface IGetSentenceSuggestions {
  sendEmailPoints: string[];
  index: number;
  sentenceSuggestions: any;
  temperature: number;
  trackSentenceSuggestions: (
    client: any,
    prompt: string,
    response: any,
  ) => void;
  callChatGPT: (prompt: string, temperature: number) => Promise<string>;
  generateSentenceSuggestions: (
    sendEmailPoints: string[],
    index: number,
    suggestions: any,
    sentenceSuggestions_: string,
  ) => any;
}

export async function getSentenceSuggestions({
  sendEmailPoints,
  index,
  sentenceSuggestions: suggestions,
  temperature,
  trackSentenceSuggestions,
  callChatGPT,
  generateSentenceSuggestions,
}: IGetSentenceSuggestions) {
  const sentenceSuggestionsPrompt = generateSentenceSuggestionsPrompt(
    sendEmailPoints,
    index,
  );
  const sentenceSuggestions_ = await callChatGPT(
    sentenceSuggestionsPrompt,
    temperature,
  );
  trackSentenceSuggestions(
    smartlookClient,
    sentenceSuggestionsPrompt,
    sentenceSuggestions_,
  );
  return generateSentenceSuggestions(
    sendEmailPoints,
    index,
    suggestions,
    sentenceSuggestions_,
  );
}

export function generateSentenceSuggestionsPrompt(
  sendEmailPoints: string[],
  index: number,
) {
  return `Write 5 different variations, rephrasing the following sentence in random professional styles, random language complexities, and random tone. Format as an array of strings.\n\n"${sendEmailPoints[index]}\n\nConvert to stringified json."`;
}

export function trackSentenceSuggestions(
  smartlookClient,
  prompt: string,
  response: string,
) {
  smartlookClient.track('sentenceSuggestions', {
    prompt,
    response,
  });
}

export function generateSentenceSuggestions(
  sendEmailPoints,
  index: number,
  suggestions: { [key: number]: ISentenceSuggestion[] },
  sentenceSuggestions_: string,
) {
  const newSentenceSuggestions = {};
  sendEmailPoints.forEach((_, i) => {
    newSentenceSuggestions[i] = suggestions[i] || {};
    if (i === index) {
      JSON.parse(sentenceSuggestions_).forEach((suggestion_) => {
        const key = uuidv4();
        newSentenceSuggestions[i][key] = {
          selected: false,
          suggestion: suggestion_,
          key,
        };
      });
    }
  });
  return newSentenceSuggestions;
}

export async function getRootPrompt(
  options: IRootPromptOptions,
): Promise<GetRootPromptReturn> {
  const {
    descriptors,
    enableWordCount,
    fallacies,
    includeFallacyFinder,
    includeSummaryResponses,
    interview,
    isFirm,
    isSendEmail,
    languageLevelCategory,
    languageLevelSubChoices,
    promptWordCount,
    selectedSentence,
    sendEmailPoints,
    sentenceSuggestions,
    state,
    summary,
    writingStyle,
  } = options;

  const sender = state.sender || 'SENDER';
  const receiver = state.receiver || 'RECEIVER';

  const lengthPrompt = getLengthPrompt(enableWordCount, promptWordCount);
  const summaryResponsesPrompt = getSummaryResponsesPrompt(
    includeSummaryResponses,
    summary,
  );
  const summaryText = getSummaryText(includeSummaryResponses, summary);
  const sendOrReplyPrompt = getSendOrReplyPrompt(
    isSendEmail,
    lengthPrompt,
    sender,
    receiver,
    summaryResponsesPrompt,
  );
  const stylePrompt = getStylePrompt(writingStyle);
  const tonePrompt = getTonePrompt(descriptors);
  const languageComplexityPrompt = getLanguageComplexityPrompt(
    languageLevelCategory,
    languageLevelSubChoices,
  );
  const fallaciesPrompt = getFallaciesPrompt(includeFallacyFinder, fallacies);
  const points = getPoints(
    sendEmailPoints,
    selectedSentence,
    sentenceSuggestions,
  );
  const apology = getApologyPrompt(isFirm, isSendEmail);

  const emailRewritePrompt = getEmailRewritePrompt(
    stylePrompt,
    languageComplexityPrompt,
    tonePrompt,
    isSendEmail,
  );

  const interviewPrompt = getInterviewPrompt(interview, sender, receiver);

  const rootPrompt = isSendEmail
    ? `${sendOrReplyPrompt}\n\n"${points}"${emailRewritePrompt}`
    : `${sendOrReplyPrompt}\n\n"${state.email}"${summaryText}${fallaciesPrompt}${interviewPrompt}\n\nWRITE:${emailRewritePrompt}${apology}`;

  return {
    ...state,
    rootPrompt,
    isFirm,
  };
}

export function getInterviewPrompt(
  interview: Interview[],
  sender: string,
  receiver: string,
) {
  return interview.length > 0
    ? `\n\nINTERVIEW:\nPlease read the question and answer below answered by ${receiver} in reference to ${sender} to gain context for writing an email response.\n\n${interview
        .map((topic: Interview, index: number) => {
          return `Q: ${topic.question}\nA: ${topic.answer}\n\n`;
        })
        .join('')
        .trimEnd()}`
    : '';
}

export function getLengthPrompt(
  enableWordCount: boolean,
  promptWordCount: number,
) {
  return enableWordCount ? ` that is ${promptWordCount} words long ` : ' ';
}

export function getSummaryResponsesPrompt(
  includeSummaryResponses: boolean,
  summary: Summary[],
) {
  return includeSummaryResponses && summary.length > 0
    ? ' the below bullet points '
    : ' ';
}
export function getApologyPrompt(isFirm: boolean, isSendEmail: boolean) {
  return isFirm && !isSendEmail
    ? `\nDon't apologize or use the words apology, apologize, sorry, or regret.`
    : '';
}

export function getSummaryText(
  includeSummaryResponses: boolean,
  summary: {
    argument: string;
    action: 'agree' | 'disagree' | 'deny' | 'ignore' | 'explain';
    explain: string;
  }[],
) {
  return includeSummaryResponses && summary.length > 0
    ? `\n${transform(summary)}`
    : '';
}

export function getSendOrReplyPrompt(
  isSendEmail: boolean,
  lengthPrompt: string,
  sender: string,
  receiver: string,
  summaryResponsesPrompt: string,
): string {
  return isSendEmail
    ? `Please read the following points and rephrase into an email${lengthPrompt}from ${sender} to ${receiver}:`
    : `Please read the email below in quotes and rephrase${summaryResponsesPrompt}into an email response${lengthPrompt}from ${receiver} to ${sender}:`;
}

export function getStylePrompt(writingStyle: string): string {
  return writingStyle !== 'No Style Change'
    ? `a ${writingStyle.toLowerCase()} writing style`
    : '';
}

export function getTonePrompt(descriptors: string[]): string {
  return descriptors.length > 0
    ? `a tone that is ${descriptors
        .map((descriptor, index) => {
          const isLast = descriptors.length - 1 === index;
          const separator = isLast ? '' : ', ';
          const lastAnd = isLast && descriptors.length > 1 ? 'and ' : '';
          return `${lastAnd}${descriptor.toLowerCase()}${separator}`;
        })
        .join('')}`
    : '';
}

export function getLanguageComplexityPrompt(
  languageLevelCategory: string,
  languageLevelSubChoices: string[],
): string {
  return languageLevelCategory !== 'Ignore Complexity'
    ? `using language that is ${languageLevelCategory.toLowerCase()}${
        languageLevelSubChoices && languageLevelSubChoices.length > 0
          ? `, ${languageLevelSubChoices
              .map((subChoice, index) => {
                const isLast = languageLevelSubChoices.length - 1 === index;
                const separator = isLast ? '' : ', ';
                const lastAnd = isLast ? 'and ' : '';
                return `${lastAnd}${subChoice.toLowerCase()}${separator}`;
              })
              .join('')}`
          : ''
      }`
    : '';
}

export function getEmailRewritePrompt(
  stylePrompt: string,
  languageComplexityPrompt: string,
  tonePrompt: string,
  isSendEmail: boolean,
) {
  let prompt = `${
    isSendEmail ? 'Write a new' : 'Rephrase and respond to this'
  } email with`;

  if (stylePrompt) {
    prompt += ` ${stylePrompt}`;
  }

  if (languageComplexityPrompt) {
    prompt += ` ${languageComplexityPrompt}`;
  }

  const and = `${
    languageComplexityPrompt !== '' || stylePrompt !== '' ? ' and' : ''
  }`;

  if (tonePrompt) {
    prompt += `${and} ${tonePrompt}`;
  }

  if (
    prompt === 'Rephrase and respond to this email with' ||
    prompt === 'Write a new email with'
  ) {
    return '';
  } else {
    return `\n\n${prompt}.`;
  }
}

// export function getEmailRewritePrompt(
//   stylePrompt: string,
//   languageComplexityPrompt: string,
//   tonePrompt: string,
// ) {
//   if (
//     stylePrompt === '' &&
//     languageComplexityPrompt === '' &&
//     tonePrompt !== ''
//   ) {
//     return `\n\nRephrase and respond to this email with ${tonePrompt}.`;
//   } else if (
//     (stylePrompt !== '' || languageComplexityPrompt !== '') &&
//     tonePrompt !== ''
//   ) {
//     return `\n\nRephrase and respond to this email with ${stylePrompt} ${languageComplexityPrompt} and ${tonePrompt}.`;
//   } else if (
//     stylePrompt !== '' &&
//     languageComplexityPrompt !== '' &&
//     tonePrompt === ''
//   ) {
//     return `\n\nRephrase and respond to this email with ${stylePrompt} ${languageComplexityPrompt}.`;
//   } else if (
//     stylePrompt !== '' &&
//     (languageComplexityPrompt === '' || tonePrompt === '')
//   ) {
//     return `\n\nRephrase and respond to this email with ${stylePrompt}.`;
//   } else if (
//     languageComplexityPrompt !== '' &&
//     (stylePrompt === '' || tonePrompt === '')
//   ) {
//     return `\n\nRephrase and respond to this email with ${languageComplexityPrompt}.`;
//   } else {
//     return '';
//   }
// }

export function getFallaciesPrompt(
  includeFallacyFinder: boolean,
  fallacies: Fallacy[],
) {
  return includeFallacyFinder && fallacies.length > 0
    ? `\n${parseFallacies(fallacies)}`
    : '';
}

export function getPoints(
  sendEmailPoints: string[],
  selectedSentence: ISelectedSentence,
  sentenceSuggestions: ISentenceSuggestion,
) {
  return sendEmailPoints
    .map((point, index) => {
      const alternateSentence =
        sentenceSuggestions?.[index]?.[selectedSentence?.[index]]?.suggestion ||
        '';
      let pointOrAlternateSentence;
      if (selectedSentence?.[index] === undefined) {
        pointOrAlternateSentence = point;
      } else {
        pointOrAlternateSentence = alternateSentence;
      }
      if (point !== '') {
        return `• ${pointOrAlternateSentence.trimEnd()}`;
      } else {
        return `• WRITE A POINT HERE (${index + 1})`;
      }
    })
    .join('\n');
}

export async function getResponseEmail({
  state,
  rootPrompt,
  temperature,
}: {
  state: State;
  rootPrompt: string;
  temperature: number;
}): Promise<State> {
  const emailResponse = await generateEmailResponse(rootPrompt, temperature);
  trackResponseEmail(rootPrompt, emailResponse);
  console.log('emailResponse', emailResponse);
  return generateResponseState(state, emailResponse);
}

export async function generateEmailResponse(
  rootPrompt: string,
  temperature: number,
) {
  return callChatGPT(rootPrompt, temperature);
}

export function trackResponseEmail(prompt: string, response: string) {
  smartlookClient.track('response email', {
    prompt,
    response,
  });
}

export function generateResponseState(state: State, emailResponse: string) {
  return Object.assign({}, state, { emailResponse: emailResponse.trimStart() });
}
