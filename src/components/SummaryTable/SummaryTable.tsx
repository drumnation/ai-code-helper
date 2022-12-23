import React from 'react';

import { Button, Input, Table } from 'antd';
import { FactCheckedThreadSummary } from '../../App.types';

const SummaryTable: React.FC<{
  data: FactCheckedThreadSummary[];
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
      width: 286,
      render: (
        text: string,
        record: FactCheckedThreadSummary,
        index: number,
      ) => (
        <>
          <Button.Group>
            <Button
              type={record.action === 'agree' ? 'primary' : 'default'}
              onClick={() => updateRecord(index, 'action', 'agree')}
            >
              Agree
            </Button>
            <Button
              type={record.action === 'deny' ? 'primary' : 'default'}
              onClick={() => updateRecord(index, 'action', 'deny')}
            >
              Deny
            </Button>
            <Button
              type={record.action === 'ignore' ? 'primary' : 'default'}
              onClick={() => updateRecord(index, 'action', 'ignore')}
            >
              Ignore
            </Button>
            <Button
              type={record.action === 'rebuttal' ? 'primary' : 'default'}
              onClick={() => updateRecord(index, 'action', 'rebuttal')}
            >
              Rebuttal
            </Button>
          </Button.Group>
          <div style={{ height: 10 }} />
          <Input.TextArea
            style={{ height: '100%' }}
            disabled={record.action !== 'rebuttal'}
            placeholder='Enter rebuttal'
            onClick={(text) => updateRecord(index, 'action', 'rebuttal', text)}
          />
        </>
      ),
    },
  ];

  return (
    <Table
      pagination={false}
      style={{ width: '100%' }}
      columns={columns}
      dataSource={data}
    />
  );
};

export default SummaryTable;
