import { IGenerateTestCasesPrompt } from './types';

export const generateTestCasesPrompt: IGenerateTestCasesPrompt = ({
  typescriptTypes,
  testFunction,
}) => {
  const hasData = testFunction !== '';
  const hasTypes = typescriptTypes !== '' ? `\n${typescriptTypes}\n` : '';
  const func = hasData ? `\n\n\`\`\`ts\n${hasTypes}${testFunction}\`\`\`` : '';
  const prompt = hasData
    ? `Given the following function please generate a javascript array of test case strings in english that would provide full test coverage. Strip any headings and only return an array of strings as stringified json.${func}`
    : 'Add typescript definitions and a function.';
  return prompt;
};

export const generateUnitTestPrompt = (
  test: string,
  typescriptTypes: string,
  testFunction: string,
) => {
  const func =
    testFunction !== ''
      ? `\n\n\`\`\`ts\n${typescriptTypes}\n\n${testFunction}\`\`\``
      : '';
  const prompt = `Write a typescript jest unit test as an it statement without a describe block: '${test}' for the following function wrapped in markdown:${func}`;
  return prompt;
};

export const generateFixTestPrompt = (
  test: string,
  expectedOutput: string,
  actualOutput: string,
  customInstruction: string,
) => {
  const instructionPrompt =
    customInstruction !== '' ? `\n${customInstruction}` : '';
  const prompt = `Fix the test data so that the expected output matches the function output exactly, including whitespace, returning only an it statement with no explanation:\n\n
    ${test}\n
    make below expected output:\n
    \`\`\`ts\n${expectedOutput}\`\`\`\n
    match below function output:\n\n
    \`\`\`ts\n${actualOutput}\`\`\`\n
    ${instructionPrompt}`;
  return prompt;
};

export const generateFixFunctionPrompt = (
  expectedOutput: string,
  actualOutput: string,
  customInstruction: string,
  testFunction: string,
) => {
  const prompt = `Fix the function so that the function output matches the expected output exactly.\n\n
    \`\`\`ts\n${testFunction}\`\`\`\n
    function output:\n\n
    \`\`\`ts\n${actualOutput}\`\`\`\n
    expected output:\n
    \`\`\`ts\n${expectedOutput}\`\`\`\n
    Any notes outside the function should be in a js comment.\n
    ${customInstruction}`;
  return prompt;
};
