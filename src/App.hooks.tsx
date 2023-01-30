import useE2ETests from './hooks/useE2ETests';
import {
  useEditor,
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

  const {
    e2eCasesPrompt,
    e2ePrompt,
    handleUpdateE2ECasesPrompt,
    handleUpdateE2EPrompt,
    handleUpdateIsE2ETests,
    updateE2ECasesPrompt,
    isE2E,
    testComponent,
    handleUpdateTestComponent,
  } = useE2ETests();

  const handleClear = () => {
    updateTypescriptTypes('');
    updateTestFunction('');
    updateTestCases(['']);
    updateUnitTests([]);
    localStorage.removeItem('typescriptTypes');
    localStorage.removeItem('testFunction');
    localStorage.removeItem('testCases');
  };

  const { CustomEditor } = useEditor();

  return {
    allUnitTests,
    clipboard,
    CustomEditor,
    e2eCasesPrompt,
    e2ePrompt,
    generateTestCases,
    testComponent,
    handleUpdateTestComponent,
    updateE2ECasesPrompt,
    handleChangeTestFunction,
    handleChangeTypeScriptTypes,
    handleClear,
    handleClickAllUnitTests,
    handleClickUnitTests,
    handleCopyClickAll,
    handleUpdateE2ECasesPrompt,
    handleUpdateE2EPrompt,
    handleUpdateIsE2ETests,
    isE2E,
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
