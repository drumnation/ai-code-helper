import { BeforeMount } from '@monaco-editor/react';
import { useEffect, useMemo, useState } from 'react';
import { useClipboard } from 'use-clipboard-copy';
import { libJestSource } from '../../library/monaco';
import { useTestCasesState } from '../../redux/testCases.slice';
import { useUnitTestsState } from '../../redux/unitTests.slice';
import { countPasses, extractFunctionName } from './AllUnitTests.logic';

export const useAllUnitTests = () => {
  const { unitTests } = useUnitTestsState();
  const { testFunction } = useTestCasesState();
  const { trueCount, falseCount } = countPasses(unitTests);

  const clipboard = useClipboard();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (cleared) {
      const timeout = setTimeout(() => {
        setCleared(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [cleared]);

  const handleCopyClickAll = () => {
    clipboard.copy(allUnitTests);
    setCopied(true);
  };

  const allUnitTests = useMemo(() => {
    return `describe('${extractFunctionName(
      testFunction,
    )}', () => {\n${Object.values(unitTests)
      .map((data) => data.test)
      .join('\n\n')}\n});`;
  }, [testFunction, unitTests]);

  const handleEditorWillMount: BeforeMount = (monaco) => {
    const libUri = 'ts:filename/jest.d.ts';
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
      libJestSource,
      libUri,
    );

    // @ts-ignore
    const loaded = monaco.editor.getModel(libUri);

    if (loaded === null) {
      monaco.editor.createModel(
        libJestSource,
        'typescript',
        monaco.Uri.parse(libUri),
      );
    }
  };

  return {
    allUnitTests,
    copied,
    cleared,
    falseCount,
    handleCopyClickAll,
    handleEditorWillMount,
    trueCount,
    unitTests,
  };
};
