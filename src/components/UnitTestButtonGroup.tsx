import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  PlayCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';

import ButtonGroup from 'antd/es/button/button-group';

export function UnitTestButtonGroup({
  clipboard,
  handleRunTest,
  index,
  pass,
  itStatement,
  handleUpdateOriginalTest = ({ index }) => {},
  handleUpdateOriginalFunction = ({ index }) => {},
  type,
}) {
  const handleCopyClick = () => {
    clipboard.copy(itStatement);
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
          Copy <CopyOutlined />
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
}
