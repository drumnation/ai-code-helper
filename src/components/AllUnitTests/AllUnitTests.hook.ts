import { useClipboard } from 'use-clipboard-copy';
import { useTestCasesState } from '../../redux/testCases.slice';
import { useUnitTestsState } from '../../redux/unitTests.slice';
import { countPasses, extractFunctionName } from './AllUnitTests.logic';

export const useAllUnitTests = () => {
  const { unitTests } = useUnitTestsState();
  const { testFunction } = useTestCasesState();
  const { trueCount, falseCount } = countPasses(unitTests);
  const clipboard = useClipboard();

  const handleCopyClickAll = () => {
    clipboard.copy(allUnitTests);
  };

  const allUnitTests = `describe('${extractFunctionName(
    testFunction,
  )}', () => {\n${Object.values(unitTests)
    .map((data) => data.test)
    .join('\n\n')}\n});`;

  return {
    allUnitTests,
    falseCount,
    handleCopyClickAll,
    trueCount,
    unitTests,
  };
};
