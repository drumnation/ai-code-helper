import {
  connectorPhrase,
  formatDate,
  parseFallacies,
  transform,
  wordCount,
} from './App.logic';
import { Fallacy, Summary } from './App.types';

describe('parseFallacies', () => {
  it('returns an empty string if fallacies is an empty array', () => {
    const fallacies: Fallacy[] = [];
    const result = parseFallacies(fallacies);
    expect(result).toEqual('');
  });

  it('returns a string with multiple fallacies when there are multiple fallacies', () => {
    const fallacies: Fallacy[] = [
      {
        evidence: 'Example evidence',
        fallacy: 'Example Fallacy',
        explanation: 'Example explanation',
      },
      {
        evidence: 'Another example evidence',
        fallacy: 'Another example Fallacy',
        explanation: 'Another example explanation',
      },
    ];
    const result = parseFallacies(fallacies);
    expect(result).toEqual(
      '• Make the point that when you wrote "Example evidence" that\'s an example of Example Fallacy. Example explanation\n• Make the point that when you wrote "Another example evidence" that\'s an example of Another example Fallacy. Another example explanation\n',
    );
  });
});

test('connectorPhrase > returns "with the argument that " when given "agree"', () => {
  expect(connectorPhrase('agree')).toBe('with the argument that');
});

test('connectorPhrase > returns "with the argument that " when given "disagree"', () => {
  expect(connectorPhrase('disagree')).toBe('with the argument that');
});

test('connectorPhrase > returns "the argument that " when given "deny"', () => {
  expect(connectorPhrase('deny')).toBe('the argument that');
});

test('connectorPhrase > returns "and do not respond to the argument that " when given "ignore"', () => {
  expect(connectorPhrase('ignore')).toBe(
    'and do not respond to the argument that',
  );
});

test('connectorPhrase > returns "Make the counter-argument that " when given "explain"', () => {
  expect(connectorPhrase('explain')).toBe('Make the counter-argument that');
});

describe('transform summary', () => {
  it('transform > returns a string', () => {
    const data: Summary[] = [
      {
        argument: 'Example argument',
        action: 'agree',
        explain: '',
      },
      {
        argument: 'Another example argument',
        action: 'disagree',
        explain: 'Another example explanation',
      },
    ];
    const result = transform(data);
    expect(typeof result).toBe('string');
  });
  it('Test that when given an empty array, the function returns an empty string.', () => {
    const data: Summary[] = [];
    const expectedOutput = '';
    expect(transform(data)).toEqual(expectedOutput);
  });
  it('should return a string with the explain property included when given an array with one object that has an explain property', () => {
    const data: Summary[] = [
      {
        argument: 'Example argument',
        action: 'disagree',
        explain: 'because of reasons',
      },
    ];
    const expectedResult =
      '• Disagree with the argument that example argument\n';
    expect(transform(data)).toEqual(expectedResult);
  });
  it('Test that when given an array with one object that does not have an explain property, the function returns the expected string without the explain property.', () => {
    const data: Summary[] = [
      {
        argument: 'Example argument',
        action: 'ignore',
        explain: '',
      },
    ];
    const expected =
      '• Ignore and do not respond to the argument that example argument\n';
    expect(transform(data)).toEqual(expected);
  });
  test('that when given an array with multiple objects, the function returns a concatenated string with the strings for each object.', () => {
    const data: Summary[] = [
      {
        argument: 'Example argument',
        action: 'agree',
        explain: 'because of reasons',
      },
      {
        argument: 'Another example argument',
        action: 'disagree',
        explain: 'because of other reasons',
      },
    ];
    const expectedOutput =
      '• Agree with the argument that example argument\n• Disagree with the argument that another example argument\n';
    expect(transform(data)).toEqual(expectedOutput);
  });
});

describe('wordCount', () => {
  it('returns 1 when given a string with no spaces', () => {
    expect(wordCount('test')).toBe(1);
  });

  it('returns the correct number of words when given a string with multiple spaces', () => {
    expect(wordCount('this is a test')).toBe(4);
  });

  it('returns the correct number of words when given a string with multiple spaces and leading/trailing spaces', () => {
    expect(wordCount(' this is a test ')).toBe(4);
  });

  it('returns 0 when given an empty string', () => {
    expect(wordCount('')).toBe(0);
  });
});

describe('formatDate', () => {
  test('formatDate > returns a string in the correct format when given a timestamp in milliseconds', () => {
    const timestamp = 1609459200000;
    const expectedResult = '(Dec 31) 7:00 PM';
    const result = formatDate(timestamp);
    expect(result).toBe(expectedResult);
  });
  test('returns correct time string', () => {
    const timestamp = 1609459496678; // January 1, 2021, 12:34:56 PM
    const expected = '(Dec 31) 7:04 PM';
    const result = formatDate(timestamp);
    expect(result).toBe(expected);
  });
  test('that when given a timestamp with hours greater than 12, the function returns a string with the correct time in the PM', () => {
    const timestamp = new Date('January 1, 2021 13:00:00').getTime();
    const expected = '(Jan 1) 1:00 PM';
    const result = formatDate(timestamp);
    expect(result).toBe(expected);
  });
  test('that when given a timestamp with hours equal to 0, the function returns a string with the correct time in the AM, e.g. "Jan 1, 12:00 AM"', () => {
    const timestamp = new Date(2022, 0, 1, 0, 0, 0).getTime();
    expect(formatDate(timestamp)).toBe('(Jan 1) 12:00 AM');
  });
  test('returns a string with a padded minute or second when given a timestamp with a minute or second less than 10', () => {
    const timestamp = new Date('2022-01-01T12:04:00').getTime();
    expect(formatDate(timestamp)).toBe('(Jan 1) 12:04 PM');
  });
  test('returns correct time with padded minutes when given a timestamp with minutes less than 10', () => {
    const timestamp = 1609459200; // January 1, 2021 12:04 AM
    const expectedResult = '(Jan 19) 10:04 AM';
    const result = formatDate(timestamp);
    expect(result).toBe(expectedResult);
  });
});
