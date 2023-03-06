import { useTestCasesState } from '../../redux/testCases.slice';
import { useUnitTestsState } from '../../redux/unitTests.slice';

import { useLoadingState } from '../../redux/loading.slice';

export const useUnitTests = () => {
  const { testCases, testFunction } = useTestCasesState();
  const { unitTestsLoading, unitTests, customFixInstructions } =
    useUnitTestsState();
  const { allUnitTests } = useLoadingState();

  const isTestCaseLengthGreaterThanOne = testCases.length >= 1;
  const hasTest = (index) => unitTests[index]?.test !== undefined;

  const hasPassFalse = (index) => unitTests[index]?.pass === false;

  const hasFixedTest = (index) =>
    unitTests[index]?.fixedTest?.test !== undefined;

  const hasFixedFunction = (index) =>
    unitTests[index]?.fixedFunction?.test !== undefined;

  const hasFixedTestPass = (index) =>
    unitTests[index]?.fixedTest?.pass !== undefined;

  return {
    allUnitTests,
    customFixInstructions,
    hasFixedFunction,
    hasFixedTest,
    hasFixedTestPass,
    hasPassFalse,
    hasTest,
    isTestCaseLengthGreaterThanOne,
    testCases,
    testFunction,
    unitTests,
    unitTestsLoading,
  };
};
