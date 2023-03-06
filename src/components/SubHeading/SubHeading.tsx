import { FC } from 'react';

export const SubHeading: FC = () => {
  return (
    <>
      <h3
        style={{
          marginBottom: 0,
          marginTop: 10,
        }}
        className='Cool-font'
      >
        AI Test Writer
      </h3>
      <h4
        style={{
          marginTop: 10,
        }}
      >
        <i>For Generating Lots of Unit Tests</i>
      </h4>
    </>
  );
};
