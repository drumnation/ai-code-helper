import React from 'react';
import { UnitTestButtonGroup } from '..';
import { TestEditor } from '../../../../common';

export function OriginalTest({ index, unitTests }) {
  return (
    <>
      <TestEditor
        value={unitTests[index]?.test}
        index={index}
        unitTests={unitTests}
      />
      <UnitTestButtonGroup
        itStatement={unitTests[index]?.test}
        pass={unitTests[index].pass}
        type='original'
        index={index}
      />
    </>
  );
}
