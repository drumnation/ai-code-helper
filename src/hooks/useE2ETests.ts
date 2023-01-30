import { useEffect, useState } from 'react';

const useE2ETests = () => {
  const [isE2E, updateIsE2ETests] = useState(false);
  const [testComponent, updateTestComponent] = useState('');
  const [e2ePrompt, updateE2EPrompt] = useState('');
  const [e2eCasesPrompt, updateE2ECasesPrompt] = useState('');

  useEffect(() => {
    const prompt = generateE2ETestCasePrompt(testComponent);
    updateE2ECasesPrompt(prompt);
    return () => {};
  }, [testComponent]);

  const handleUpdateTestComponent = (code) => {
    updateTestComponent(code);
  };

  const handleUpdateIsE2ETests = () => {
    updateIsE2ETests(!isE2E);
  };

  const handleUpdateE2ECasesPrompt = (testComponent) => {
    const prompt = generateE2ETestCasePrompt(testComponent);
    updateE2ECasesPrompt(prompt);
  };

  const handleUpdateE2EPrompt = (test, testComponent) => {
    const prompt = generateE2ETestPrompt(test, testComponent);
    updateE2EPrompt(prompt);
  };

  const generateE2ETestCasePrompt = (testComponent: string) => {
    const component =
      testComponent !== '' ? `\n\n\`\`\`jsx\n\n${testComponent}\`\`\`` : '';
    const prompt = `Given the following react native component please generate an array of end to end test case strings in english that would provide full test coverage. Strip any headings and only return an array of strings as stringified json.${component}`;
    return prompt;
  };

  const generateE2ETestPrompt = (test: string, testComponent: string) => {
    const component =
      testComponent !== '' ? `\n\n\`\`\`jsx\n\n${testComponent}\`\`\`` : '';
    const prompt = `Write a jest + detox end to end test as an it statement using the testID key as the selector: '${test}' for the following react native component:${component}`;
    return prompt;
  };

  return {
    e2eCasesPrompt,
    e2ePrompt,
    handleUpdateE2ECasesPrompt,
    handleUpdateE2EPrompt,
    handleUpdateIsE2ETests,
    updateE2ECasesPrompt,
    isE2E,
    testComponent,
    handleUpdateTestComponent,
  };
};

export default useE2ETests;
