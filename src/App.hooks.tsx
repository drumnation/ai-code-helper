import {
  useLoading,
  useLocalStorage,
  useTestCases,
  useUnitTests,
} from './hooks';
import { LoadingState, ITestCases, TestEditorProps } from './hooks/types';

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

  const {
    allUnitTests,
    clipboard,
    handleClickAllUnitTests,
    handleClickUnitTests,
    customFixInstructions,
    handleCopyClickAll,
    handleRunTest,
    handleChangeCustomFixInstruction,
    handleClickFixTest,
    handleUpdateOriginalTest,
    handleClickFixFunction,
    handleUpdateOriginalFunction,
    MonacoDiffEditor,
    TestEditor,
    trueCount,
    falseCount,
    unitTests,
    unitTestsLoading,
    updateUnitTests,
  } = useUnitTests({
    testFunction,
    typescriptTypes,
    handleLoading,
    handleChangeTestFunction,
  });

  useLocalStorage({
    updateTypescriptTypes,
    updateTestCases,
    updateTestFunction,
    updateUnitTests,
  });

  const handleClear = () => {
    updateTypescriptTypes('');
    updateTestFunction('');
    updateTestCases([]);
    updateUnitTests([]);
    localStorage.removeItem('typescriptTypes');
    localStorage.removeItem('testFunction');
    localStorage.removeItem('testCases');
    localStorage.removeItem('unitTests');
  };

  return {
    allUnitTests,
    clipboard,
    generateTestCases,
    handleChangeTestFunction,
    handleChangeCustomFixInstruction,
    handleChangeTypeScriptTypes,
    handleClear,
    customFixInstructions,
    handleClickFixFunction,
    handleUpdateOriginalFunction,
    handleClickAllUnitTests,
    handleClickUnitTests,
    handleCopyClickAll,
    handleClickFixTest,
    handleRunTest,
    trueCount,
    falseCount,
    handleUpdateOriginalTest,
    loading,
    MonacoDiffEditor,
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
