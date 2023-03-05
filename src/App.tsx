import './App.css';

import { Card } from 'antd';
import {
  AllUnitTests,
  GenerateTestCases,
  Header,
  SubHeading,
  UnitTests,
} from './components';
import { FC } from 'react';

const App: FC = () => {
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
        >
          <Card.Meta
            title={<h2 style={{ color: 'white' }}>Test a Function</h2>}
          />
          <GenerateTestCases />
          <UnitTests />
          <AllUnitTests />
        </Card>
      </div>
    </div>
  );
};

export default App;
