import {
  DiffOutlined,
  LoadingOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import { Button, Card } from 'antd';
import { FC } from 'react';
import { TestEditor } from '../../common';
import {
  FixButtonGroup,
  MonacoDiffEditor,
  UnitTestButtonGroup,
} from './components';

import { useUnitTests } from './UnitTests.hook';
import {
  handleClickAllUnitTests,
  handleClickUnitTests,
} from './UnitTests.logic';

export const UnitTests: FC = () => {
  const {
    testCases,
    testFunction,
    unitTestsLoading,
    unitTests,
    customFixInstructions,
    allUnitTests,
  } = useUnitTests();
  const extraCardButton = (
    <Button
      style={{
        width: 150,
        background: 'green',
      }}
      type='primary'
      loading={allUnitTests}
      onClick={() =>
        handleClickAllUnitTests({
          testCases,
          unitTests,
        })
      }
    >
      Generate All
      {!allUnitTests && <DiffOutlined />}
    </Button>
  );
  const title = <h2 style={{ color: 'white' }}>Test Cases</h2>;
  return (
    testCases.length > 1 && (
      <Card
        // @ts-ignore
        align='left'
        className='code-card ant-dark'
        style={{ width: '100%', marginTop: 30 }}
        title={title}
        extra={extraCardButton}
      >
        {testCases.map((testCase, index) => {
          return (
            <div>
              <h4>
                {!unitTestsLoading[index] ? (
                  <Button style={{ marginRight: 15 }} type='primary'>
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
                  </Button>
                ) : (
                  <Button style={{ marginRight: 15 }} type='primary'>
                    <LoadingOutlined style={{ color: 'black' }} />
                  </Button>
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
                    type='original'
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
                            type='fixedTest'
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
                            type='fixedFunction'
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
      </Card>
    )
  );
};
