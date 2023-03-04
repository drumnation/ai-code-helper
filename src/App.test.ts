import { indentCode } from './App.logic';

describe('indentCode', () => {
  it('should return an empty string when passed an empty string', () => {
    expect(indentCode('')).toEqual('');
  });

  it('should indent a single line of code', () => {
    const code = 'const foo = () => { return "bar"; }';
    const indentedCode = 'const foo = () => {\n  return "bar";\n}\n';
    expect(indentCode(code)).toEqual(indentedCode);
  });

  it('should indent multiple lines of code with the same indentation level', () => {
    const code = `function myFunc() {
      const myVar = 'hello';
      if (myVar === 'hello') {
        console.log('world');
      }
    }`;
    const expected = `function myFunc() {
  const myVar = 'hello';
  if (myVar === 'hello') {
    console.log('world');
  }
}`;
    const result = indentCode(code);
    expect(result).toEqual(expected);
  });

  it('should indent nested code with increasing indentation levels', () => {
    const code = `function foo() {
      if (true) {
        console.log('Hello');
      }
    }`;

    const expected = `function foo() {
  if (true) {
    console.log('Hello');
  }
}\n`;

    const result = indentCode(code);

    expect(result).toEqual(expected);
  });

  it('should handle code with no indentation', () => {
    const code = `function add(a, b) {
return a + b;
}`;

    const result = indentCode(code);

    expect(result).toEqual(`function add(a, b) {
  return a + b;
}`);
  });

  it('should handle code with different types of whitespace characters', () => {
    const code = `function test() {
  console.log('Hello World');
}`;

    const expected = `function test() {
  console.log('Hello World');
}`;

    const result = indentCode(code);

    expect(result).toEqual(expected);
  });

  it('should handle code with comments', () => {
    const code = `
      // This is a comment
      function myFunction() {
        console.log('Hello World!');
      }
    `;
    const expected = `
      // This is a comment
      function myFunction() {
        console.log('Hello World!');
      }
    `;
    expect(indentCode(code)).toEqual(expected);
  });

  it('should handle code with brackets on the same line', () => {
    const code = `function someFunction() { console.log('Hello World!'); }`;
    const expectedOutput = `function someFunction() {\n  console.log('Hello World!');\n}\n`;

    const result = indentCode(code);

    expect(result).toEqual(expectedOutput);
  });

  it('should handle code with brackets on their own lines', () => {
    const code = `if (a) {
      doSomething();
    }
    else {
      doSomethingElse();
    }`;

    const expected = `if (a) {
      doSomething();
    } else {
      doSomethingElse();
    }\n`;

    expect(indentCode(code)).toEqual(expected);
  });
});
