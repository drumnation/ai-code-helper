import { useState } from 'react';
import { callChatGPT } from '../App.logic';
import {
  getSentenceSuggestions,
  trackSentenceSuggestions,
  generateSentenceSuggestions,
} from '../App.prompts';
import { ISelectedSentence } from '../App.types';

function useSentenceSuggestions({ temperature, sendEmailPoints }) {
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

  return {
    handleClickSentenceSuggestions,
    handleSentenceSelect,
    selectedSentence,
    sentenceSuggestions,
    sentenceSuggestionsLoading,
    updateSentenceSuggestions,
    handleUpdateSentenceSuggestionsLoading,
  };
}

export default useSentenceSuggestions;
