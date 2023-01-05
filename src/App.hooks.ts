import { useCallback, useEffect, useState } from 'react';

import {
  getDebatePrompt,
  getFallacies,
  getResponseEmail,
  getRootPrompt,
  getSummary,
} from './App.prompts';
import {
  Summary,
  HandleLoadingProps,
  State,
  SummaryAction,
  Fallacy,
  LoadingState,
} from './App.types';
import smartlookClient from 'smartlook-client';

function useApp() {
  useEffect(() => {
    smartlookClient.init('43bc84d9a8406exxxxxxxxxb5601f5bbf8d2ed');
    return () => {};
  }, []);

  const initialState: State = {
    sender: '',
    receiver: '',
    thread: '',
    email: '',
    emailResponse: '',
    fallacies: [],
    summary: [],
    oneSidedArgument: '',
    rootPrompt: '',
    combinedKnowledge: '',
  };
  const [state, updateState] = useState<State>(initialState);

  const [fallacies, updateFallacies] = useState<Fallacy[]>([]);

  const [summary, updateSummary] = useState<Summary[]>([]);

  const [isSendEmail, updateIsSendEmail] = useState<boolean>(true);

  const handleUpdateIsSendEmail = () => {
    updateIsSendEmail(!isSendEmail);
    updateState(initialState);
    updateSummary([]);
    updateFallacies([]);
    updateSendEmailPoints(['']);
  };

  const [sendEmailPoints, updateSendEmailPoints] = useState<string[]>(['']);

  const handleUpdateSendEmailPoints = ({ newPoint, index }) => {
    const newSendEmailPoints = sendEmailPoints.map((record: '', i) => {
      if (i === index) {
        return newPoint;
      } else {
        return record;
      }
    });
    updateSendEmailPoints(newSendEmailPoints);
  };

  const handleAddNewSendEmailPoint = ({
    index,
    sendEmailPoints: sendEmailPoints_,
  }) => {
    sendEmailPoints_.splice(index + 1, 0, '');
    updateSendEmailPoints([...sendEmailPoints_]);
  };

  const handleRemoveSendEmailPoint = ({
    index,
    sendEmailPoints: sendEmailPoints_,
  }) => {
    if (sendEmailPoints_.length !== 1) {
      sendEmailPoints_.splice(index, 1);
      updateSendEmailPoints([...sendEmailPoints_]);
    } else {
      updateSendEmailPoints(['']);
    }
  };

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
    fallacies: false,
    summary: false,
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
    const newSummary = summary.map((record, i) => {
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
    updateSummary(newSummary);
    updateState({ ...state, summary: newSummary });
  };

  const generateFallacies = async () => {
    setError('');
    try {
      handleLoading({ type: 'fallacies', value: true });
      const {
        emailResponse,
        fallacies,
        summary,
        oneSidedArgument,
        rootPrompt,
        combinedKnowledge,
        email,
        sender,
        receiver,
        thread,
      } = await getFallacies({ state, isSendEmail });
      updateState({
        sender,
        receiver,
        thread,
        email,
        emailResponse,
        fallacies,
        summary,
        oneSidedArgument,
        rootPrompt,
        combinedKnowledge,
      });
      updateFallacies(fallacies);
      generateRootPrompt();
      handleLoading({ type: 'fallacies', value: false });
    } catch (error) {
      console.debug('generate expert feedback error', error);
      setError(`${error.message}`);
      handleLoading({ type: 'fallacies', value: false });
    }
  };

  const generateSummary = async () => {
    setError('');
    try {
      handleLoading({ type: 'summary', value: true });
      const {
        emailResponse,
        fallacies,
        summary,
        oneSidedArgument,
        rootPrompt,
        combinedKnowledge,
        email,
        sender,
        receiver,
        thread,
      } = await getSummary({ state });
      updateState({
        sender,
        receiver,
        thread,
        email,
        emailResponse,
        fallacies,
        summary,
        oneSidedArgument,
        rootPrompt,
        combinedKnowledge,
      });
      updateSummary(summary);
      generateRootPrompt();
      handleLoading({ type: 'summary', value: false });
    } catch (error) {
      console.debug('generate expert feedback error', error);
      setError(`${error.message}`);
      handleLoading({ type: 'summary', value: false });
    }
  };

  const handleLoading = useCallback(
    ({ type, value }: HandleLoadingProps) => {
      switch (type) {
        case 'fallacies':
          return updateLoading({ ...loading, fallacies: value });
        case 'summary':
          return updateLoading({ ...loading, summary: value });
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
    if ((!isSendEmail && state.email !== '') || isSendEmail) {
      handleLoading({ type: 'rootPrompt', value: true });
      const data = await getRootPrompt({
        state,
        summary,
        fallacies,
        includeFallacyFinder,
        includeSummaryResponses,
        enableWordCount,
        promptWordCount,
        isSendEmail,
        sendEmailPoints,
      });
      setRootPrompt(data.rootPrompt);
      handleLoading({ type: 'rootPrompt', value: false });
    }
  }, [
    sendEmailPoints,
    isSendEmail,
    enableWordCount,
    fallacies,
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
    state.summary,
    state.sender,
    state.receiver,
    state.email,
    isSendEmail,
    sendEmailPoints,
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
    enableWordCount,
    error,
    fallacies,
    generateDebatePrompt,
    generateEmailResponse,
    generateFallacies,
    generateRootPrompt,
    generateSummary,
    handleChangeWordCount,
    handleCopy,
    handleFallacyFinderChange,
    handleSummaryResponsesChange,
    handleToggleWordCount,
    handleUpdateIsSendEmail,
    handleAddNewSendEmailPoint,
    handleRemoveSendEmailPoint,
    includeFallacyFinder,
    includeSummaryResponses,
    isSendEmail,
    loading,
    promptWordCount,
    rootPrompt,
    setRootPrompt,
    state,
    sendEmailPoints,
    handleUpdateSendEmailPoints,
    summary,
    updateState,
    updateSummaryRecord,
  };
}

export default useApp;
