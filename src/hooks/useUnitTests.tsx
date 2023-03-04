import Editor, { OnMount } from '@monaco-editor/react';
import { useRef, useState } from 'react';
import { useClipboard } from 'use-clipboard-copy';
import { callChatGPT, indentCode } from '../App.logic';
import { libJestSource } from '../library/monaco';

let loaded = false;

function useUnitTests({ testFunction, typescriptTypes, handleLoading }) {
  const [unitTests, updateUnitTests] = useState({});

  const [unitTestsLoading, updateUnitTestsLoading] = useState<{
    [key: number]: boolean;
  }>({ 0: false });

  const handleUpdateUnitTestsLoading = ({
    index,
    isRemove = false,
    isLoading = false,
    isLast = false,
    unitTestsLoading: unitTestsLoading_,
  }) => {
    let newLoading = {
      ...unitTestsLoading_,
      [index]: isLoading,
    };
    isRemove && delete newLoading[index];
    if (isLast) newLoading = { 0: false };
    updateUnitTestsLoading(newLoading);
  };

  const generateUnitTestPrompt = (
    test: string,
    typescriptTypes: string,
    testFunction: string,
  ) => {
    const func =
      typescriptTypes !== '' && testFunction !== ''
        ? `\n\n\`\`\`ts\n${typescriptTypes}\n\n${testFunction}\`\`\``
        : '';
    const prompt = `Write a typescript jest unit test as an it statement without a describe block: '${test}' for the following function wrapped in markdown:${func}`;
    return prompt;
  };

  function keepMarkdownCodeBlock(markdown) {
    return markdown.replace(/```ts\n([\s\S]*?)\n```/g, '$1');
  }

  const getUnitTests = async ({ test, index, unitTests, single = true }) => {
    const unitTestPrompt = generateUnitTestPrompt(
      test,
      typescriptTypes,
      testFunction,
    );
    const testCase = await callChatGPT(unitTestPrompt);
    const newUnitTests = { ...unitTests };
    newUnitTests[index] = keepMarkdownCodeBlock(testCase).trimStart();
    return single ? newUnitTests : newUnitTests[index];
  };

  const handleClickUnitTests = async ({
    index,
    test,
    unitTestsLoading: unitTestsLoading_,
  }: {
    index: number;
    test: string;
    unitTestsLoading: { [key: number]: boolean };
  }) => {
    handleUpdateUnitTestsLoading({
      index,
      isLoading: true,
      unitTestsLoading: unitTestsLoading_,
    });
    const unitTests_ = await getUnitTests({
      index,
      unitTests,
      test,
    });
    updateUnitTests(unitTests_);
    handleUpdateUnitTestsLoading({
      index,
      unitTestsLoading: unitTestsLoading_,
    });
  };

  const handleClickAllUnitTests = async ({
    testCases,
    unitTests: unitTests_,
  }) => {
    const allUnitTests = { ...unitTests_ };
    handleLoading({ type: 'allUnitTests', value: true });
    await Promise.all(
      testCases.map(async (test, index) => {
        const unitTest = await getUnitTests({
          index,
          unitTests,
          test,
          single: false,
        });
        allUnitTests[index] = unitTest;
      }),
    );

    updateUnitTests(allUnitTests);
    handleLoading({ type: 'allUnitTests', value: false });
  };

  const editorTestRefs = useRef([]);
  const clipboard = useClipboard();

  const TestEditor = ({ value }) => {
    function handleEditorWillMount(monaco) {
      var libUri = 'ts:filename/jest.d.ts';
      monaco.languages.typescript.javascriptDefaults.addExtraLib(
        libJestSource,
        libUri,
      );
      if (!loaded) {
        monaco.editor.createModel(
          libJestSource,
          'typescript',
          monaco.Uri.parse(libUri),
        );
        loaded = true;
      }
    }
    const handleEditorDidMount: OnMount = (editor, monaco) => {
      editor.layout({
        width: editor.getContentWidth(),
        height: editor.getContentHeight(),
      });
    };
    return (
      <div style={{ border: '3px solid black' }}>
        <Editor
          onMount={handleEditorDidMount}
          beforeMount={handleEditorWillMount}
          theme='vs-dark'
          language='typescript'
          value={indentCode(value)}
        />
      </div>
    );
  };

  function extractFunctionName(string) {
    let match = string.match(/(?:function|const)\s+(\w+)\s*(?:\(|:)/);
    if (match) {
      return match[1];
    }
    return null;
  }

  const allUnitTests = `describe('${extractFunctionName(
    testFunction,
  )}', () => {\n${Object.values(unitTests).join('\n\n')}\n});`;

  const handleCopyClickAll = () => {
    clipboard.copy(allUnitTests);
  };

  return {
    clipboard,
    editorTestRefs,
    handleClickUnitTests,
    handleUpdateUnitTestsLoading,
    TestEditor,
    unitTests,
    unitTestsLoading,
    updateUnitTests,
    handleCopyClickAll,
    allUnitTests,
    handleClickAllUnitTests,
  };
}

export default useUnitTests;
