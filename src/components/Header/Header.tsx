import { CodeOutlined } from '@ant-design/icons';
import { FC } from 'react';

export const Header: FC = () => {
  return (
    <header className='App-header'>
      <div
        style={{
          display: 'flex',
          marginTop: 10,
        }}
      >
        <CodeOutlined
          className='App-logo'
          style={{
            marginRight: 15,
            marginTop: 5,
          }}
        />
        <div>CODE HELPER</div>
      </div>
    </header>
  );
};
