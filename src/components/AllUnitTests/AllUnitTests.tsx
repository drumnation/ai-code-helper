import { CheckOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import { FC } from 'react';
import { handleClear } from '../../App.logic';
import { TestEditor } from '../../common';
import { useAllUnitTests } from './AllUnitTests.hook';
import { buttonStyles, cardStyle, titleStyles } from './AllUnitTests.styles';

export const AllUnitTests: FC = () => {
  const { allUnitTests, falseCount, handleCopyClickAll, trueCount, unitTests } =
    useAllUnitTests();

  const title = Object.values(unitTests).length > 1 && (
    <>
      <h2 style={titleStyles.h2}>
        {trueCount > 0 && falseCount === 0 && (
          <>
            <span style={titleStyles.passingTests}>
              <span style={titleStyles.passingTestsIcon}>
                <CheckOutlined />
              </span>
              <span style={titleStyles.passingTestsText}>Passing</span>
            </span>
            <span style={titleStyles.passingTestsSeparator}>|</span>
          </>
        )}
        All Unit Tests
      </h2>
      <h4>
        <span style={titleStyles.passingTestsNumber}>{trueCount}</span>{' '}
        <span style={titleStyles.passingTestsText}>Passing Tests</span>|{' '}
        <span style={titleStyles.failingTests}>{falseCount}</span>{' '}
        <span style={titleStyles.passingTestsText}>Failing Tests</span>
      </h4>
    </>
  );

  const CopyClearButtonGroup = (
    <Button.Group>
      <Button
        style={buttonStyles.copyButton}
        type='primary'
        onClick={handleCopyClickAll}
      >
        Copy All
        <CopyOutlined />
      </Button>
      <Button
        style={buttonStyles.clearButton}
        type='primary'
        onClick={() => handleClear()}
      >
        Clear All
        <DeleteOutlined />
      </Button>
    </Button.Group>
  );

  return (
    <Card
      // @ts-ignore
      align='left'
      className='code-card ant-dark'
      style={cardStyle}
      title={title}
      extra={CopyClearButtonGroup}
    >
      <TestEditor value={allUnitTests} />
    </Card>
  );
};
