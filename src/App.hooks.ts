import { useState } from 'react';
import './App.css';
import { callChatGPT } from './App.logic';

import { v4 as uuidv4 } from 'uuid';
import {
  fallacyFinderPrompt,
  getDebatePrompt,
  getResponseEmail,
  getRootPrompt,
  threadSummaryPrompt,
} from './App.prompts';
import { HandleLoadingProps, State, SummaryAction } from './App.types';

export async function getExpertFeedback(): Promise<State> {
  const invalidArguments_ = await callChatGPT(fallacyFinderPrompt);
  const invalidArguments = JSON.parse(invalidArguments_.trimStart())?.map(
    (argument) => ({
      ...argument,
      key: uuidv4(),
    }),
  );
  const factCheckedThreadSummary_ = await callChatGPT(threadSummaryPrompt);
  const factCheckedThreadSummary = JSON.parse(factCheckedThreadSummary_)?.map(
    (summaryPoint) => ({
      ...summaryPoint,
      key: uuidv4(),
    }),
  );
  return {
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

function useApp() {
  const [state, updateState] = useState<State>({
    emailResponse: '',
    invalidArguments: [],
    factCheckedThreadSummary: [],
    oneSidedArgument: '',
    rootPrompt: '',
    combinedKnowledge: '',
  });

  const [includeFallacyFinder, setIncludeFallacyFinder] = useState(true);

  const handleFallacyFinderChange = (event) => {
    setIncludeFallacyFinder(event.target.checked);
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

  const updateSummaryRecord = (
    index: number,
    type: 'action' | 'rebuttal',
    newAction: SummaryAction,
    rebuttalText = '',
  ) => {
    const newFactCheckedSummary = state.factCheckedThreadSummary.map(
      (record, i) => {
        if (type === 'action') {
          if (i === index) {
            return {
              ...record,
              action: newAction,
              rebuttal: '',
            };
          }
        }
        if (type === 'rebuttal') {
          if (i === index) {
            return {
              ...record,
              rebuttal: rebuttalText,
            };
          }
        }
        return record;
      },
    );
    updateState({ ...state, factCheckedThreadSummary: newFactCheckedSummary });
  };

  const generateExpertFeedback = async () => {
    try {
      handleLoading({ type: 'expertFeedback', value: true });
      const {
        emailResponse,
        invalidArguments,
        factCheckedThreadSummary,
        oneSidedArgument,
        rootPrompt,
        combinedKnowledge,
      } = await getExpertFeedback();
      updateState({
        emailResponse,
        invalidArguments,
        factCheckedThreadSummary,
        oneSidedArgument,
        rootPrompt,
        combinedKnowledge,
      });
      handleLoading({ type: 'expertFeedback', value: false });
    } catch (error) {
      console.debug('generate expert feedback error', error);
      handleLoading({ type: 'expertFeedback', value: false });
    }
  };

  const handleLoading = ({ type, value }: HandleLoadingProps) => {
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
  };

  const generateRootPrompt = async () => {
    handleLoading({ type: 'rootPrompt', value: true });
    const data = await getRootPrompt({
      state,
      includeFallacyFinder,
      includeSummaryResponses,
    });
    updateState(data);
    handleLoading({ type: 'rootPrompt', value: false });
  };

  const generateDebatePrompt = async () => {
    handleLoading({ type: 'debatePrompt', value: true });
    const data = await getDebatePrompt({ state });
    updateState(data);
    handleLoading({ type: 'debatePrompt', value: false });
  };

  const generateEmailResponse = async () => {
    handleLoading({ type: 'emailResponse', value: true });
    const data = await getResponseEmail({ state });
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
  };
}

export default useApp;
