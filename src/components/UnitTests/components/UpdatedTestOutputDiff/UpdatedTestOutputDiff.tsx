import { MonacoDiffEditor } from '../MonacoDiffEditor';

export function UpdatedTestOutputDiff({ index, unitTests }) {
  return (
    <>
      <MonacoDiffEditor
        originalHeading='Expected Output'
        modifiedHeading='Function Output'
        original={`${unitTests[index].fixedTest.expectedValue}`}
        modified={`${unitTests[index].fixedTest.output}`}
      />
    </>
  );
}
