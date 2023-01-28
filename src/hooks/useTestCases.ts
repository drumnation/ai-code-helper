import { useEffect, useState } from 'react';
import { callChatGPT } from '../App.logic';

type IGenerateTestCasesPrompt = ({
  typescriptTypes,
  testFunction,
}: {
  typescriptTypes: string;
  testFunction: string;
}) => string;

type IGenerateTestCases = ({
  testCasesPrompt,
}: {
  testCasesPrompt: string;
}) => Promise<void>;

function useTestCases({ handleLoading }) {
  const [typescriptTypes, updateTypescriptTypes] = useState<string>('');
  const handleChangeTypeScriptTypes = (code: string) => {
    updateTypescriptTypes(code);
    localStorage.setItem('typescriptTypes', code);
  };
  const [testFunction, updateTestFunction] = useState<string>('');
  const handleChangeTestFunction = (code: string) => {
    updateTestFunction(code);
    localStorage.setItem('testFunction', code);
  };

  const [testCasesPrompt, updateTestCasesPrompt] = useState<string>('');

  useEffect(() => {
    const prompt = generateTestCasesPrompt({ typescriptTypes, testFunction });
    updateTestCasesPrompt(prompt);
    return () => {};
  }, [typescriptTypes, testFunction]);

  const [testCases, updateTestCases] = useState<string[]>(['']);

  const handleUpdateTestCases = (testCases: string[]) => {
    updateTestCases(testCases);
    localStorage.setItem('testCases', JSON.stringify(testCases));
  };

  const generateTestCasesPrompt: IGenerateTestCasesPrompt = ({
    typescriptTypes,
    testFunction,
  }) => {
    const hasData = typescriptTypes !== '' && testFunction !== '';
    const func = hasData
      ? `\n\n\`\`\`ts\n${typescriptTypes}\n\n${testFunction}\`\`\``
      : '';
    const prompt = hasData
      ? `Given the following function please generate a javascript array of test case strings in english that would provide full test coverage. Strip any headings and only return an array of strings as stringified json.${func}`
      : 'Add typescript definitions and a function.';
    return prompt;
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
