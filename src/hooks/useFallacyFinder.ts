import { useState } from 'react';
import { getFallacies } from '../App.prompts';
import { Fallacy } from '../App.types';

function useFallacyFinder({
  state,
  updateState,
  setError,
  handleLoading,
  isSendEmail,
}) {
  const [fallacies, updateFallacies] = useState<Fallacy[]>([]);
  const [includeFallacyFinder, setIncludeFallacyFinder] = useState(true);

  const handleFallacyFinderChange = (event) => {
    setIncludeFallacyFinder(event.target.checked);
  };

  const generateFallacies = async () => {
    setError('');
    try {
      handleLoading({ type: 'fallacies', value: true });
      const data = await getFallacies({ state, isSendEmail });
      updateState(data);
      updateFallacies(data.fallacies);
      // generateRootPrompt();
      handleLoading({ type: 'fallacies', value: false });
    } catch (error) {
      setError(`${error.message}`);
      handleLoading({ type: 'fallacies', value: false });
    }
  };

  return {
    fallacies,
    generateFallacies,
    handleFallacyFinderChange,
    includeFallacyFinder,
    isSendEmail,
  };
}

export default useFallacyFinder;
