import { callChatGPT } from '../../../../api';
import { keepMarkdownCodeBlock } from '../../../../App.logic';
import {
  generateFixFunctionPrompt,
  generateFixTestPrompt,
} from '../../../../App.prompts';
import { updateLoading } from '../../../../redux/loading.slice';
import { useTestCasesStore } from '../../../../redux/testCases.slice';
import { updateUnitTests } from '../../../../redux/unitTests.slice';
import {
  IGetFixedFunction,
  IGetFixedTest,
  IHandleClickFixFunction,
  IHandleClickFixTest,
} from '../../../../types';
import { handleRunTest } from '../../UnitTests.logic';

const getFixedTest = async ({
  index,
  unitTests,
  customInstruction,
}: IGetFixedTest) => {
  const unitTestPrompt = generateFixTestPrompt(
    unitTests[index]?.test,
    unitTests[index]?.expectedValue,
    unitTests[index]?.output,
    customInstruction,
  );
  const fixedTest = await callChatGPT(unitTestPrompt, 1);
  const newUnitTests = { ...unitTests };
  delete newUnitTests[index]?.fixedFunction;
  const runTestResults = handleRunTest(
    index,
    keepMarkdownCodeBlock(fixedTest).trimStart(),
    'fixedTest',
    true,
  );
  newUnitTests[index] = {
    ...newUnitTests[index],
    fixedTest: {
      test: keepMarkdownCodeBlock(fixedTest).trimStart(),
      ...runTestResults.fixedTest,
    },
  };
  return newUnitTests;
};

const getFixedFunction = async ({
  index,
  unitTests,
  customInstruction,
}: IGetFixedFunction) => {
  const { testFunction } = useTestCasesStore.getState();
  const unitTestPrompt = generateFixFunctionPrompt(
    unitTests[index]?.expectedValue,
    unitTests[index]?.output,
    customInstruction,
    testFunction,
  );
  const fixedFunction = await callChatGPT(unitTestPrompt);
  const newUnitTests = { ...unitTests };
  delete newUnitTests[index]?.fixedTest;
  newUnitTests[index] = {
    ...newUnitTests[index],
    fixedFunction: {
      ...newUnitTests[index]?.fixedFunction,
      test: keepMarkdownCodeBlock(fixedFunction).trimStart(),
    },
  };
  return newUnitTests;
};

export const handleClickFixTest = async ({
  index,
  unitTests,
  customInstruction,
}: IHandleClickFixTest) => {
  updateLoading({ type: 'fixTest', loading: true });
  const newUnitTests = await getFixedTest({
    index,
    unitTests,
    customInstruction,
  });
  updateUnitTests(newUnitTests);
  updateLoading({ type: 'fixTest', loading: false });
};

export const handleClickFixFunction = async ({
  index,
  unitTests,
  customInstruction,
}: IHandleClickFixFunction) => {
  updateLoading({ type: 'fixFunction', loading: true });
  const newUnitTests = await getFixedFunction({
    index,
    unitTests,
    customInstruction,
  });
  updateUnitTests(newUnitTests);
  updateLoading({ type: 'fixFunction', loading: false });
};
