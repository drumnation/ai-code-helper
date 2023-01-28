import './App.css';

import {
  CodeOutlined,
  DeleteOutlined,
  DiffOutlined,
  LoadingOutlined,
  LoginOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { Button, Card } from 'antd';

import Editor from '@monaco-editor/react';
import TextArea from 'antd/es/input/TextArea';

import useApp from './App.hooks';

function App() {
  const {
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
  } = useApp();

  return (
    <div className='App'>
      <header className='App-header'>
        <div style={{ display: 'flex', marginTop: 10 }}>
          <CodeOutlined
            className='App-logo'
            style={{ marginRight: 15, marginTop: 5 }}
          />
          <div>CODE HELPER</div>
        </div>
      </header>
      <div className='App-body'>
        <h3 style={{ marginBottom: 0, marginTop: 10 }} className='Cool-font'>
          AI Test Writer
        </h3>
        <h4 style={{ marginTop: 10 }}>
          <i>For Generating Lots of Unit Tests</i>
        </h4>
        <Card
          className='code-card ant-dark'
          // @ts-ignore
          align='left'
          style={{ width: '100%' }}
        >
          <Card.Meta
            title={<div style={{ color: 'white' }}>Create Tests</div>}
            description='description'
          />
          <h3>Paste Typescript Types</h3>
          <div style={{ border: '3px solid black' }}>
            <Editor
              height={150}
              theme='vs-dark'
              language='typescript'
              onChange={(code) => handleChangeTypeScriptTypes(code)}
              value={typescriptTypes}
            />
          </div>
          <h3>Paste Function to Test</h3>
          <div style={{ border: '3px solid black' }}>
            <Editor
              height={150}
              theme='vs-dark'
              language='typescript'
              onChange={(code) => handleChangeTestFunction(code)}
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
            style={{ marginTop: 20 }}
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
          <h3>Test Cases</h3>
          {testCases.map((testCase, index) => {
            const handleCopyClick = () => {
              clipboard.copy(unitTests[index]);
            };
            return (
              <div>
                <h4>
                  {!unitTestsLoading[index] ? (
                    <LoginOutlined
                      disabled={testCase === ''}
                      onClick={() =>
                        handleClickUnitTests({
                          index,
                          test: testCase,
                          unitTestsLoading,
                        })
                      }
                    />
                  ) : (
                    <LoadingOutlined style={{ color: 'lightgrey' }} />
                  )}{' '}
                  {testCase}
                </h4>
                {unitTests[index] !== undefined && (
                  <div
                    key={`key-${index}`}
                    style={{ display: 'flex', flexDirection: 'column' }}
                  >
                    <TestEditor value={unitTests[index]} />
                    <Button
                      style={{ marginTop: 10, marginBottom: 10, width: 100 }}
                      type='primary'
                      onClick={handleCopyClick}
                    >
                      Copy <CopyOutlined />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
          <h3>All Cases</h3>
          <div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <TestEditor value={allUnitTests} />
              <Button.Group>
                <Button
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    width: 150,
                    background: 'green',
                  }}
                  type='primary'
                  loading={loading.allUnitTests}
                  onClick={() =>
                    handleClickAllUnitTests({
                      testCases,
                      unitTests,
                    })
                  }
                >
                  Generate All
                  {!loading.allUnitTests && <DiffOutlined />}
                </Button>
                <Button
                  style={{ marginTop: 10, marginBottom: 10, width: 120 }}
                  type='primary'
                  onClick={handleCopyClickAll}
                >
                  Copy All
                  <CopyOutlined />
                </Button>
                <Button
                  style={{ marginTop: 10, marginBottom: 10, background: 'red' }}
                  type='primary'
                  onClick={handleClear}
                >
                  Clear <DeleteOutlined />
                </Button>
              </Button.Group>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default App;
