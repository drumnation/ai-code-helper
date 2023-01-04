import React from 'react';

import { Button, Input, Table } from 'antd';
import { Summary } from '../../App.types';

const SummaryTable: React.FC<{
  data: Summary[];
  updateRecord;
}> = ({ data, updateRecord }) => {
  const columns = [
    {
      title: 'Argument',
      dataIndex: 'argument',
      key: 'argument',
      width: '100%',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: '100%',
      render: (text: string, record: Summary, index: number) => (
        <>
          <Button.Group>
            <Button
              style={{ width: 100 }}
              type={record.action === 'ignore' ? 'primary' : 'default'}
              onClick={() => updateRecord(index, 'action', 'ignore')}
            >
              Ignore
            </Button>
            <Button
              style={{ width: 100 }}
              type={record.action === 'deny' ? 'primary' : 'default'}
              onClick={() => updateRecord(index, 'action', 'deny')}
            >
              Deny
            </Button>
          </Button.Group>
          <Button.Group>
            <Button
              style={{ width: 100 }}
              type={record.action === 'agree' ? 'primary' : 'default'}
              onClick={() => updateRecord(index, 'action', 'agree')}
            >
              Agree
            </Button>
            <Button
              style={{ width: 100 }}
              type={record.action === 'disagree' ? 'primary' : 'default'}
              onClick={() => updateRecord(index, 'action', 'disagree')}
            >
              Disagree
            </Button>
          </Button.Group>

          <Button
            style={{ width: 200 }}
            type={record.action === 'explain' ? 'primary' : 'default'}
            onClick={() => updateRecord(index, 'action', 'explain')}
          >
            Explain
          </Button>
          <div style={{ height: 10 }} />
          <Input.TextArea
            style={{ height: '100%' }}
            disabled={record.action !== 'explain'}
            placeholder='Enter explain'
            onChange={(event) =>
              updateRecord(index, 'explain', 'explain', event.target.value)
            }
          />
        </>
      ),
    },
  ];

  return (
    <Table
      pagination={false}
      style={{ width: '100%', padding: '0px 0px' }}
      columns={columns}
      dataSource={data}
    />
  );
};

export default SummaryTable;
