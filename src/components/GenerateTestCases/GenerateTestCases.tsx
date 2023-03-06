import { DiffOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import Editor from '@monaco-editor/react';
import TextArea from 'antd/es/input/TextArea';
import { FC } from 'react';

import {
  updateTestCasesPrompt,
  updateTestFunction,
  updateTypescriptTypes,
} from '../../redux/testCases.slice';
import { useGenerateTestCases } from './GenerateTestCases.hook';
import { generateTestCases } from './GenerateTestCases.logic';

export const GenerateTestCases: FC = () => {
  const { testCasesPrompt, testCases, typescriptTypes, testFunction } =
    useGenerateTestCases();
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
          onChange={(code) => updateTypescriptTypes(code)}
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
          onChange={(code) => updateTestFunction(code)}
          value={testFunction}
        />
      </div>
      <h3>Test Prompt</h3>
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
      />
      <Button
        style={{
          marginTop: 20,
        }}
        type='primary'
        loading={testCases}
        onClick={() =>
          generateTestCases({
            testCasesPrompt,
          })
        }
      >
        Generate Test Cases {!testCases && <DiffOutlined />}
      </Button>
    </>
  );
};
