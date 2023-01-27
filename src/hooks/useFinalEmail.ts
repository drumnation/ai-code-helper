import { useState } from 'react';
import { getResponseEmail } from '../App.prompts';

function useFinalEmail({
  state,
  updateState,
  handleLoading,
  temperature,
  rootPrompt,
}) {
  const handleCopy = () => {
    navigator.clipboard.writeText(state.emailResponse);
  };

  const [generateEmailError, setGenerateEmailError] = useState('');

  const generateEmailResponse = async () => {
    setGenerateEmailError('');
    handleLoading({ type: 'emailResponse', value: true });
    try {
      const data = await getResponseEmail({
        state,
        rootPrompt,
        temperature,
      });
      updateState(data);
    } catch (error) {
      setGenerateEmailError(error.message);
    } finally {
      handleLoading({ type: 'emailResponse', value: false });
    }
  };

  return {
    generateEmailError,
    generateEmailResponse,
    handleCopy,
  };
}

export default useFinalEmail;
