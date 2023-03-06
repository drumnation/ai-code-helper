/* eslint-disable no-eval */

import {
  updateTestCases,
  updateTestFunction,
  updateTypescriptTypes,
} from './redux/testCases.slice';
import { updateUnitTests } from './redux/unitTests.slice';

export function indentCode(code: string) {
  if (code.trim() === '') {
    return '';
  }
  const lines = code.split('\n');
  let indentLevel = 0;
  let result = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('}')) {
      indentLevel--;
    }

    if (line.endsWith('{')) {
      result += '  '.repeat(indentLevel);
      result += line + '\n';
      indentLevel++;
    } else {
      result += '  '.repeat(indentLevel);
      result += line;
      if (i !== lines.length - 1 && result[result.length - 1] !== '\n') {
        result += '\n';
      }
    }
  }

  return result;
}

export function removeExport(funcStr: string) {
  const pattern = /^export\s+(function\s+\w+)/;
  return funcStr.replace(pattern, '$1');
}

export function keepMarkdownCodeBlock(markdown: string): string {
  return markdown.replace(/```ts\n([\s\S]*?)\n```/g, '$1');
}

export function stripType(arg: string): string {
  return arg.replace(/:[^,)]+/g, '');
}

export function stripTypeFromFunction(funcStr: string): Function {
  const strippedArgList = funcStr
    .match(/\(([^)]+)\)/)[1]
    .split(',')
    .map(stripType)
    .join(',');
  const strippedFuncStr = funcStr.replace(
    /\(([^)]+)\)/,
    `(${strippedArgList})`,
  );
  return eval(`(${strippedFuncStr})`);
}

export function getNumLines(text: string) {
  const lines = text?.split('\n');
  return lines.length;
}

export const handleClear = (setCleared?: (cleared: boolean) => void) => {
  updateTypescriptTypes('');
  updateTestFunction('');
  updateTestCases([]);
  updateUnitTests([]);
  localStorage.removeItem('typescriptTypes');
  localStorage.removeItem('testFunction');
  localStorage.removeItem('testCases');
  localStorage.removeItem('unitTests');
  setCleared && setCleared(true);
};
