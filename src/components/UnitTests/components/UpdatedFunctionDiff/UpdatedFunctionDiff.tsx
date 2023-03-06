import React from 'react';
import { MonacoDiffEditor } from '../MonacoDiffEditor';
import { UnitTestButtonGroup } from '../UnitTestsButtonGroup';

export function UpdatedFunctionDiff({ testFunction, index, unitTests }) {
  return (
    <>
      <MonacoDiffEditor
        originalHeading='Original Function'
        modifiedHeading='Updated Function'
        original={`${testFunction}`}
        modified={`${unitTests[index]?.fixedFunction?.test}`}
      />
      <UnitTestButtonGroup
        pass={unitTests[index]?.fixedFunction?.pass}
        itStatement={unitTests[index]?.fixedFunction?.test}
        type='fixedFunction'
        index={index}
      />
    </>
  );
}
