import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { callChatGPT, fixJSONError, wordCount } from './App.logic';

import { v4 as uuidv4 } from 'uuid';
import {
  getDebatePrompt,
  getResponseEmail,
  getRootPrompt,
} from './App.prompts';
import {
  FactCheckedThreadSummary,
  HandleLoadingProps,
  State,
  SummaryAction,
} from './App.types';

export async function getExpertFeedback({
  state,
  updateState,
}): Promise<State> {
  const emailOrThread = state.thread === '' ? state.email : state.thread;

  const fallacyFinderPrompt = `Here is the email or email thread for context:${emailOrThread}"\nI want you to act as a fallacy finder. You will be on the lookout for invalid arguments so you can call out any logical errors or inconsistencies that may be present in statements and discourse in this email. Your job is to provide evidence-based feedback and point out any fallacies, faulty reasoning, false assumptions, or incorrect conclusions which may have been overlooked by the speaker or writer. \nFormat as a stringified JSON array of objects. Add a key called explanation that explains what the fallacy means, a fallacy key that labels the fallacy, and an evidence key that provides the sentence being labeled.`;

  const threadSummaryPrompt = `${state.email}\nCreate a summary of ${state.sender}'s arguments in this email provided for context.\n Format as a string with each summary bullet separated by a semi-colon.`;
  const invalidArguments_ = await callChatGPT(fallacyFinderPrompt);
  const invalidArguments = fixJSONError(invalidArguments_.trimStart())?.map(
    (argument) => ({
      ...argument,
      key: uuidv4(),
    }),
  );
  // updateState({
  //   sender: state.sender,
  //   receiver: state.receiver,
  //   thread: state.thread,
  //   email: state.email,
  //   emailResponse: '',
  //   invalidArguments,
  //   factCheckedThreadSummary: state.FactCheckedThreadSummary,
  //   oneSidedArgument: '',
  //   rootPrompt: '',
  //   combinedKnowledge: '',
  // });
  const factCheckedThreadSummary_ = await callChatGPT(threadSummaryPrompt);
  console.log('factCheckedThreadSummary_ ', factCheckedThreadSummary_);
  console.log(
    'factCheckedThreadSummary_ ',
    factCheckedThreadSummary_.split('; '),
  );

  const factCheckedThreadSummary = factCheckedThreadSummary_
    .split('; ')
    .map((summaryPoint) => ({
      action: 'ignore',
      explain: '',
      argument: summaryPoint.trimStart(),
      key: uuidv4(),
    }));

  console.log('factCheckedThreadSummary!!!', factCheckedThreadSummary);
  return {
    sender: state.sender,
    receiver: state.receiver,
    thread: state.thread,
    email: state.email,
    emailResponse: '',
    invalidArguments,
    factCheckedThreadSummary,
    oneSidedArgument: '',
    rootPrompt: '',
    combinedKnowledge: '',
  };
}

interface LoadingState {
  expertFeedback: boolean;
  debatePrompt: boolean;
  rootPrompt: boolean;
  emailResponse: boolean;
}

export const email = `"Thanks, Dan. Dave updated the daycare. I am assuming he told the kids he was picking up this morning and about the plans he mentioned so am now worried they will confused/upset tonight. Dave never shares info with me so I don’t know what the plans were, though.

He missed Jules’ Christmas program yesterday without letting me or Jules know he wouldn’t be there. My sister flew out and my parents drove 12 hours to attend. Jules asked me why dad wasn’t there. Dave failed to inform any of his family about the program either. 

There was a ridiculous backpack issue he caused last week/this week that the daycare finally had to address with him (after he dismissed me and hung up on me when I tried). 

I’m sure you can see how this pattern is psychologically damaging to the kids. There are issues several times each week where he forgets important things, doesn’t communicate, messes up the schedule, etc. etc. When we were married I handled it all and fixed it all for him, but with shared custody I can no longer protect the kids from it fully. This is the simplest the kids’ lives will ever be and Dave still struggles. Due to his ADHD, it doesn’t seem that he is able to be a competent parent on his own, nor emotionally mature enough to handle 50/50 custody. I continue to very concerned."
`;

function useApp() {
  const [state, updateState] = useState<State>({
    sender: '',
    receiver: '',
    thread: '',
    email: '',
    emailResponse: '',
    invalidArguments: [],
    factCheckedThreadSummary: [],
    oneSidedArgument: '',
    rootPrompt: '',
    combinedKnowledge: '',
  });
  const [summary, updateSummary] = useState<FactCheckedThreadSummary[]>([
    { argument: '', action: 'ignore', explain: '' },
  ]);

  const [includeFallacyFinder, setIncludeFallacyFinder] = useState(true);
  const [promptWordCount, setPromptWordCount] = useState<number>(300);
  const [enableWordCount, setEnableWordCount] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [rootPrompt, setRootPrompt] = useState<string>('');

  const handleFallacyFinderChange = (event) => {
    setIncludeFallacyFinder(event.target.checked);
  };
  const handleToggleWordCount = () => {
    setEnableWordCount(!enableWordCount);
  };

  const [includeSummaryResponses, setIncludeSummaryResponses] = useState(true);

  const handleSummaryResponsesChange = (event) => {
    setIncludeSummaryResponses(event.target.checked);
  };

  const [loading, updateLoading] = useState<LoadingState>({
    expertFeedback: false,
    debatePrompt: false,
    rootPrompt: false,
    emailResponse: false,
  });

  const handleChangeWordCount = (count: number) => {
    setPromptWordCount(count);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(state.emailResponse);
  };

  const updateSummaryRecord = (
    index: number,
    type: 'action' | 'explain',
    newAction: SummaryAction,
    explainText = '',
  ) => {
    console.debug('explainText', explainText);
    const newFactCheckedSummary = summary.map((record, i) => {
      if (type === 'action') {
        if (i === index) {
          return {
            ...record,
            action: newAction,
            explain: '',
          };
        }
      }
      if (type === 'explain') {
        if (i === index) {
          return {
            ...record,
            explain: explainText,
          };
        }
      }
      return record;
    });
    updateSummary(newFactCheckedSummary);
    updateState({ ...state, factCheckedThreadSummary: newFactCheckedSummary });
  };

  const generateExpertFeedback = async () => {
    setError('');
    try {
      handleLoading({ type: 'expertFeedback', value: true });
      const {
        emailResponse,
        invalidArguments,
        factCheckedThreadSummary,
        oneSidedArgument,
        rootPrompt,
        combinedKnowledge,
        email,
        sender,
        receiver,
        thread,
      } = await getExpertFeedback({ state, updateState });
      console.info('factCheckedThreadSummary5', factCheckedThreadSummary);
      updateState({
        sender,
        receiver,
        thread,
        email,
        emailResponse,
        invalidArguments,
        factCheckedThreadSummary,
        oneSidedArgument,
        rootPrompt,
        combinedKnowledge,
      });
      updateSummary(factCheckedThreadSummary);
      generateRootPrompt();
      handleLoading({ type: 'expertFeedback', value: false });
    } catch (error) {
      console.debug('generate expert feedback error', error);
      setError(`TRY AGAIN!\nAI Data Formatting Error:\n${error.message}`);
      handleLoading({ type: 'expertFeedback', value: false });
    }
  };

  const handleLoading = useCallback(
    ({ type, value }: HandleLoadingProps) => {
      switch (type) {
        case 'expertFeedback':
          return updateLoading({ ...loading, expertFeedback: value });
        case 'debatePrompt':
          return updateLoading({ ...loading, debatePrompt: value });
        case 'rootPrompt':
          return updateLoading({ ...loading, rootPrompt: value });
        case 'emailResponse':
          return updateLoading({ ...loading, emailResponse: value });
      }
    },
    [loading],
  );

  const generateRootPrompt = useCallback(async () => {
    handleLoading({ type: 'rootPrompt', value: true });
    const data = await getRootPrompt({
      state,
      summary,
      includeFallacyFinder,
      includeSummaryResponses,
      enableWordCount,
      promptWordCount,
    });
    setRootPrompt(data.rootPrompt);
    handleLoading({ type: 'rootPrompt', value: false });
  }, [
    enableWordCount,
    handleLoading,
    includeFallacyFinder,
    includeSummaryResponses,
    promptWordCount,
    state,
    summary,
  ]);

  useEffect(() => {
    generateRootPrompt();
    return () => {};
  }, [
    includeFallacyFinder,
    includeSummaryResponses,
    promptWordCount,
    enableWordCount,
    state.factCheckedThreadSummary,
  ]);

  const generateDebatePrompt = async () => {
    handleLoading({ type: 'debatePrompt', value: true });
    const data = await getDebatePrompt({ state });
    updateState(data);
    handleLoading({ type: 'debatePrompt', value: false });
  };

  const generateEmailResponse = async () => {
    handleLoading({ type: 'emailResponse', value: true });
    const data = await getResponseEmail({ state, rootPrompt });
    updateState(data);
    handleLoading({ type: 'emailResponse', value: false });
  };

  return {
    generateDebatePrompt,
    generateEmailResponse,
    generateExpertFeedback,
    generateRootPrompt,
    handleFallacyFinderChange,
    handleSummaryResponsesChange,
    includeFallacyFinder,
    includeSummaryResponses,
    loading,
    state,
    updateState,
    updateSummaryRecord,
    handleCopy,
    handleChangeWordCount,
    promptWordCount,
    handleToggleWordCount,
    enableWordCount,
    summary,
    error,
    setRootPrompt,
    rootPrompt,
  };
}

export default useApp;
