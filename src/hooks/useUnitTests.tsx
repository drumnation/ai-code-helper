/* eslint-disable no-eval */
import Editor, { BeforeMount, DiffEditor, OnMount } from '@monaco-editor/react';
import { useState } from 'react';
import { useClipboard } from 'use-clipboard-copy';
import { callChatGPT } from '../api';
import {
  countPasses,
  extractFunctionName,
  getNumLines,
  indentCode,
  keepMarkdownCodeBlock,
  stripTypeFromFunction,
} from '../App.logic';
import {
  generateFixFunctionPrompt,
  generateFixTestPrompt,
  generateUnitTestPrompt,
} from '../App.prompts';
import { libJestSource } from '../library/monaco';
import {
  ICustomFixInstructions,
  IGetFixedFunction,
  IGetFixedTest,
  IGetUnitTests,
  IHandleChangeCustomFixInstruction,
  IHandleChangeUnitTest,
  IHandleClickAllUnitTests,
  IHandleClickFixFunction,
  IHandleClickFixTest,
  IHandleClickUnitTests,
  IHandleUnitTestsLoading,
  IMonacoDiffEditorProps,
  isIUnitTest,
  isIUnitTests,
  IUnitTests,
  IUnitTestsLoading,
  TestEditorProps,
  UseUnitTestProps,
} from './types';

function useUnitTests({
  testFunction,
  typescriptTypes,
  handleLoading,
  handleChangeTestFunction,
}: UseUnitTestProps) {
  const [unitTests, updateUnitTests] = useState<IUnitTests>({});
  const [unitTestsLoading, updateUnitTestsLoading] =
    useState<IUnitTestsLoading>({ 0: false });

  const [customFixInstructions, updateCustomFixInstructions] =
    useState<ICustomFixInstructions>({});

  const clipboard = useClipboard();

  const handleCopyClickAll = () => {
    clipboard.copy(allUnitTests);
  };

  const handleUpdateUnitTests = (tests: IUnitTests) => {
    updateUnitTests(tests);
    localStorage.setItem('unitTests', JSON.stringify(tests));
  };

  const handleUpdateOriginalTest = ({ index }: { index: number }) => {
    const newUnitTests = { ...unitTests };
    const newCustomFixInstructions = { ...customFixInstructions };
    newUnitTests[index] = { ...newUnitTests[index].fixedTest };
    delete newUnitTests[index]?.fixedTest;
    delete newUnitTests[index]?.fixedFunction;
    delete newCustomFixInstructions[index]?.fixTest;
    updateCustomFixInstructions(newCustomFixInstructions);
    handleUpdateUnitTests(newUnitTests);
  };

  const handleUpdateOriginalFunction = ({ index }: { index: number }) => {
    const fixedFunction = unitTests[index].fixedFunction.test;
    const newCustomFixInstructions = { ...customFixInstructions };
    const newUnitTests = { ...unitTests };
    delete newUnitTests[index].fixedFunction;
    delete newCustomFixInstructions[index]?.fixFunction;
    updateCustomFixInstructions(newCustomFixInstructions);
    handleChangeTestFunction(fixedFunction);
  };

  const handleUpdateUnitTestsLoading = ({
    index,
    isLast = false,
    isLoading = false,
    isRemove = false,
    unitTestsLoading: unitTestsLoading_,
  }: IHandleUnitTestsLoading) => {
    let newLoading = {
      ...unitTestsLoading_,
      [index]: isLoading,
    };
    isRemove && delete newLoading[index];
    if (isLast) newLoading = { 0: false };
    updateUnitTestsLoading(newLoading);
  };

  const getUnitTests = async ({
    test,
    index,
    unitTests,
    single = true,
  }: IGetUnitTests): Promise<IUnitTests | string> => {
    const unitTestPrompt = generateUnitTestPrompt(
      test,
      typescriptTypes,
      testFunction,
    );
    const testCase = await callChatGPT(unitTestPrompt);
    const newUnitTests: IUnitTests = { ...unitTests };
    if (single) {
      const testResults = await handleRunTest(
        index,
        keepMarkdownCodeBlock(testCase).trimStart(),
        'original',
      );
      newUnitTests[index] = {
        test: keepMarkdownCodeBlock(testCase).trimStart(),
        ...testResults,
      };
    } else {
      newUnitTests[index] = {
        test: keepMarkdownCodeBlock(testCase).trimStart(),
      };
    }
    delete newUnitTests[index]?.fixedTest;
    delete newUnitTests[index]?.fixedFunction;
    return single ? newUnitTests : newUnitTests[index].test;
  };

  const handleClickUnitTests = async ({
    index,
    test,
    unitTestsLoading: unitTestsLoading_,
  }: IHandleClickUnitTests) => {
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
    if (isIUnitTests(unitTests_)) {
      handleUpdateUnitTests(unitTests_);
    }
    handleUpdateUnitTestsLoading({
      index,
      unitTestsLoading: unitTestsLoading_,
    });
  };

  const handleClickAllUnitTests = async ({
    testCases,
    unitTests: unitTests_,
  }: IHandleClickAllUnitTests) => {
    const allUnitTests = { ...unitTests_ };
    handleLoading({ type: 'allUnitTests', value: true });
    await Promise.all(
      testCases.map(async (test, index) => {
        if (allUnitTests[index]?.pass !== true) {
          const unitTest = await getUnitTests({
            index,
            unitTests,
            test,
            single: false,
          });
          if (isIUnitTest(unitTest)) {
            const testResults = await handleRunTest(
              index,
              unitTest,
              'original',
              true,
            );
            allUnitTests[index] = { test: unitTest, ...testResults };
          }
        }
      }),
    );
    handleUpdateUnitTests(allUnitTests);
    handleLoading({ type: 'allUnitTests', value: false });
  };

  const handleRunTest = (
    index: number,
    itStatement: string,
    type: 'original' | 'fixedTest' | 'fixedFunction',
    bulk = false,
  ) => {
    function expect(value) {
      return {
        value,
        toBe(expected) {
          const pass = value === expected;
          return {
            pass,
            output: value,
            expectedValue: expected,
          };
        },
        toEqual(expected) {
          const pass = JSON.stringify(value) === JSON.stringify(expected);
          return {
            pass,
            output: value,
            expectedValue: expected,
          };
        },
        toMatch(matcher) {
          const pass = matcher.test(value);
          return {
            pass,
            output: value,
            expectedValue: matcher,
          };
        },
      };
    }

    function modifyTestFunction(testFunction: string) {
      const testFunctionString = testFunction.toString();
      const modifiedTestFunctionString = testFunctionString.replace(
        /expect\(/g,
        'return expect(',
      );
      const modifiedTestFunction = eval(modifiedTestFunctionString);
      return modifiedTestFunction;
    }

    function it(description: string, testFn: string) {
      console.log(`Running test: ${description}`);
      const modifiedTestFunction = modifyTestFunction(testFn);
      const result = modifiedTestFunction();
      if (result.pass) {
        console.log(`Test passed: ${description}`);
        return addTestResultToUnitTests(result);
      } else {
        console.error(`Test failed: ${description}`);
        return addTestResultToUnitTests(result);
      }

      function addTestResultToUnitTests({
        pass,
        output,
        expectedValue,
      }: {
        pass: boolean;
        output: string;
        expectedValue: string;
      }) {
        const updatedTests = { ...unitTests };
        switch (type) {
          case 'fixedTest':
            updatedTests[index] = {
              ...updatedTests[index],
              fixedTest: {
                ...updatedTests[index]?.fixedTest,
                pass,
                output,
                expectedValue,
              },
            };
            break;
          case 'fixedFunction':
            updatedTests[index] = {
              ...updatedTests[index],
              fixedFunction: {
                ...updatedTests[index]?.fixedFunction,
                pass,
                output,
                expectedValue,
              },
            };
            break;
          case 'original':
          default:
            updatedTests[index] = {
              ...updatedTests[index],
              pass,
              output,
              expectedValue,
            };
            break;
        }
        if (!bulk) handleUpdateUnitTests(updatedTests);
        console.log('addTestResultToUnitTests', {
          pass,
          output,
          expectedValue,
          updatedTests,
        });
        return updatedTests[index];
      }
    }

    const IIFE =
      '(() => {' +
      '\n' +
      stripTypeFromFunction(testFunction) +
      '\n\n' +
      indentCode +
      '\n\n' +
      modifyTestFunction +
      '\n\n' +
      it +
      '\n\n' +
      expect +
      '\n\n' +
      'return ' +
      itStatement +
      '\n' +
      '})()';
    const result = eval(IIFE);
    return result;
  };

  const handleChangeCustomFixInstruction = ({
    index,
    instruction,
    type,
    customFixInstructions: customFixInstructions_,
  }: IHandleChangeCustomFixInstruction) => {
    const newCustomFixInstructions = { ...customFixInstructions_ };
    newCustomFixInstructions[index] = {
      ...customFixInstructions[index],
      [type]: instruction,
    };
    updateCustomFixInstructions(newCustomFixInstructions);
  };

  const getFixedTest = async ({
    index,
    unitTests,
    customInstruction,
  }: IGetFixedTest) => {
    const unitTestPrompt = generateFixTestPrompt(
      unitTests[index]?.test,
      unitTests[index]?.expectedValue,
      unitTests[index]?.output,
      customInstruction,
    );
    const fixedTest = await callChatGPT(unitTestPrompt, 1);
    const newUnitTests = { ...unitTests };
    delete newUnitTests[index]?.fixedFunction;
    const runTestResults = handleRunTest(
      index,
      keepMarkdownCodeBlock(fixedTest).trimStart(),
      'fixedTest',
      true,
    );
    newUnitTests[index] = {
      ...newUnitTests[index],
      fixedTest: {
        test: keepMarkdownCodeBlock(fixedTest).trimStart(),
        ...runTestResults.fixedTest,
      },
    };
    return newUnitTests;
  };

  const handleClickFixTest = async ({
    index,
    unitTests,
    customInstruction,
  }: IHandleClickFixTest) => {
    handleLoading({ type: 'fixTest', value: true });
    const newUnitTests = await getFixedTest({
      index,
      unitTests,
      customInstruction,
    });
    handleUpdateUnitTests(newUnitTests);
    handleLoading({ type: 'fixTest', value: false });
  };

  const getFixedFunction = async ({
    index,
    unitTests,
    customInstruction,
  }: IGetFixedFunction) => {
    const unitTestPrompt = generateFixFunctionPrompt(
      unitTests[index]?.expectedValue,
      unitTests[index]?.output,
      customInstruction,
      testFunction,
    );
    const fixedFunction = await callChatGPT(unitTestPrompt);
    const newUnitTests = { ...unitTests };
    delete newUnitTests[index]?.fixedTest;
    newUnitTests[index] = {
      ...newUnitTests[index],
      fixedFunction: {
        ...newUnitTests[index]?.fixedFunction,
        test: keepMarkdownCodeBlock(fixedFunction).trimStart(),
      },
    };
    return newUnitTests;
  };

  const handleClickFixFunction = async ({
    index,
    unitTests,
    customInstruction,
  }: IHandleClickFixFunction) => {
    handleLoading({ type: 'fixFunction', value: true });
    const newUnitTests = await getFixedFunction({
      index,
      unitTests,
      customInstruction,
    });
    handleUpdateUnitTests(newUnitTests);
    handleLoading({ type: 'fixFunction', value: false });
  };

  const allUnitTests = `describe('${extractFunctionName(
    testFunction,
  )}', () => {\n${Object.values(unitTests)
    .map((data) => data.test)
    .join('\n\n')}\n});`;

  const { trueCount, falseCount } = countPasses(unitTests);

  const TestEditor = ({ value, index, unitTests }: TestEditorProps) => {
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

    const handleEditorDidMount: OnMount = (editor, monaco) => {
      editor.layout({
        width: editor.getContentWidth(),
        height: editor.getContentHeight(),
      });
    };

    const handleChangeUnitTest = ({
      index,
      test,
      unitTests,
    }: IHandleChangeUnitTest) => {
      const changedUnitTests = { ...unitTests };
      changedUnitTests[index] = { ...changedUnitTests[index], test };
      handleUpdateUnitTests(changedUnitTests);
    };
    const height = getNumLines(value) * 19;

    return (
      <div style={{ border: '3px solid black' }}>
        <Editor
          onMount={handleEditorDidMount}
          beforeMount={handleEditorWillMount}
          theme='vs-dark'
          language='typescript'
          value={value}
          height={height}
          onChange={(code) =>
            handleChangeUnitTest({ index, unitTests, test: code })
          }
        />
      </div>
    );
  };

  const MonacoDiffEditor = ({
    modified,
    original,
    originalHeading,
    modifiedHeading,
  }: IMonacoDiffEditorProps) => {
    return (
      <div>
        <div style={{ display: 'flex' }}>
          <h3 style={{ flex: 1 }}>{originalHeading}</h3>
          <h3 style={{ flex: 1 }}>{modifiedHeading}</h3>
        </div>
        <div
          style={{
            border: '3px solid black',
          }}
        >
          <DiffEditor
            theme='vs-dark'
            language='typescript'
            width='100%'
            options={{
              readOnly: true,
              renderSideBySide: true,
              ignoreTrimWhitespace: false, // Include whitespace differences in the diff
            }}
            height={getNumLines(original) * 25}
            original={original}
            modified={modified}
          />
        </div>
      </div>
    );
  };

  return {
    allUnitTests,
    clipboard,
    handleChangeCustomFixInstruction,
    handleClickAllUnitTests,
    handleClickUnitTests,
    handleCopyClickAll,
    handleRunTest,
    handleUpdateOriginalTest,
    handleClickFixTest,
    handleClickFixFunction,
    handleUpdateOriginalFunction,
    handleUpdateUnitTestsLoading,
    customFixInstructions,
    TestEditor,
    trueCount,
    falseCount,
    unitTests,
    unitTestsLoading,
    MonacoDiffEditor,
    updateUnitTests,
  };
}

export default useUnitTests;
