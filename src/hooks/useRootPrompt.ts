import { useCallback, useEffect, useState } from 'react';
import { getRootPrompt } from '../App.prompts';

function useRootPrompt({
  descriptors,
  enableWordCount,
  fallacies,
  handleLoading,
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
}) {
  const [rootPrompt, setRootPrompt] = useState<string>('');

  const generateRootPrompt = useCallback(async () => {
    if ((!isSendEmail && state.email !== '') || isSendEmail) {
      handleLoading({ type: 'rootPrompt', value: true });
      const data = await getRootPrompt({
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
        interview,
      });
      setRootPrompt(data.rootPrompt);
      handleLoading({ type: 'rootPrompt', value: false });
    }
  }, [
    descriptors,
    enableWordCount,
    fallacies,
    handleLoading,
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
  ]);

  useEffect(() => {
    generateRootPrompt();
    return () => {};
  }, [
    descriptors,
    enableWordCount,
    includeFallacyFinder,
    includeSummaryResponses,
    interview,
    isFirm,
    isSendEmail,
    isSendEmail,
    languageLevelCategory,
    languageLevelSubChoices,
    promptWordCount,
    selectedSentence,
    sendEmailPoints,
    sentenceSuggestions,
    state.email,
    state.receiver,
    state.sender,
    state.summary,
    writingStyle,
  ]);

  return {
    generateRootPrompt,
    rootPrompt,
    setRootPrompt,
  };
}

export default useRootPrompt;
