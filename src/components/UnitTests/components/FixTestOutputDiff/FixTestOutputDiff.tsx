import React from 'react';
import { FixButtonGroup } from '../FixButtonGroup';
import { MonacoDiffEditor } from '../MonacoDiffEditor';

export function FixTestOutputDiff({ customFixInstructions, index, unitTests }) {
  return (
    <>
      <MonacoDiffEditor
        originalHeading='Expected Output'
        modifiedHeading='Function Output'
        original={`${unitTests[index].expectedValue}`}
        modified={`${unitTests[index].output}`}
      />
      {unitTests[index]?.pass === false && (
        <FixButtonGroup
          customFixInstructions={customFixInstructions}
          index={index}
          unitTests={unitTests}
        />
      )}
    </>
  );
}
