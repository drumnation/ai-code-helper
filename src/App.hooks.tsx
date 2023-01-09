import { useCallback, useEffect, useState } from 'react';
import { callChatGPT, getTags } from './App.logic';

import {
  generateSentenceSuggestions,
  getFallacies,
  getResponseEmail,
  getRootPrompt,
  getSentenceSuggestions,
  getSummary,
  trackSentenceSuggestions,
} from './App.prompts';
import {
  Summary,
  HandleLoadingProps,
  State,
  SummaryAction,
  Fallacy,
  LoadingState,
  ISelectedSentence,
  ISendEmailPoints,
} from './App.types';

function useApp() {
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

  const [temperature, updateTemperature] = useState<number>(0.6);

  const handleChangeTemperature = (temp) => {
    updateTemperature(temp);
  };

  const [isSendEmail, updateIsSendEmail] = useState<boolean>(true);

  const handleUpdateIsSendEmail = () => {
    localStorage.setItem('isSendEmail', JSON.stringify(!isSendEmail));
    updateIsSendEmail(!isSendEmail);
  };

  const [sentenceSuggestions, updateSentenceSuggestions] = useState({});

  const [sentenceSuggestionsLoading, updateSentenceSuggestionsLoading] =
    useState<{ [key: number]: boolean }>({ 0: false });

  const handleUpdateSentenceSuggestionsLoading = ({
    index,
    isRemove = false,
    isLoading = false,
    isLast = false,
    sentenceSuggestionsLoading: sentenceSuggestionsLoading_,
  }) => {
    let newLoading = {
      ...sentenceSuggestionsLoading_,
      [index]: isLoading,
    };
    isRemove && delete newLoading[index];
    if (isLast) newLoading = { 0: false };
    updateSentenceSuggestionsLoading(newLoading);
  };

  const handleClickSentenceSuggestions = async ({
    index,
    sentenceSuggestionsLoading: sentenceSuggestionsLoading_,
  }: {
    index: number;
    sentenceSuggestionsLoading: { [key: number]: boolean };
  }) => {
    handleUpdateSentenceSuggestionsLoading({
      index,
      isLoading: true,
      sentenceSuggestionsLoading: sentenceSuggestionsLoading_,
    });
    const sentenceSuggestions_ = await getSentenceSuggestions({
      sendEmailPoints,
      index,
      sentenceSuggestions,
      temperature,
      trackSentenceSuggestions,
      callChatGPT,
      generateSentenceSuggestions,
    });
    console.log('sentenceSuggestions', sentenceSuggestions_);
    updateSentenceSuggestions(sentenceSuggestions_);
    handleUpdateSentenceSuggestionsLoading({
      index,
      sentenceSuggestionsLoading: sentenceSuggestionsLoading_,
    });
  };

  const [selectedSentence, updateSelectedSentence] =
    useState<ISelectedSentence>({});

  const handleSentenceSelect = ({
    i,
    key,
    selectedSentence: selectedSentence_,
  }: {
    i: number;
    key: string;
    selectedSentence: ISelectedSentence;
  }) => {
    const newSelectedSentence = {
      ...selectedSentence_,
      [i]: selectedSentence_[i] === key ? '' : key,
    };
    updateSelectedSentence(newSelectedSentence);
  };

  const [sendEmailPoints, updateSendEmailPoints] = useState<ISendEmailPoints>([
    '',
  ]);

  useEffect(() => {
    const storedSendEmailPoints = localStorage.getItem('sendEmailPoints');
    const storedReplyToEmail = localStorage.getItem('replyToEmail');
    const storedSender = localStorage.getItem('sender');
    const storedReceiver = localStorage.getItem('receiver');
    const storedIsSendEmail = localStorage.getItem('isSendEmail');
    if (storedSendEmailPoints)
      updateSendEmailPoints(JSON.parse(storedSendEmailPoints));
    if (storedIsSendEmail) updateIsSendEmail(JSON.parse(storedIsSendEmail));
    updateState({
      ...state,
      ...(storedReplyToEmail && { email: storedReplyToEmail }),
      ...(storedSender && { sender: storedSender }),
      ...(storedReceiver && { receiver: storedReceiver }),
    });
  }, []);

  const handleClearSendEmailPoints = () => {
    localStorage.removeItem('sendEmailPoints');
    localStorage.removeItem('sender');
    localStorage.removeItem('receiver');
    updateSendEmailPoints(['']);
    updateState({ ...state, sender: '', receiver: '' });
  };

  const handleClearReplyToEmail = () => {
    localStorage.removeItem('replyToEmail');
    localStorage.removeItem('sender');
    localStorage.removeItem('receiver');
    updateState({ ...state, email: '', sender: '', receiver: '' });
  };

  const handleChangeSender = (event) => {
    localStorage.setItem('sender', event.target.value);
    updateState({ ...state, sender: event.target.value });
  };

  const handleChangeReceiver = (event) => {
    localStorage.setItem('receiver', event.target.value);
    updateState({ ...state, receiver: event.target.value });
  };

  const handleChangeReplyToEmail = (event) => {
    localStorage.setItem('replyToEmail', event.target.value);
    updateState({ ...state, email: event.target.value });
  };

  const handleUpdateSendEmailPoints = ({ newPoint, index }) => {
    const newSendEmailPoints = sendEmailPoints.map((record: '', i) => {
      if (i === index) {
        return newPoint;
      } else {
        return record;
      }
    });
    localStorage.setItem('sendEmailPoints', JSON.stringify(newSendEmailPoints));
    updateSendEmailPoints(newSendEmailPoints);
  };

  const handleAddNewSendEmailPoint = ({
    index,
    sendEmailPoints: sendEmailPoints_,
    sentenceSuggestionsLoading: sentenceSuggestionsLoading_,
  }) => {
    sendEmailPoints_.splice(index + 1, 0, '');

    handleUpdateSentenceSuggestionsLoading({
      index,
      sentenceSuggestionsLoading: sentenceSuggestionsLoading_,
    });
    updateSendEmailPoints([...sendEmailPoints_]);
  };

  const handleRemoveSendEmailPoint = ({
    index,
    sendEmailPoints: sendEmailPoints_,
    sentenceSuggestionsLoading: sentenceSuggestionsLoading_,
  }) => {
    if (sendEmailPoints_.length !== 1) {
      sendEmailPoints_.splice(index, 1);
      handleUpdateSentenceSuggestionsLoading({
        index,
        isRemove: true,
        sentenceSuggestionsLoading: sentenceSuggestionsLoading_,
      });
      updateSendEmailPoints([...sendEmailPoints_]);
    } else {
      handleUpdateSentenceSuggestionsLoading({
        index,
        isLast: true,
        sentenceSuggestionsLoading: sentenceSuggestionsLoading_,
      });
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

  const [writingStyle, updateWritingStyle] = useState('No Style Change');
  const handleWritingStyleRephrase = (style) => {
    updateWritingStyle(style);
  };

  const [descriptors, updateDescriptors] = useState([
    'Brief',
    'Informative',
    'Firm',
    'Friendly',
  ]);

  const handleDescriptorRephrase = (descriptors) => {
    console.log('descriptors', descriptors);

    updateDescriptors(descriptors);
  };

  const [languageLevelCategory, updateLanguageLevelCategory] =
    useState('Ignore Complexity');
  const [languageLevelSubChoices, updateLanguageLevelSubChoice] = useState([]);

  const handleLanguageLevelCategorySelect = (choice) => {
    updateLanguageLevelCategory(choice);
  };

  const handleLanguageLevelSubChoiceSelect = (choice) => {
    updateLanguageLevelSubChoice(choice);
  };

  useEffect(() => {
    handleLanguageLevelSubChoiceSelect([]);
    return () => {};
  }, [languageLevelCategory]);

  const [draftEmailVersions, updateDraftEmailVersions] = useState([]);

  const handleAddNewDraftEmail = () => {
    const count = draftEmailVersions.length + 1;
    const created = Date.now();
    const email = state.emailResponse;
    const title = `Draft ${count}`;
    const wordCount = promptWordCount;
    const {
      toneTags,
      languageLevelCategoryTag,
      languageLevelSubChoicesTags,
      descriptionTag,
    } = getTags(
      descriptors,
      languageLevelCategory,
      languageLevelSubChoices,
      writingStyle,
    );
    const responses = [
      ...draftEmailVersions,
      {
        email,
        title,
        wordCount,
        enableWordCount,
        isFirm,
        tone: toneTags,
        languageLevelCategory: languageLevelCategoryTag,
        languageLevelSubChoices: languageLevelSubChoicesTags,
        description: descriptionTag,
        created,
      },
    ];
    updateDraftEmailVersions(responses);
  };

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
      const data = await getFallacies({ state, isSendEmail });
      updateState(data);
      updateFallacies(data.fallacies);
      generateRootPrompt();
      handleLoading({ type: 'fallacies', value: false });
    } catch (error) {
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
    } catch (error) {
      setError(error.message);
    } finally {
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

  const [isFirm, setIsFirmOn] = useState(true);

  const handleToggleFirm = () => {
    setIsFirmOn((isFirm) => !isFirm);
  };

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

  const [generateEmailError, setGenerateEmailError] = useState('');

  const generateEmailResponse = async () => {
    setGenerateEmailError('');
    handleLoading({ type: 'emailResponse', value: true });
    try {
      const data = await getResponseEmail({ state, rootPrompt, temperature });
      updateState(data);
    } catch (error) {
      setGenerateEmailError(error.message);
    } finally {
      handleLoading({ type: 'emailResponse', value: false });
    }
  };

  return {
    descriptors,
    draftEmailVersions,
    enableWordCount,
    error,
    fallacies,
    generateEmailError,
    generateEmailResponse,
    generateFallacies,
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
    handleUpdateIsSendEmail,
    handleUpdateSendEmailPoints,
    handleWritingStyleRephrase,
    includeFallacyFinder,
    includeSummaryResponses,
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
