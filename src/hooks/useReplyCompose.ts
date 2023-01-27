import { useState } from 'react';
import { State } from '../App.types';

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

function useReplyCompose() {
  const [state, updateState] = useState<State>(initialState);
  const [error, setError] = useState<string>('');

  const [isSendEmail, updateIsSendEmail] = useState<boolean>(true);

  const handleUpdateIsSendEmail = () => {
    updateState({ ...state, sender: state.receiver, receiver: state.sender });
    updateIsSendEmail(!isSendEmail);
    localStorage.setItem('isSendEmail', JSON.stringify(!isSendEmail));
    localStorage.setItem('sender', state.receiver);
    localStorage.setItem('receiver', state.sender);
  };

  return {
    error,
    handleUpdateIsSendEmail,
    isSendEmail,
    setError,
    state,
    updateIsSendEmail,
    updateState,
  };
}

export default useReplyCompose;
