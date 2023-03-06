import {
  DiffOutlined,
  LoadingOutlined,
  LoginOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Button, Card } from 'antd';
import { FC } from 'react';
import {
  FixTestOutputDiff,
  OriginalTest,
  UpdatedFunctionDiff,
  UpdatedTestDiff,
} from './components';
import { UpdatedTestOutputDiff } from './components/UpdatedTestOutputDiff/UpdatedTestOutputDiff';

import { useUnitTests } from './UnitTests.hook';
import {
  deleteTestCaseAndUnitTest,
  handleClickAllUnitTests,
  handleClickUnitTests,
} from './UnitTests.logic';

export const UnitTests: FC = () => {
  const {
    allUnitTests,
    customFixInstructions,
    hasFixedFunction,
    hasFixedTest,
    hasFixedTestPass,
    hasPassFalse,
    hasTest,
    isTestCaseLengthGreaterThanOne,
    testCases,
    testFunction,
    unitTests,
    unitTestsLoading,
  } = useUnitTests();
  const extraCardButton = (
    <Button
      style={{
        width: 150,
        background: 'green',
      }}
      type='primary'
      loading={allUnitTests}
      onClick={() => {
        handleClickAllUnitTests({
          testCases,
          unitTests,
        });
      }}
    >
      {!allUnitTests ? 'Generate All' : 'Generating'}
      {!allUnitTests && <DiffOutlined />}
    </Button>
  );
  const title = <h2 style={{ color: 'white' }}>Test Cases</h2>;

  const getUnitTestButton = (testCase, index) => (
    <Button
      style={{ marginRight: 15 }}
      type='primary'
      onClick={() =>
        handleClickUnitTests({
          index,
          test: testCase,
          unitTestsLoading,
        })
      }
    >
      <LoginOutlined disabled={testCase === ''} />
    </Button>
  );

  const loadingButton = () => (
    <Button style={{ marginRight: 15 }} type='primary'>
      <LoadingOutlined style={{ color: 'black' }} />
    </Button>
  );

  function deleteButton(index: number) {
    return (
      <Button
        style={{ marginLeft: 10, background: 'red' }}
        type='primary'
        onClick={() => deleteTestCaseAndUnitTest(index)}
      >
        Delete <DeleteOutlined />
      </Button>
    );
  }

  return (
    isTestCaseLengthGreaterThanOne && (
      <Card
        // @ts-ignore
        align='left'
        className='code-card ant-dark'
        style={{ width: '100%', marginTop: 30 }}
        title={title}
        extra={extraCardButton}
      >
        {testCases.map((testCase, index) => (
          <div>
            <h4>
              {!unitTestsLoading[index]
                ? getUnitTestButton(testCase, index)
                : loadingButton()}{' '}
              {testCase}
              {deleteButton(index)}
            </h4>
            {hasTest(index) && (
              <div
                key={`key-${index}`}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <OriginalTest index={index} unitTests={unitTests} />
                {hasPassFalse(index) && (
                  <>
                    <FixTestOutputDiff
                      customFixInstructions={customFixInstructions}
                      index={index}
                      unitTests={unitTests}
                    />
                    {hasFixedTest(index) && (
                      <UpdatedTestDiff unitTests={unitTests} index={index} />
                    )}
                    {hasFixedFunction(index) && (
                      <UpdatedFunctionDiff
                        testFunction={testFunction}
                        unitTests={unitTests}
                        index={index}
                      />
                    )}
                    {hasFixedTestPass(index) && (
                      <UpdatedTestOutputDiff
                        unitTests={unitTests}
                        index={index}
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </Card>
    )
  );
};
