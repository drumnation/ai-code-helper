import {
  CheckOutlined,
  CopyOutlined,
  DeleteOutlined,
  DiffOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import { FC } from 'react';
import useApp from '../App.hooks';

export const AllUnitTests: FC = () => {
  const {
    allUnitTests,
    falseCount,
    handleClear,
    handleClickAllUnitTests,
    handleCopyClickAll,
    loading,
    testCases,
    TestEditor,
    trueCount,
    unitTests,
  } = useApp();
  return (
    <>
      <h2>
        {trueCount > 0 && falseCount === 0 && (
          <>
            <span
              style={{
                color: 'white',
                background: 'green',
                borderRadius: 5,
                padding: 7,
              }}
            >
              <span
                style={{
                  color: 'green ',
                  background: 'white',
                  borderRadius: 10,
                  padding: 3,
                }}
              >
                <CheckOutlined />
              </span>{' '}
              Passing
            </span>
            {'  |  '}
          </>
        )}
        All Unit Tests
      </h2>
      <h4>
        <span style={{ color: 'green' }}>{trueCount}</span> Passing Tests |{' '}
        <span style={{ color: 'red' }}>{falseCount}</span> Failing Tests
      </h4>
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
              style={{
                marginTop: 10,
                marginBottom: 10,
                background: 'red',
              }}
              type='primary'
              onClick={handleClear}
            >
              Clear <DeleteOutlined />
            </Button>
          </Button.Group>
        </div>
      </div>
    </>
  );
};
