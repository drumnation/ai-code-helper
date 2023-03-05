import { useEffect } from 'react';
import { UseLocalStorageProps } from './types';

function useLocalStorage({
  updateTypescriptTypes,
  updateTestCases,
  updateTestFunction,
  updateUnitTests,
}: UseLocalStorageProps) {
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

export default useLocalStorage;
