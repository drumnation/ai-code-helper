import Editor, { BeforeMount, OnMount } from '@monaco-editor/react';
import { getNumLines } from '../../App.logic';
import { libJestSource } from '../../library/monaco';
import { updateUnitTests } from '../../redux/unitTests.slice';
import { TestEditorProps, IHandleChangeUnitTest } from '../../types';

export const TestEditor = ({ value, index, unitTests }: TestEditorProps) => {
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
    updateUnitTests(changedUnitTests);
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
