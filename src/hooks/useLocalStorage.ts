import { useEffect } from 'react';

function useLocalStorage({
  updateTypescriptTypes,
  updateTestCases,
  updateTestFunction,
}) {
  useEffect(() => {
    const storedTypescriptTypes = localStorage.getItem('typescriptTypes');
    const storedTestFunction = localStorage.getItem('testFunction');
    const storedTestCases = localStorage.getItem('testCases');
    if (storedTypescriptTypes) updateTypescriptTypes(storedTypescriptTypes);
    if (storedTestFunction) updateTestFunction(storedTestFunction);
    if (storedTestCases) updateTestCases(JSON.parse(storedTestCases));
  }, []);

  return {};
}

export default useLocalStorage;
