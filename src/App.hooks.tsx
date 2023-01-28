import {
  useLoading,
  useLocalStorage,
  useTestCases,
  useUnitTests,
} from './hooks';

function useApp() {
  const { loading, handleLoading } = useLoading();

  const {
    handleChangeTypeScriptTypes,
    handleChangeTestFunction,
    generateTestCases,
    testCases,
    testCasesPrompt,
    typescriptTypes,
    testFunction,
    updateTypescriptTypes,
    updateTestCases,
    updateTestFunction,
    updateTestCasesPrompt,
  } = useTestCases({ handleLoading });

  useLocalStorage({
    updateTypescriptTypes,
    updateTestCases,
    updateTestFunction,
  });

  const {
    allUnitTests,
    clipboard,
    handleClickUnitTests,
    handleClickAllUnitTests,
    handleCopyClickAll,
    TestEditor,
    unitTests,
    unitTestsLoading,
    updateUnitTests,
  } = useUnitTests({ testFunction, typescriptTypes, handleLoading });

  const handleClear = () => {
    updateTypescriptTypes('');
    updateTestFunction('');
    updateTestCases(['']);
    updateUnitTests([]);
    localStorage.removeItem('typescriptTypes');
    localStorage.removeItem('testFunction');
    localStorage.removeItem('testCases');
  };

  return {
    allUnitTests,
    clipboard,
    generateTestCases,
    handleChangeTestFunction,
    handleChangeTypeScriptTypes,
    handleClear,
    handleClickAllUnitTests,
    handleClickUnitTests,
    handleCopyClickAll,
    loading,
    testCases,
    testCasesPrompt,
    TestEditor,
    testFunction,
    typescriptTypes,
    unitTests,
    unitTestsLoading,
    updateTestCasesPrompt,
  };
}

export default useApp;
