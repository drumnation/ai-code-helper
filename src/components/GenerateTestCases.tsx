import { DiffOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import Editor from '@monaco-editor/react';
import useApp from '../App.hooks';
import { FC } from 'react';

export const GenerateTestCases: FC = () => {
  const {
    generateTestCases,
    handleChangeTestFunction,
    handleChangeTypeScriptTypes,
    loading,
    testCasesPrompt,
    testFunction,
    typescriptTypes,
  } = useApp();
  return (
    <>
      <h3>Paste Typescript Types</h3>
      <div
        style={{
          border: '3px solid black',
        }}
      >
        <Editor
          height={150}
          theme='vs-dark'
          language='typescript'
          onChange={(code) => handleChangeTypeScriptTypes(code)}
          value={typescriptTypes}
        />
      </div>
      <h3>Paste Function to Test</h3>
      <div
        style={{
          border: '3px solid black',
        }}
      >
        <Editor
          height={200}
          theme='vs-dark'
          language='typescript'
          onChange={(code) => handleChangeTestFunction(code)}
          value={testFunction}
        />
      </div>
      {/* <h3>Test Prompt</h3>
      <TextArea
       style={{
         marginTop: 10,
         marginBottom: 10,
         color: '#fff',
         background: '#000',
       }}
       onChange={(event) => updateTestCasesPrompt(event.target.value)}
       value={testCasesPrompt}
       autoSize
      /> */}
      <Button
        style={{
          marginTop: 20,
        }}
        type='primary'
        loading={loading.testCases}
        onClick={() =>
          generateTestCases({
            testCasesPrompt,
          })
        }
      >
        Generate Test Cases {!loading.testCases && <DiffOutlined />}
      </Button>
    </>
  );
};
