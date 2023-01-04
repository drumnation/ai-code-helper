import { callChatGPT, parseFallacies, transform } from './App.logic';
import { State } from './App.types';
import { fixJSONError } from './App.logic';

import { v4 as uuidv4 } from 'uuid';

export async function getFallacies({ state, isSendEmail }): Promise<State> {
  const newOrReplyEmail = isSendEmail ? state.emailResponse : state.email;

  const fallacyFinderPrompt = `Here is the email for context:${newOrReplyEmail}"\nI want you to act as a fallacy finder. You will be on the lookout for invalid arguments so you can call out any logical errors or inconsistencies that may be present in statements and discourse in this email. Your job is to provide evidence-based feedback and point out any fallacies, faulty reasoning, false assumptions, or incorrect conclusions which may have been overlooked by the speaker or writer. \nFormat as an array of objects. Add a key called explanation that explains what the fallacy means, a fallacy key that labels the fallacy, and an evidence key that provides the sentence being labeled.\n\nConvert to  stringified JSON.`;
  const fallacies_ = await callChatGPT(fallacyFinderPrompt);
  const fallacies = fixJSONError(fallacies_.trimStart())?.map((argument) => ({
    ...argument,
    key: uuidv4(),
  }));

  return {
    sender: state.sender,
    receiver: state.receiver,
    thread: state.thread,
    email: state.email,
    emailResponse: state.emailResponse,
    fallacies,
    summary: state.summary,
    oneSidedArgument: '',
    rootPrompt: '',
    combinedKnowledge: '',
  };
}

export async function getSummary({ state }): Promise<State> {
  const summaryPrompt = `${state.email}\nCreate a summary of ${state.sender}'s arguments in this email provided for context.\n Format as a string with each summary bullet separated by a semi-colon.`;
  const summary_ = await callChatGPT(summaryPrompt);

  const summary = summary_.split('; ').map((summaryPoint) => ({
    action: 'ignore',
    explain: '',
    argument: summaryPoint.trimStart(),
    key: uuidv4(),
  }));

  return {
    sender: state.sender,
    receiver: state.receiver,
    thread: state.thread,
    email: state.email,
    emailResponse: state.emailResponse,
    fallacies: state.fallacies,
    summary,
    oneSidedArgument: '',
    rootPrompt: '',
    combinedKnowledge: '',
  };
}

export async function getRootPrompt({
  state,
  summary,
  fallacies,
  includeFallacyFinder,
  includeSummaryResponses,
  enableWordCount,
  promptWordCount,
  isSendEmail,
  sendEmailPoints,
}): Promise<State> {
  const sender = state.sender !== '' ? state.sender : 'SENDER';
  const receiver = state.receiver !== '' ? state.receiver : 'RECEIVER';
  const context = `Here is an email from ${state.sender} to respond to for context:\n\n"${state.email}"\n`;

  const biff = `• Make sure the email response is ${
    enableWordCount === true ? promptWordCount + ' words long' : 'brief'
  }.\n• The tone is purely informative.\n• The language communicating the ideas is firm.\n• The overall tone of the response is friendly.`;

  const sendOrReplyPrompt1 = isSendEmail
    ? `Write an email from ${sender} to ${receiver}.`
    : `Write a response email as ${receiver} to ${sender}.`;

  const sendOrReplyPrompt2 = isSendEmail
    ? `The email should make the following points:\n\n${sendEmailPoints
        .map(
          (point, index) =>
            `• ${point !== '' ? point : `WRITE A POINT HERE (${index + 1})`}\n`,
        )
        .join('')
        .trimEnd()}\n\n${biff}`
    : `${context}\n${biff}\n\n${
        includeSummaryResponses && summary.length > 0 ? transform(summary) : ''
      }\n${
        includeFallacyFinder && fallacies.length > 0
          ? parseFallacies(fallacies)
          : ''
      }`;

  const rootPrompt = `${sendOrReplyPrompt1}\n\n${sendOrReplyPrompt2}`.trimEnd();

  return {
    sender: state.sender,
    receiver: state.receiver,
    thread: state.thread,
    email: state.email,
    emailResponse: state.emailResponse,
    fallacies,
    summary: state.summary,
    oneSidedArgument: state.oneSidedArgument,
    rootPrompt: rootPrompt,
    combinedKnowledge: state.combinedKnowledge,
  };
}

export async function getResponseEmail({ state, rootPrompt }): Promise<State> {
  const emailResponse = await callChatGPT(rootPrompt);
  console.debug('emailResponse', emailResponse);
  return {
    sender: state.sender,
    receiver: state.receiver,
    thread: state.thread,
    email: state.email,
    emailResponse: emailResponse.trimStart(),
    fallacies: state.fallacies,
    summary: state.summary,
    oneSidedArgument: state.oneSidedArgument,
    rootPrompt,
    combinedKnowledge: state.combinedKnowledge,
  };
}

export const email = `"Thanks, Dan. Dave updated the daycare. I am assuming he told the kids he was picking up this morning and about the plans he mentioned so am now worried they will confused/upset tonight. Dave never shares info with me so I don’t know what the plans were, though.

He missed Jules’ Christmas program yesterday without letting me or Jules know he wouldn’t be there. My sister flew out and my parents drove 12 hours to attend. Jules asked me why dad wasn’t there. Dave failed to inform any of his family about the program either. 

There was a ridiculous backpack issue he caused last week/this week that the daycare finally had to address with him (after he dismissed me and hung up on me when I tried). 

I’m sure you can see how this pattern is psychologically damaging to the kids. There are issues several times each week where he forgets important things, doesn’t communicate, messes up the schedule, etc. etc. When we were married I handled it all and fixed it all for him, but with shared custody I can no longer protect the kids from it fully. This is the simplest the kids’ lives will ever be and Dave still struggles. Due to his ADHD, it doesn’t seem that he is able to be a competent parent on his own, nor emotionally mature enough to handle 50/50 custody. I continue to very concerned."
`;

export async function getDebatePrompt({ state }): Promise<State> {
  const debateTopic = `custody and divorce`;

  const debaterPrompt = `Here's the email for context:\n${
    state.email
  }\nI want you to act as a debater. I will provide you with some topics related to ${debateTopic} and your task is to research ${
    state.receiver
  }'s side of the debates, present valid arguments, refute ${
    state.sender
  }'s points of view, and draw persuasive conclusions based on evidence. Your goal is to help people come away from the discussion believing ${
    state.sender
  } is not arguing in good faith. My first request is "I want a one sided argument essay in favor of ${
    state.receiver
  }'s arguments in the email thread."\n${
    state.receiver
  } does not believe everything said in the email was truthful. Make sure to provide this corrected information in your arguments.\n\n${transform(
    state.factCheckedThreadSummary,
  )}`;

  const oneSidedArgument = await callChatGPT(debaterPrompt);

  const knowledgeCombinerPrompt = `For context here is the opinion piece provided by the "debater"\n${oneSidedArgument} Write a new opinion piece supporting ${
    state.receiver
  } informed by both the "debater" and the "fallacy finder"\n${parseFallacies(
    state.invalidArguments,
  )}`;

  const combinedKnowledge = await callChatGPT(knowledgeCombinerPrompt);
  console.debug('combinedKnowledge', combinedKnowledge);

  return {
    sender: state.sender,
    receiver: state.receiver,
    thread: state.thread,
    email: state.email,
    emailResponse: state.emailResponse,
    fallacies: state.fallacies,
    summary: state.summary,
    oneSidedArgument: oneSidedArgument,
    rootPrompt: state.rootPrompt,
    combinedKnowledge: combinedKnowledge,
  };
}
