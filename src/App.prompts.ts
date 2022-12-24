import './App.css';

import { callChatGPT, parseFallacies, transform } from './App.logic';
import { State } from './App.types';

export async function getRootPrompt({
  state,
  includeFallacyFinder,
  includeSummaryResponses,
  enableWordCount,
  promptWordCount,
}): Promise<State> {
  const context = `Here is an email from ${state.sender} to respond to for context:\n\n${state.email}`;

  const instruction = `Write a response email as ${state.receiver} to ${
    state.sender
  }.\n• Make sure the email response is ${
    enableWordCount === true ? promptWordCount + ' words long' : 'brief'
  }.\n• The tone is purely informative.\n• The language communicating the ideas is firm.\n• The overall tone of the response is friendly.\n\n${
    includeSummaryResponses ? transform(state.factCheckedThreadSummary) : ''
  }\n${includeFallacyFinder ? parseFallacies(state.invalidArguments) : ''}`;

  const rootPrompt = `${context}\n\n${instruction}`;

  console.debug('root prompt', rootPrompt);

  return {
    sender: state.sender,
    receiver: state.receiver,
    thread: state.thread,
    email: state.email,
    emailResponse: state.emailResponse,
    invalidArguments: state.invalidArguments,
    factCheckedThreadSummary: state.factCheckedThreadSummary,
    oneSidedArgument: state.oneSidedArgument,
    rootPrompt: rootPrompt,
    combinedKnowledge: state.combinedKnowledge,
  };
}

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
  console.debug('debater prompt', debaterPrompt);
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
    invalidArguments: state.invalidArguments,
    factCheckedThreadSummary: state.factCheckedThreadSummary,
    oneSidedArgument: oneSidedArgument,
    rootPrompt: state.rootPrompt,
    combinedKnowledge: combinedKnowledge,
  };
}

export async function getResponseEmail({ state }): Promise<State> {
  const emailResponse = await callChatGPT(state.rootPrompt);
  console.debug('emailResponse', emailResponse);
  return {
    sender: state.sender,
    receiver: state.receiver,
    thread: state.thread,
    email: state.email,
    emailResponse: emailResponse,
    invalidArguments: state.invalidArguments,
    factCheckedThreadSummary: state.factCheckedThreadSummary,
    oneSidedArgument: state.oneSidedArgument,
    rootPrompt: state.rootPrompt,
    combinedKnowledge: state.combinedKnowledge,
  };
}
