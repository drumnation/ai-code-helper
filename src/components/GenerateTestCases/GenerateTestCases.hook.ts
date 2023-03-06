import { useEffect } from 'react';

import { generateTestCasesPrompt } from '../../App.prompts';
import { useLoadingState } from '../../redux/loading.slice';
import {
  updateTestCasesPrompt,
  useTestCasesState,
} from '../../redux/testCases.slice';

export const useGenerateTestCases = () => {
  const { typescriptTypes, testFunction, testCasesPrompt } =
    useTestCasesState();
  const { testCases } = useLoadingState();

  useEffect(() => {
    const prompt = generateTestCasesPrompt({
      typescriptTypes,
      testFunction,
    });
    updateTestCasesPrompt(prompt);
    return () => {};
  }, [typescriptTypes, testFunction]);

  return { testCasesPrompt, testCases, typescriptTypes, testFunction };
};
