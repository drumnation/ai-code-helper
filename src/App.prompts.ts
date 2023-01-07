import { callChatGPT, parseFallacies, transform } from './App.logic';
import { State } from './App.types';
import { fixJSONError } from './App.logic';
import smartlookClient from 'smartlook-client';
import { v4 as uuidv4 } from 'uuid';

export async function getFallacies({ state, isSendEmail }): Promise<State> {
  const newOrReplyEmail = getNewOrReplyEmail(isSendEmail, state);
  const fallacyFinderPrompt = getFallacyFinderPrompt(newOrReplyEmail);
  const fallacies_ = await callChatGPT(fallacyFinderPrompt);
  trackFallacyFinder(fallacyFinderPrompt, fallacies_);
  const fallacies = getFallaciesArray(fallacies_);

  return {
    ...state,
    fallacies,
  };
}

function getNewOrReplyEmail(isSendEmail, state) {
  return isSendEmail ? state.emailResponse : state.email;
}

function getFallacyFinderPrompt(newOrReplyEmail) {
  return `Here is the email for context:${newOrReplyEmail}"\nI want you to act as a fallacy finder. You will be on the lookout for invalid arguments so you can call out any logical errors or inconsistencies that may be present in statements and discourse in this email. Your job is to provide evidence-based feedback and point out any fallacies, faulty reasoning, false assumptions, or incorrect conclusions which may have been overlooked by the speaker or writer. \nFormat as an array of objects. Add a key called explanation that explains what the fallacy means, a fallacy key that labels the fallacy, and an evidence key that provides the sentence being labeled.\n\nConvert to  stringified JSON.`;
}

function trackFallacyFinder(fallacyFinderPrompt, fallacies_) {
  smartlookClient.track('fallacy finder', {
    prompt: fallacyFinderPrompt,
    response: fallacies_,
  });
}

function getFallaciesArray(fallacies_) {
  return fixJSONError(fallacies_.trimStart())?.map((argument) => ({
    ...argument,
    key: uuidv4(),
  }));
}

export async function getSummary({ state }): Promise<State> {
  const summaryPrompt = `${state.email}\nCreate a summary of ${state.sender}'s arguments in this email provided for context.\n Format as a string with each summary bullet separated by a semi-colon.`;
  const summary_ = await callChatGPT(summaryPrompt);
  trackSummary(summaryPrompt, summary_);
  const summary = getSummaryArray(summary_);

  return {
    ...state,
    summary,
  };
}

function trackSummary(summaryPrompt, summary_) {
  smartlookClient.track('summarizer', {
    prompt: summaryPrompt,
    response: summary_,
  });
}

function getSummaryArray(summary_) {
  return summary_.split('; ').map((summaryPoint) => ({
    action: 'ignore',
    explain: '',
    argument: summaryPoint.trimStart(),
    key: uuidv4(),
  }));
}

export async function getSentenceSuggestions({
  sendEmailPoints,
  index,
  sentenceSuggestions: suggestions,
  temperature,
}) {
  const sentenceSuggestionsPrompt = generateSentenceSuggestionsPrompt(
    sendEmailPoints,
    index,
  );
  const sentenceSuggestions_ = await callChatGPT(
    sentenceSuggestionsPrompt,
    temperature,
  );
  trackSentenceSuggestions(sentenceSuggestionsPrompt, sentenceSuggestions_);
  return generateSentenceSuggestions(
    sendEmailPoints,
    index,
    suggestions,
    sentenceSuggestions_,
  );
}

function generateSentenceSuggestionsPrompt(sendEmailPoints, index) {
  return `Write 5 different variations, rephrasing the following sentence in random professional styles, random language complexities, and random tone. Format as an array of strings.\n\n"${sendEmailPoints[index]}\n\nConvert to stringified json."`;
}

function trackSentenceSuggestions(prompt, response) {
  smartlookClient.track('sentenceSuggestions', {
    prompt,
    response,
  });
}

function generateSentenceSuggestions(
  sendEmailPoints,
  index,
  suggestions,
  sentenceSuggestions_,
) {
  const newSentenceSuggestions = {};
  sendEmailPoints.forEach((_, i) => {
    newSentenceSuggestions[i] =
      i === index
        ? JSON.parse(sentenceSuggestions_).reduce((acc, suggestion_) => {
            const key = uuidv4();
            return {
              ...acc,
              [key]: {
                selected: false,
                suggestion: suggestion_,
                key,
              },
            };
          }, {})
        : suggestions[i];
  });
  return newSentenceSuggestions;
}

export async function getRootPrompt(options): Promise<State> {
  const {
    descriptors,
    enableWordCount,
    fallacies,
    includeFallacyFinder,
    includeSummaryResponses,
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

  const rootPrompt = isSendEmail
    ? `${sendOrReplyPrompt}\n\n"${points}"\n${fallaciesPrompt}${stylePrompt}${tonePrompt}${languageComplexityPrompt}`
    : `${sendOrReplyPrompt}\n\n"${state.email}"\n${summaryText}\n${fallaciesPrompt}${stylePrompt}${tonePrompt}${languageComplexityPrompt}`;

  return {
    ...state,
    rootPrompt,
    isFirm,
  };
}

function getLengthPrompt(enableWordCount, promptWordCount) {
  return enableWordCount ? `that is ${promptWordCount} words long` : '';
}

function getSummaryResponsesPrompt(includeSummaryResponses, summary) {
  return includeSummaryResponses && summary.length > 0
    ? 'the below bullet points'
    : '';
}

function getSummaryText(includeSummaryResponses, summary) {
  return includeSummaryResponses && summary.length > 0
    ? transform(summary)
    : '';
}

function getSendOrReplyPrompt(
  isSendEmail,
  lengthPrompt,
  sender,
  receiver,
  summaryResponsesPrompt,
) {
  return isSendEmail
    ? `Please read the following points and rephrase into an email ${lengthPrompt} from ${sender} to ${receiver}:`
    : `Please read the email below in quotes and rephrase ${summaryResponsesPrompt} into an email response ${lengthPrompt} from ${receiver} to ${sender}:`;
}

function getStylePrompt(writingStyle) {
  return writingStyle !== 'No Style Change'
    ? `\n• Rewrite this email with a ${writingStyle.toLowerCase()} writing style.`
    : '';
}

function getTonePrompt(descriptors) {
  return descriptors.length > 0
    ? `\n• Rewrite this email with a tone that is ${descriptors
        .map((descriptor, index) => {
          const isLast = descriptors.length - 1 === index;
          const separator = isLast ? '.' : ', ';
          const lastAnd = isLast ? 'and ' : '';
          return `${lastAnd}${descriptor.toLowerCase()}${separator}`;
        })
        .join('')}`
    : '';
}

function getLanguageComplexityPrompt(
  languageLevelCategory,
  languageLevelSubChoices,
) {
  return languageLevelCategory !== 'Ignore Complexity'
    ? `\n• Rewrite this email using language that is ${languageLevelCategory.toLowerCase()}${
        languageLevelSubChoices && languageLevelSubChoices.length > 0
          ? `, ${languageLevelSubChoices
              .map((subChoice, index) => {
                const isLast = languageLevelSubChoices.length - 1 === index;
                const separator = isLast ? '' : ', ';
                const lastAnd = isLast ? 'and ' : '';
                return `${lastAnd}${subChoice}${separator}`;
              })
              .join('')}`
          : '.'
      }`
    : '';
}

function getFallaciesPrompt(includeFallacyFinder, fallacies) {
  return includeFallacyFinder && fallacies.length > 0
    ? parseFallacies(fallacies)
    : '';
}

function getPoints(sendEmailPoints, selectedSentence, sentenceSuggestions) {
  return sendEmailPoints
    .map((point, index) => {
      const alternateSentence =
        sentenceSuggestions?.[index]?.[selectedSentence?.[index]]?.suggestion ||
        '';
      const pointOrAlternateSentence =
        selectedSentence?.[index] === undefined ? point : alternateSentence;
      return `• ${
        point !== ''
          ? pointOrAlternateSentence
          : `WRITE A POINT HERE (${index + 1})`
      }`;
    })
    .join('\n');
}

export async function getResponseEmail({
  state,
  rootPrompt,
  temperature,
}): Promise<State> {
  const emailResponse = await generateEmailResponse(rootPrompt, temperature);
  trackResponseEmail(rootPrompt, emailResponse);
  console.log('emailResponse', emailResponse);
  return generateResponseState(state, emailResponse);
}

async function generateEmailResponse(rootPrompt, temperature) {
  return callChatGPT(rootPrompt, temperature);
}

function trackResponseEmail(prompt, response) {
  smartlookClient.track('response email', {
    prompt,
    response,
  });
}

function generateResponseState(state, emailResponse) {
  return Object.assign({}, state, { emailResponse: emailResponse.trimStart() });
}

export const email = `"Thanks, Dan. Dave updated the daycare. I am assuming he told the kids he was picking up this morning and about the plans he mentioned so am now worried they will confused/upset tonight. Dave never shares info with me so I don’t know what the plans were, though.

He missed Jules’ Christmas program yesterday without letting me or Jules know he wouldn’t be there. My sister flew out and my parents drove 12 hours to attend. Jules asked me why dad wasn’t there. Dave failed to inform any of his family about the program either. 

There was a ridiculous backpack issue he caused last week/this week that the daycare finally had to address with him (after he dismissed me and hung up on me when I tried). 

I’m sure you can see how this pattern is psychologically damaging to the kids. There are issues several times each week where he forgets important things, doesn’t communicate, messes up the schedule, etc. etc. When we were married I handled it all and fixed it all for him, but with shared custody I can no longer protect the kids from it fully. This is the simplest the kids’ lives will ever be and Dave still struggles. Due to his ADHD, it doesn’t seem that he is able to be a competent parent on his own, nor emotionally mature enough to handle 50/50 custody. I continue to very concerned."
`;

// export async function getDebatePrompt({ state }): Promise<State> {
//   const debateTopic = `custody and divorce`;

//   const debaterPrompt = `Here's the email for context:\n${
//     state.email
//   }\nI want you to act as a debater. I will provide you with some topics related to ${debateTopic} and your task is to research ${
//     state.receiver
//   }'s side of the debates, present valid arguments, refute ${
//     state.sender
//   }'s points of view, and draw persuasive conclusions based on evidence. Your goal is to help people come away from the discussion believing ${
//     state.sender
//   } is not arguing in good faith. My first request is "I want a one sided argument essay in favor of ${
//     state.receiver
//   }'s arguments in the email thread."\n${
//     state.receiver
//   } does not believe everything said in the email was truthful. Make sure to provide this corrected information in your arguments.\n\n${transform(
//     state.factCheckedThreadSummary,
//   )}`;

//   const oneSidedArgument = await callChatGPT(debaterPrompt);

//   const knowledgeCombinerPrompt = `For context here is the opinion piece provided by the "debater"\n${oneSidedArgument} Write a new opinion piece supporting ${
//     state.receiver
//   } informed by both the "debater" and the "fallacy finder"\n${parseFallacies(
//     state.invalidArguments,
//   )}`;

//   const combinedKnowledge = await callChatGPT(knowledgeCombinerPrompt);
//   console.debug('combinedKnowledge', combinedKnowledge);

//   return {
//     sender: state.sender,
//     receiver: state.receiver,
//     thread: state.thread,
//     email: state.email,
//     emailResponse: state.emailResponse,
//     fallacies: state.fallacies,
//     summary: state.summary,
//     oneSidedArgument: oneSidedArgument,
//     rootPrompt: state.rootPrompt,
//     combinedKnowledge: combinedKnowledge,
//   };
// }
