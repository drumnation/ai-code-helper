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
import { styles } from './GenerateTestCases.styles';

export const GenerateTestCases: FC = () => {
  const { testCasesPrompt, testCases, typescriptTypes, testFunction } =
    useGenerateTestCases();

  return (
    <>
      <h3 style={styles.h3}>Paste Typescript Types</h3>
      <div style={styles.editorContainer}>
        <Editor
          height={150}
          theme='vs-dark'
          language='typescript'
          onChange={(code) => updateTypescriptTypes(code)}
          value={typescriptTypes}
        />
      </div>
      <h3 style={{ ...styles.h3, marginTop: '20px' }}>
        Paste Function to Test
      </h3>
      <div style={styles.editorContainer}>
        <Editor
          height={200}
          theme='vs-dark'
          language='typescript'
          onChange={(code) => updateTestFunction(code)}
          value={testFunction}
        />
      </div>
      <h3 style={styles.h3}>Test Prompt</h3>
      <TextArea
        style={styles.textArea}
        onChange={(event) => updateTestCasesPrompt(event.target.value)}
        value={testCasesPrompt}
        autoSize
      />
      <Button
        style={styles.button}
        type='primary'
        loading={testCases}
        disabled={testFunction === ''}
        onClick={() =>
          generateTestCases({
            testCasesPrompt,
          })
        }
      >
        {!testCases ? 'Generate Test Cases' : 'Generating'}{' '}
        {!testCases && <DiffOutlined />}
      </Button>
    </>
  );
};
