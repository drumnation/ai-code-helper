import './App.css';

import { Button, Card } from 'antd';
import {
  AllUnitTests,
  GenerateTestCases,
  Header,
  SubHeading,
  UnitTests,
} from './components';
import { FC } from 'react';
import useApp from './App.hooks';
import { DeleteOutlined } from '@ant-design/icons';
import { handleClear } from './App.logic';

const App: FC = () => {
  const { cleared, setCleared } = useApp();
  return (
    <div className='App'>
      <Header />
      <div className='App-body'>
        <SubHeading />
        <Card
          className='code-card ant-dark'
          // @ts-ignore
          align='left'
          style={{ width: '100%' }}
          title={<h2 style={{ color: 'white' }}>Test a Function</h2>}
          extra={
            <Button
              style={{ background: 'red', width: 150 }}
              type='primary'
              onClick={() => handleClear(setCleared)}
            >
              {cleared ? 'Cleared!' : 'Clear'} <DeleteOutlined />
            </Button>
          }
        >
          <GenerateTestCases />
          <UnitTests />
          <AllUnitTests />
        </Card>
      </div>
    </div>
  );
};

export default App;
