import { useState } from 'react';
import { getSummary } from '../App.prompts';
import { Summary, SummaryAction } from '../App.types';

function useSummarizer({ state, updateState, setError, handleLoading }) {
  const [summary, updateSummary] = useState<Summary[]>([]);
  const [includeSummaryResponses, setIncludeSummaryResponses] = useState(true);

  const handleSummaryResponsesChange = (event) => {
    setIncludeSummaryResponses(event.target.checked);
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
      // generateRootPrompt();
    } catch (error) {
      setError(error.message);
    } finally {
      handleLoading({ type: 'summary', value: false });
    }
  };

  return {
    generateSummary,
    handleSummaryResponsesChange,
    includeSummaryResponses,
    summary,
    updateSummaryRecord,
  };
}

export default useSummarizer;
