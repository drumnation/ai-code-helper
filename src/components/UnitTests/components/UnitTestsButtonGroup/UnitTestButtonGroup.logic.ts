import { updateTestFunction } from '../../../../redux/testCases.slice';
import {
  updateCustomFixInstructions,
  updateUnitTests,
  useUnitTestsStore,
} from '../../../../redux/unitTests.slice';

export const handleUpdateOriginalTest = ({ index }: { index: number }) => {
  const { unitTests, customFixInstructions } = useUnitTestsStore.getState();
  const newUnitTests = { ...unitTests };
  const newCustomFixInstructions = { ...customFixInstructions };
  newUnitTests[index] = { ...newUnitTests[index].fixedTest };
  delete newUnitTests[index]?.fixedTest;
  delete newUnitTests[index]?.fixedFunction;
  delete newCustomFixInstructions[index]?.fixTest;
  updateCustomFixInstructions(newCustomFixInstructions);
  updateUnitTests(newUnitTests);
};

export const handleUpdateOriginalFunction = ({ index }: { index: number }) => {
  const { unitTests, customFixInstructions } = useUnitTestsStore.getState();
  const fixedFunction = unitTests[index].fixedFunction.test;
  const newCustomFixInstructions = { ...customFixInstructions };
  const newUnitTests = { ...unitTests };
  delete newUnitTests[index].fixedFunction;
  delete newCustomFixInstructions[index]?.fixFunction;
  updateCustomFixInstructions(newCustomFixInstructions);
  updateTestFunction(fixedFunction);
};
