import { MonacoDiffEditor } from '../MonacoDiffEditor';
import { UnitTestButtonGroup } from '../UnitTestsButtonGroup';

export function UpdatedTestDiff({ unitTests, index }) {
  return (
    <>
      <MonacoDiffEditor
        originalHeading='Original Test'
        modifiedHeading='Updated Test'
        original={`${unitTests[index]?.test}`}
        modified={`${unitTests[index]?.fixedTest?.test}`}
      />
      <UnitTestButtonGroup
        pass={unitTests[index]?.fixedTest?.pass}
        itStatement={unitTests[index]?.fixedTest?.test}
        type='fixedTest'
        index={index}
      />
    </>
  );
}
