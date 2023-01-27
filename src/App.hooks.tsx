import {
  useDraftEmailVersions,
  useFallacyFinder,
  useFinalEmail,
  useFineTuning,
  useInterviewer,
  useLoading,
  useLocalStorage,
  useReplyCompose,
  useRootPrompt,
  useSendEmailPoints,
  useSummarizer,
} from './hooks';

function useApp() {
  const {
    error,
    handleUpdateIsSendEmail,
    isSendEmail,
    setError,
    state,
    updateIsSendEmail,
    updateState,
  } = useReplyCompose();

  const { loading, handleLoading, updateLoading } = useLoading();

  const {
    descriptors,
    enableWordCount,
    handleChangeTemperature,
    handleChangeWordCount,
    handleDescriptorRephrase,
    handleLanguageLevelCategorySelect,
    handleLanguageLevelSubChoiceSelect,
    handleToggleFirm,
    handleToggleWordCount,
    handleWritingStyleRephrase,
    isFirm,
    languageLevelCategory,
    languageLevelSubChoices,
    promptWordCount,
    temperature,
    writingStyle,
  } = useFineTuning();

  const {
    handleAddNewSendEmailPoint,
    handleChangeReceiver,
    handleChangeReplyToEmail,
    handleChangeSender,
    handleClearReplyToEmail,
    handleClearSendEmailPoints,
    handleClickSentenceSuggestions,
    handleRemoveSendEmailPoint,
    handleSentenceSelect,
    handleUpdateSendEmailPoints,
    selectedSentence,
    sendEmailPoints,
    sentenceSuggestions,
    sentenceSuggestionsLoading,
    updateSendEmailPoints,
  } = useSendEmailPoints({
    state,
    temperature,
    updateState,
  });

  const {
    clearInterview,
    generateInterview,
    handleUpdateInterview,
    interview,
    updateInterview,
  } = useInterviewer({
    email: state.email,
    loading,
    receiver: state.receiver,
    sender: state.sender,
    updateLoading,
  });

  const {
    generateSummary,
    handleSummaryResponsesChange,
    includeSummaryResponses,
    summary,
    updateSummaryRecord,
  } = useSummarizer({
    handleLoading,
    setError,
    state,
    updateState,
  });

  const {
    fallacies,
    generateFallacies,
    handleFallacyFinderChange,
    includeFallacyFinder,
  } = useFallacyFinder({
    handleLoading,
    isSendEmail,
    setError,
    state,
    updateState,
  });

  const { draftEmailVersions, handleAddNewDraftEmail } = useDraftEmailVersions({
    descriptors,
    enableWordCount,
    isFirm,
    languageLevelCategory,
    languageLevelSubChoices,
    promptWordCount,
    state,
    writingStyle,
  });

  useLocalStorage({
    state,
    updateInterview,
    updateIsSendEmail,
    updateSendEmailPoints,
    updateState,
  });

  const { generateRootPrompt, rootPrompt, setRootPrompt } = useRootPrompt({
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
  });

  const { generateEmailError, generateEmailResponse, handleCopy } =
    useFinalEmail({
      handleLoading,
      rootPrompt,
      state,
      temperature,
      updateState,
    });

  return {
    clearInterview,
    descriptors,
    draftEmailVersions,
    enableWordCount,
    error,
    fallacies,
    generateEmailError,
    generateEmailResponse,
    generateFallacies,
    generateInterview,
    generateRootPrompt,
    generateSummary,
    handleAddNewDraftEmail,
    handleAddNewSendEmailPoint,
    handleChangeReceiver,
    handleChangeReplyToEmail,
    handleChangeSender,
    handleChangeTemperature,
    handleChangeWordCount,
    handleClearReplyToEmail,
    handleClearSendEmailPoints,
    handleClickSentenceSuggestions,
    handleCopy,
    handleDescriptorRephrase,
    handleFallacyFinderChange,
    handleLanguageLevelCategorySelect,
    handleLanguageLevelSubChoiceSelect,
    handleRemoveSendEmailPoint,
    handleSentenceSelect,
    handleSummaryResponsesChange,
    handleToggleFirm,
    handleToggleWordCount,
    handleUpdateInterview,
    handleUpdateIsSendEmail,
    handleUpdateSendEmailPoints,
    handleWritingStyleRephrase,
    includeFallacyFinder,
    includeSummaryResponses,
    interview,
    isFirm,
    isSendEmail,
    languageLevelCategory,
    languageLevelSubChoices,
    loading,
    promptWordCount,
    rootPrompt,
    selectedSentence,
    sendEmailPoints,
    sentenceSuggestions,
    sentenceSuggestionsLoading,
    setRootPrompt,
    state,
    summary,
    temperature,
    updateState,
    updateSummaryRecord,
    writingStyle,
  };
}

export default useApp;
