import { indentCode, removeExport } from './App.logic';

describe('indentCode', () => {
  it('Should correctly indent code with one level of indentation', () => {
    const code = `function add(a, b) {
    return a + b;
  }`;

    const expected = `function add(a, b) {
  return a + b;
}`;

    const result = indentCode(code);

    expect(result).toEqual(expected);
  });

  it('Should correctly indent code with multiple levels of indentation', () => {
    const code = `    function add(a, b) {
      if (a === 0) {
        return b;
      }
      return add(a - 1, b + 1);
    }    `;
    const expected = `function add(a, b) {
  if (a === 0) {
    return b;
  }
  return add(a - 1, b + 1);
}`;
    const result = indentCode(code);
    expect(result).toEqual(expected);
  });

  it('Should correctly indent code with no indentation', () => {
    const code = 'function hello() {\nconsole.log("Hello world");\n}';
    const expected = 'function hello() {\n  console.log("Hello world");\n}';
    const result = indentCode(code);
    expect(result).toEqual(expected);
  });

  it('Should correctly indent code with mixed indentation', () => {
    const code = `function myFunction() {
    if (true) {
    console.log('Hello, world!');
    }
  }`;

    const expected = `function myFunction() {
  if (true) {
    console.log('Hello, world!');
  }
}`;

    expect(indentCode(code)).toEqual(expected);
  });

  it('Should correctly handle empty input', () => {
    const result = indentCode('');
    expect(result).toBe('');
  });

  it('Should correctly handle input with only whitespace', () => {
    const input = '    \n\t   \n ';
    const expectedOutput = '';

    expect(indentCode(input)).toEqual(expectedOutput);
  });

  it('Should correctly handle input with only one line', () => {
    const code = 'const x = 5;';
    const expected = 'const x = 5;';
    const result = indentCode(code);
    expect(result).toEqual(expected);
  });

  it('Should correctly handle input with multiple lines', () => {
    const input = `function foo() {
    if (true) {
      console.log('Hello');
    }
  }`;

    const expectedOutput = `function foo() {
  if (true) {
    console.log('Hello');
  }
}`;

    expect(indentCode(input)).toEqual(expectedOutput);
  });

  it('Should correctly handle input with leading/trailing whitespace on lines', () => {
    const code = `function foo() {
      return 'bar';
    }`;
    const expected = `function foo() {
  return 'bar';
}`;
    expect(indentCode(code)).toEqual(expected);
  });

  it('Should correctly handle input with leading/trailing whitespace on entire input', () => {
    // Arrange
    const code = `function foo() {
  console.log('Hello World!');
}
`;
    const expected = `function foo() {
  console.log('Hello World!');
}
`;

    // Act
    const result = indentCode(code);

    // Assert
    expect(result).toEqual(expected);
  });
});

describe('removeExport', () => {
  it('should remove export keyword from function declaration', () => {
    const funcStr = 'export function foo() { return "bar"; }';
    const expected = 'function foo() { return "bar"; }';
    const result = removeExport(funcStr);
    expect(result).toEqual(expected);
  });

  it('should not remove export keyword from non-function declarations', () => {
    const funcStr = `export const myVar = 'hello';
                   export class MyClass {};
                   export enum MyEnum {};`;
    const result = removeExport(funcStr);
    expect(result).toEqual(funcStr);
  });

  it('should not modify function declaration without export keyword', () => {
    const input = 'function myFunc(): void { console.log("hello world"); }';
    const output = removeExport(input);
    expect(output).toBe(input);
  });

  it('should not modify non-function declarations', () => {
    const input = 'const x = 5;';
    const output = removeExport(input);
    expect(output).toEqual(input);
  });
});
