import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  PlayCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';

import ButtonGroup from 'antd/es/button/button-group';
import { FC, useEffect, useState } from 'react';
import { useClipboard } from 'use-clipboard-copy';
import { ITestType } from '../../../../types';
import { handleRunTest } from '../../UnitTests.logic';
import {
  handleUpdateOriginalFunction,
  handleUpdateOriginalTest,
} from './UnitTestButtonGroup.logic';

interface UnitTestButtonGroupProps {
  index: number;
  pass: boolean;
  itStatement: string;
  type: ITestType;
}

export const UnitTestButtonGroup: FC<UnitTestButtonGroupProps> = ({
  index,
  pass,
  itStatement,
  type,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const clipboard = useClipboard();

  const handleCopyClick = () => {
    clipboard.copy(itStatement);
    setCopied(true);
  };
  const passFailText =
    pass === undefined ? '' : pass === true ? '(Pass)' : '(Fail)';

  const passFailIcon =
    pass === undefined ? (
      <PlayCircleOutlined />
    ) : pass === true ? (
      <CheckCircleOutlined />
    ) : (
      <CloseCircleOutlined />
    );

  const RunTestButton = (
    <Button
      style={{
        marginTop: 10,
        marginBottom: 10,
        width: 150,
        background:
          pass === undefined ? 'gray' : pass === true ? 'green' : 'red',
      }}
      type='primary'
      onClick={() => handleRunTest(index, itStatement, type)}
    >
      Run Test {passFailText}
      {passFailIcon}
    </Button>
  );

  return (
    <ButtonGroup>
      {RunTestButton}
      {type === 'original' ? (
        <Button
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: 100,
          }}
          type='primary'
          onClick={handleCopyClick}
        >
          {copied ? 'Copied!' : 'Copy'} <CopyOutlined />
        </Button>
      ) : type === 'fixedTest' ? (
        <Button
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: 200,
            background: 'green',
          }}
          type='primary'
          onClick={() => handleUpdateOriginalTest({ index })}
        >
          Update Original Test <SyncOutlined />
        </Button>
      ) : (
        <Button
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: 200,
            background: 'green',
          }}
          type='primary'
          onClick={() => handleUpdateOriginalFunction({ index })}
        >
          Update Original Function <SyncOutlined />
        </Button>
      )}
    </ButtonGroup>
  );
};
