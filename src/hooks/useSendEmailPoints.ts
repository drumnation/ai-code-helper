import { useState } from 'react';
import { ISendEmailPoints } from '../App.types';
import useSentenceSuggestions from './useSentenceSuggestions';

function useSendEmailPoints({ state, updateState, temperature }) {
  const [sendEmailPoints, updateSendEmailPoints] = useState<ISendEmailPoints>([
    '',
  ]);

  const {
    handleClickSentenceSuggestions,
    handleSentenceSelect,
    selectedSentence,
    sentenceSuggestions,
    sentenceSuggestionsLoading,
    handleUpdateSentenceSuggestionsLoading,
  } = useSentenceSuggestions({ temperature, sendEmailPoints });

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

  return {
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
  };
}

export default useSendEmailPoints;
