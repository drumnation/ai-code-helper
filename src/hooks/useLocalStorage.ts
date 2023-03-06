import { useEffect } from 'react';
import {
  updateTestCases,
  updateTestFunction,
  updateTypescriptTypes,
} from '../redux/testCases.slice';
import { updateUnitTests } from '../redux/unitTests.slice';

export function useLocalStorage() {
  useEffect(() => {
    const storedTypescriptTypes = localStorage.getItem('typescriptTypes');
    const storedTestFunction = localStorage.getItem('testFunction');
    const storedTestCases = localStorage.getItem('testCases');
    const storedUnitTests = localStorage.getItem('unitTests');
    if (storedTypescriptTypes) updateTypescriptTypes(storedTypescriptTypes);
    if (storedTestFunction) updateTestFunction(storedTestFunction);
    if (storedTestCases) updateTestCases(JSON.parse(storedTestCases));
    if (storedUnitTests) updateUnitTests(JSON.parse(storedUnitTests));
  }, []);

  return {};
}
