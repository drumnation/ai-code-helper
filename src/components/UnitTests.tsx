import { LoadingOutlined, LoginOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { FixButtonGroup, UnitTestButtonGroup } from '.';
import useApp from '../App.hooks';

export const UnitTests: FC = () => {
  const {
    clipboard,
    customFixInstructions,
    handleChangeCustomFixInstruction,
    handleClickFixFunction,
    handleClickFixTest,
    handleClickUnitTests,
    handleRunTest,
    handleUpdateOriginalFunction,
    handleUpdateOriginalTest,
    loading,
    MonacoDiffEditor,
    testCases,
    TestEditor,
    testFunction,
    unitTests,
    unitTestsLoading,
  } = useApp();

  return (
    <>
      <h2>Test Cases</h2>
      {testCases.map((testCase, index) => {
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
            {unitTests[index]?.test !== undefined && (
              <div
                key={`key-${index}`}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <TestEditor
                  value={unitTests[index]?.test}
                  index={index}
                  unitTests={unitTests}
                />
                <UnitTestButtonGroup
                  itStatement={unitTests[index]?.test}
                  pass={unitTests[index].pass}
                  clipboard={clipboard}
                  type='original'
                  handleRunTest={handleRunTest}
                  index={index}
                />
                {unitTests[index]?.pass === false && (
                  <>
                    <MonacoDiffEditor
                      originalHeading='Expected Output'
                      modifiedHeading='Function Output'
                      original={`${unitTests[index].expectedValue}`}
                      modified={`${unitTests[index].output}`}
                    />
                    {unitTests[index]?.pass === false && (
                      <FixButtonGroup
                        customFixInstructions={customFixInstructions}
                        handleChangeCustomFixInstruction={
                          handleChangeCustomFixInstruction
                        }
                        handleClickFixTest={handleClickFixTest}
                        handleClickFixFunction={handleClickFixFunction}
                        loading={loading}
                        index={index}
                        unitTests={unitTests}
                      />
                    )}
                    {unitTests[index]?.fixedTest?.test !== undefined && (
                      <>
                        <MonacoDiffEditor
                          originalHeading='Original Test'
                          modifiedHeading='Updated Test'
                          original={`${unitTests[index]?.test}`}
                          modified={`${unitTests[index]?.fixedTest?.test}`}
                        />
                        <UnitTestButtonGroup
                          pass={unitTests[index]?.fixedTest?.pass}
                          itStatement={unitTests[index]?.fixedTest?.test}
                          clipboard={clipboard}
                          type='fixedTest'
                          handleUpdateOriginalTest={handleUpdateOriginalTest}
                          handleRunTest={handleRunTest}
                          index={index}
                        />
                      </>
                    )}
                    {unitTests[index]?.fixedFunction?.test !== undefined && (
                      <>
                        <MonacoDiffEditor
                          originalHeading='Original Function'
                          modifiedHeading='Updated Function'
                          original={`${testFunction}`}
                          modified={`${unitTests[index]?.fixedFunction?.test}`}
                        />
                        <UnitTestButtonGroup
                          pass={unitTests[index]?.fixedFunction?.pass}
                          itStatement={unitTests[index]?.fixedFunction?.test}
                          clipboard={clipboard}
                          type='fixedFunction'
                          handleUpdateOriginalFunction={
                            handleUpdateOriginalFunction
                          }
                          handleRunTest={handleRunTest}
                          index={index}
                        />
                      </>
                    )}
                    {unitTests[index]?.fixedTest?.pass !== undefined && (
                      <>
                        <MonacoDiffEditor
                          originalHeading='Expected Output'
                          modifiedHeading='Function Output'
                          original={`${unitTests[index].fixedTest.expectedValue}`}
                          modified={`${unitTests[index].fixedTest.output}`}
                        />
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};
