import { useTestCasesState } from '../../redux/testCases.slice';
import { useUnitTestsState } from '../../redux/unitTests.slice';

import { useLoadingState } from '../../redux/loading.slice';

export const useUnitTests = () => {
  const { testCases, testFunction } = useTestCasesState();
  const { unitTestsLoading, unitTests, customFixInstructions } =
    useUnitTestsState();
  const { allUnitTests } = useLoadingState();

  return {
    testCases,
    testFunction,
    unitTestsLoading,
    unitTests,
    customFixInstructions,
    allUnitTests,
  };
};
