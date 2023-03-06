/* eslint-disable no-eval */

import { callChatGPT } from '../../api';
import {
  indentCode,
  keepMarkdownCodeBlock,
  stripTypeFromFunction,
} from '../../App.logic';
import { generateUnitTestPrompt } from '../../App.prompts';
import { updateLoading } from '../../redux/loading.slice';
import { deleteTestCase, useTestCasesStore } from '../../redux/testCases.slice';
import {
  deleteUnitTest,
  updateUnitTests,
  updateUnitTestsLoading,
  useUnitTestsStore,
} from '../../redux/unitTests.slice';
import {
  IGetUnitTests,
  IHandleClickAllUnitTests,
  IHandleClickUnitTests,
  isIUnitTest,
  isIUnitTests,
  ITestType,
  IUnitTests,
} from '../../types';

export const getUnitTests = async ({
  test,
  index,
  unitTests,
  single = true,
}: IGetUnitTests): Promise<IUnitTests | string> => {
  const { typescriptTypes, testFunction } = useTestCasesStore.getState();
  const unitTestPrompt = generateUnitTestPrompt(
    test,
    typescriptTypes,
    testFunction,
  );
  const testCase = await callChatGPT(unitTestPrompt);
  const newUnitTests: IUnitTests = { ...unitTests };
  if (single) {
    const testResults = await handleRunTest(
      index,
      keepMarkdownCodeBlock(testCase).trimStart(),
      'original',
    );
    newUnitTests[index] = {
      test: keepMarkdownCodeBlock(testCase).trimStart(),
      ...testResults,
    };
  } else {
    newUnitTests[index] = {
      test: keepMarkdownCodeBlock(testCase).trimStart(),
    };
  }
  delete newUnitTests[index]?.fixedTest;
  delete newUnitTests[index]?.fixedFunction;
  return single ? newUnitTests : newUnitTests[index].test;
};

export const handleClickUnitTests = async ({
  index,
  test,
  unitTestsLoading: unitTestsLoading_,
}: IHandleClickUnitTests) => {
  const { unitTests } = useUnitTestsStore.getState();
  updateUnitTestsLoading({
    index,
    isLoading: true,
    unitTestsLoading: unitTestsLoading_,
  });
  const unitTests_ = await getUnitTests({
    index,
    unitTests,
    test,
  });
  if (isIUnitTests(unitTests_)) {
    updateUnitTests(unitTests_);
  }
  updateUnitTestsLoading({
    index,
    unitTestsLoading: unitTestsLoading_,
  });
};

export const handleClickAllUnitTests = async ({
  testCases,
  unitTests: unitTests_,
}: IHandleClickAllUnitTests) => {
  const { unitTests } = useUnitTestsStore.getState();
  const allUnitTests = { ...unitTests_ };
  updateLoading({ type: 'allUnitTests', loading: true });
  await Promise.all(
    testCases.map(async (test, index) => {
      const doAllPass = Object.values(allUnitTests).every(
        (test) => test.pass === true,
      );
      if (allUnitTests[index]?.pass !== true || doAllPass) {
        const unitTest = await getUnitTests({
          index,
          unitTests,
          test,
          single: false,
        });
        if (isIUnitTest(unitTest)) {
          const testResults = await handleRunTest(
            index,
            unitTest,
            'original',
            true,
          );
          allUnitTests[index] = { test: unitTest, ...testResults };
        }
      }
    }),
  );
  updateUnitTests(allUnitTests);
  updateLoading({ type: 'allUnitTests', loading: false });
};

export const handleRunTest = (
  index: number,
  itStatement: string,
  type: ITestType,
  bulk = false,
) => {
  const { unitTests } = useUnitTestsStore.getState();
  const { testFunction } = useTestCasesStore.getState();
  function expect(value) {
    return {
      value,
      toBe(expected) {
        const pass = value === expected;
        return {
          pass,
          output: value,
          expectedValue: expected,
        };
      },
      toEqual(expected) {
        const pass = JSON.stringify(value) === JSON.stringify(expected);
        return {
          pass,
          output: value,
          expectedValue: expected,
        };
      },
      toMatch(matcher) {
        const pass = matcher.test(value);
        return {
          pass,
          output: value,
          expectedValue: matcher,
        };
      },
    };
  }

  function modifyTestFunction(testFunction: string) {
    const testFunctionString = testFunction.toString();
    const modifiedTestFunctionString = testFunctionString.replace(
      /expect\(/g,
      'return expect(',
    );
    const modifiedTestFunction = eval(modifiedTestFunctionString);
    return modifiedTestFunction;
  }

  function it(description: string, testFn: string) {
    console.log(`Running test: ${description}`);
    const modifiedTestFunction = modifyTestFunction(testFn);
    const result = modifiedTestFunction();
    if (result.pass) {
      console.log(`Test passed: ${description}`);
      return addTestResultToUnitTests(result);
    } else {
      console.error(`Test failed: ${description}`);
      return addTestResultToUnitTests(result);
    }

    function addTestResultToUnitTests({
      pass,
      output,
      expectedValue,
    }: {
      pass: boolean;
      output: string;
      expectedValue: string;
    }) {
      const updatedTests = { ...unitTests };
      switch (type) {
        case 'fixedTest':
          updatedTests[index] = {
            ...updatedTests[index],
            fixedTest: {
              ...updatedTests[index]?.fixedTest,
              pass,
              output,
              expectedValue,
            },
          };
          break;
        case 'fixedFunction':
          updatedTests[index] = {
            ...updatedTests[index],
            fixedFunction: {
              ...updatedTests[index]?.fixedFunction,
              pass,
              output,
              expectedValue,
            },
          };
          break;
        case 'original':
        default:
          updatedTests[index] = {
            ...updatedTests[index],
            pass,
            output,
            expectedValue,
          };
          break;
      }
      if (!bulk) updateUnitTests(updatedTests);
      console.log('addTestResultToUnitTests', {
        pass,
        output,
        expectedValue,
        updatedTests,
      });
      return updatedTests[index];
    }
  }

  const IIFE =
    '(() => {' +
    '\n' +
    stripTypeFromFunction(testFunction) +
    '\n\n' +
    indentCode +
    '\n\n' +
    modifyTestFunction +
    '\n\n' +
    it +
    '\n\n' +
    expect +
    '\n\n' +
    'return ' +
    itStatement +
    '\n' +
    '})()';
  const result = eval(IIFE);
  return result;
};

export const deleteTestCaseAndUnitTest = (index: number) => {
  deleteTestCase(index);
  deleteUnitTest(index);
};
