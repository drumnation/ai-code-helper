import { ICountPasses, IUnitTests } from '../../types';

export const countPasses = (data: IUnitTests): ICountPasses => {
  let trueCount = 0;
  let falseCount = 0;
  Object.values(data).forEach((obj) => {
    if (obj.pass) {
      trueCount++;
    } else {
      falseCount++;
    }
  });
  return { trueCount, falseCount };
};

export function extractFunctionName(string: string) {
  let match = string.match(/(?:function|const)\s+(\w+)\s*(?:\(|:)/);
  if (match) {
    return match[1];
  }
  return null;
}
