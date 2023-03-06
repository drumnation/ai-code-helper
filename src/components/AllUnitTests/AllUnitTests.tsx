import { CheckOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import { Button, Card } from 'antd';
import { FC } from 'react';
import { handleClear, getNumLines } from '../../App.logic';
import { useAllUnitTests } from './AllUnitTests.hook';
import { buttonStyles, cardStyle, titleStyles } from './AllUnitTests.styles';

export const AllUnitTests: FC = () => {
  const {
    allUnitTests,
    copied,
    cleared,
    falseCount,
    handleCopyClickAll,
    trueCount,
    unitTests,
    handleEditorWillMount,
  } = useAllUnitTests();

  const title = (
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
        {copied ? 'Copied!' : 'Copy All'}
        <CopyOutlined />
      </Button>
      <Button
        style={buttonStyles.clearButton}
        type='primary'
        onClick={() => handleClear()}
      >
        {cleared ? 'Cleared!' : 'Clear All'}
        <DeleteOutlined />
      </Button>
    </Button.Group>
  );

  return (
    Object.values(unitTests).length > 1 && (
      <Card
        // @ts-ignore
        align='left'
        className='code-card ant-dark'
        style={cardStyle}
        title={title}
        extra={CopyClearButtonGroup}
      >
        <Editor
          beforeMount={handleEditorWillMount}
          theme='vs-dark'
          language='typescript'
          value={allUnitTests}
          height={getNumLines(allUnitTests) * 19}
        />
      </Card>
    )
  );
};
