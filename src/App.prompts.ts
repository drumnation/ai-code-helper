import './App.css';

import { callChatGPT, parseFallacies, transform } from './App.logic';

export const email = `"Thanks, Dan. Dave updated the daycare. I am assuming he told the kids he was picking up this morning and about the plans he mentioned so am now worried they will confused/upset tonight. Dave never shares info with me so I don’t know what the plans were, though.

He missed Jules’ Christmas program yesterday without letting me or Jules know he wouldn’t be there. My sister flew out and my parents drove 12 hours to attend. Jules asked me why dad wasn’t there. Dave failed to inform any of his family about the program either. 

There was a ridiculous backpack issue he caused last week/this week that the daycare finally had to address with him (after he dismissed me and hung up on me when I tried). 

I’m sure you can see how this pattern is psychologically damaging to the kids. There are issues several times each week where he forgets important things, doesn’t communicate, messes up the schedule, etc. etc. When we were married I handled it all and fixed it all for him, but with shared custody I can no longer protect the kids from it fully. This is the simplest the kids’ lives will ever be and Dave still struggles. Due to his ADHD, it doesn’t seem that he is able to be a competent parent on his own, nor emotionally mature enough to handle 50/50 custody. I continue to very concerned."
`;
// const email = `"Hi Heather and David,

// I know we rushed the preschool conversation a bit so wanted to quickly follow up on this topic. I appreciate what Heather said about Jules' developmental needs, have considered this perspective and would be willing to move him to a FT preschool sooner than May. I request that we both tour Trinity, as well, and discuss this option, too, as I requested back in July when I first messaged Dave about this. I also want to add that I suggested the option of starting Jules at one of these FT preschools while Zoey remained at daycare back in the summer, as well, but Dave said no because it would be too inconvenient for him to drop off and pick up at 2 different places.

// I want to reiterate that it is untrue that I'm never willing to compromise as Dave alleges - but I will always fight hard for what I feel is best for them and am always very open and honest about my reasons. That's what a good mother does. I believe a good parent is also willing to take in new information and different perspectives on their children's needs and reconsider their position. I will always strive to do this, and to put my own needs second to theirs.

// Honestly, I wouldn't even consider it a compromise, though, because if starting FT preschool sooner ends up being what is best for Jules, then it being more convenient for Dave is simply an adult "bonus."

// Thanks,
// Nicole"
// `;

const sender = 'Nicole';
const receiver = 'Dave';
const thread = '';

const emailOrThread = thread === '' ? email : thread;

export const fallacyFinderPrompt = `Here is the email or email thread for context:${emailOrThread}"\nI want you to act as a fallacy finder. You will be on the lookout for invalid arguments so you can call out any logical errors or inconsistencies that may be present in statements and discourse in this email. Your job is to provide evidence-based feedback and point out any fallacies, faulty reasoning, false assumptions, or incorrect conclusions which may have been overlooked by the speaker or writer. \nFormat the arguments as a stringified JSON array of objects. Add a key called explanation that explains what the fallacy means, a fallacy key that labels the fallacy, and an evidence key that provides the sentence being labeled.`;

export const threadSummaryPrompt = `${email}\nCreate a summary of ${sender}'s points in this email thread provided for context.\nFormat the summary with bullet points and store in a valid stringified JSON array of objects.\nInside each object store the bulleted text in a key called argument, and add keys named action and rebuttal. The action key will either be agree, deny, rebuttal, or ignore. The default action key is "ignore". The default rebuttal key is empty string.`;

const debateTopic = `custody and divorce`;

export async function getRootPrompt({
  state,
  includeFallacyFinder,
  includeSummaryResponses,
}) {
  const context = `Here is an email from ${sender} to respond to for context:\n\n${email}`;

  const instruction = `Write a response email as ${receiver} to ${sender}.\n• Make sure the email response is brief.\n• The tone is purely informative.\n• The language communicating the ideas is firm.\n• The overall tone of the response is friendly.\n\n${
    includeSummaryResponses ? transform(state.factCheckedThreadSummary) : ''
  }\n\n${includeFallacyFinder ? parseFallacies(state.invalidArguments) : ''}`;

  const rootPrompt = `${context}\n\n${instruction}`;

  console.debug('root prompt', rootPrompt);

  return {
    emailResponse: state.emailResponse,
    invalidArguments: state.invalidArguments,
    factCheckedThreadSummary: state.factCheckedThreadSummary,
    oneSidedArgument: state.oneSidedArgument,
    rootPrompt: rootPrompt,
    combinedKnowledge: state.combinedKnowledge,
  };
}

export async function getDebatePrompt({ state }) {
  const debaterPrompt = `Here's the email for context:\n${email}\nI want you to act as a debater. I will provide you with some topics related to ${debateTopic} and your task is to research ${receiver}'s side of the debates, present valid arguments, refute ${sender}'s points of view, and draw persuasive conclusions based on evidence. Your goal is to help people come away from the discussion believing ${sender} is not arguing in good faith. My first request is "I want a one sided argument essay in favor of ${receiver}'s arguments in the email thread."\n${receiver} does not believe everything said in the email was truthful. Make sure to provide this corrected information in your arguments.\n\n${transform(
    state.factCheckedThreadSummary,
  )}`;
  console.debug('debater prompt', debaterPrompt);
  const oneSidedArgument = await callChatGPT(debaterPrompt);

  const knowledgeCombinerPrompt = `For context here is the opinion piece provided by the "debater"\n${oneSidedArgument} Write a new opinion piece supporting ${receiver} informed by both the "debater" and the "fallacy finder"\n${parseFallacies(
    state.invalidArguments,
  )}`;

  const combinedKnowledge = await callChatGPT(knowledgeCombinerPrompt);
  console.debug('combinedKnowledge', combinedKnowledge);

  return {
    emailResponse: state.emailResponse,
    invalidArguments: state.invalidArguments,
    factCheckedThreadSummary: state.factCheckedThreadSummary,
    oneSidedArgument: oneSidedArgument,
    rootPrompt: state.rootPrompt,
    combinedKnowledge: combinedKnowledge,
  };
}

export async function getResponseEmail({ state }) {
  const emailResponse = await callChatGPT(state.rootPrompt);
  console.debug('emailResponse', emailResponse);
  return {
    emailResponse: emailResponse,
    invalidArguments: state.invalidArguments,
    factCheckedThreadSummary: state.factCheckedThreadSummary,
    oneSidedArgument: state.oneSidedArgument,
    rootPrompt: state.rootPrompt,
    combinedKnowledge: state.combinedKnowledge,
  };
}
