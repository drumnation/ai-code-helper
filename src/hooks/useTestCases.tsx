import { useEffect, useState } from 'react';
import { callChatGPT } from '../api';
import { removeExport } from '../App.logic';
import { generateTestCasesPrompt } from '../App.prompts';
import {
  HandleLoading,
  IGenerateTestCases,
  ITestCases,
  ITestCasesPrompt,
  ITestFunction,
  ITypescriptTypes,
} from './types';

function useTestCases({ handleLoading }: { handleLoading: HandleLoading }) {
  const [typescriptTypes, updateTypescriptTypes] =
    useState<ITypescriptTypes>('');

  const [testFunction, updateTestFunction] = useState<ITestFunction>('');

  const [testCases, updateTestCases] = useState<ITestCases>(['']);

  const [testCasesPrompt, updateTestCasesPrompt] =
    useState<ITestCasesPrompt>('');

  useEffect(() => {
    const prompt = generateTestCasesPrompt({
      typescriptTypes,
      testFunction,
    });
    updateTestCasesPrompt(prompt);
    return () => {};
  }, [typescriptTypes, testFunction]);

  const handleChangeTypeScriptTypes = (code: string) => {
    updateTypescriptTypes(code);
    localStorage.setItem('typescriptTypes', code);
  };

  const handleChangeTestFunction = (code: string) => {
    const updatedCode = removeExport(code);
    updateTestFunction(updatedCode);
    localStorage.setItem('testFunction', code);
  };

  const handleUpdateTestCases = (testCases: string[]) => {
    updateTestCases(testCases);
    localStorage.setItem('testCases', JSON.stringify(testCases));
  };

  const generateTestCases: IGenerateTestCases = async ({ testCasesPrompt }) => {
    handleLoading({ type: 'testCases', value: true });
    const testCases_ = await callChatGPT(testCasesPrompt);
    const parsed = JSON.parse(testCases_);
    handleUpdateTestCases(parsed);
    handleLoading({ type: 'testCases', value: false });
  };

  return {
    generateTestCases,
    handleChangeTestFunction,
    handleChangeTypeScriptTypes,
    testCases,
    testCasesPrompt,
    testFunction,
    typescriptTypes,
    updateTestCases,
    updateTestCasesPrompt,
    updateTestFunction,
    updateTypescriptTypes,
  };
}

export default useTestCases;
