import {
  generateResponseState,
  generateSentenceSuggestions,
  generateSentenceSuggestionsPrompt,
  getApologyPrompt,
  getEmailRewritePrompt,
  getFallaciesPrompt,
  getInterviewPrompt,
  getLanguageComplexityPrompt,
  getPoints,
  getRootPrompt,
  getSendOrReplyPrompt,
  getSentenceSuggestions,
  getStylePrompt,
  getSummary,
  getSummaryArray,
  getSummaryResponsesPrompt,
  getSummaryText,
  getTonePrompt,
  trackResponseEmail,
  trackSentenceSuggestions,
  trackSummary,
} from './App.prompts';
import { v4 } from 'uuid';
import {
  IRootPromptOptions,
  ISelectedSentence,
  ISentenceSuggestion,
  State,
  Summary,
} from './App.types';
import smartlookClient from 'smartlook-client';
import { Interview } from './hooks/useInterviewer';

jest.mock('uuid', () => ({ v4: () => '123456789' }));

describe('getRootPrompt', () => {
  it('returns a State object with the rootPrompt set', async () => {
    const options: IRootPromptOptions = {
      descriptors: [],
      enableWordCount: true,
      fallacies: [],
      includeFallacyFinder: false,
      includeSummaryResponses: false,
      isFirm: true,
      isSendEmail: false,
      languageLevelCategory: '',
      languageLevelSubChoices: [],
      promptWordCount: 0,
      selectedSentence: '',
      interview: [],
      sendEmailPoints: [],
      sentenceSuggestions: [],
      state: {
        sender: 'John',
        receiver: 'Jane',
        thread: 'Example thread',
        email: 'Example email',
        emailResponse: 'Example response',
        fallacies: [
          {
            fallacy: 'Example fallacy',
            evidence: 'Example evidence',
            explanation: 'Example explanation',
          },
        ],
        summary: [
          {
            argument: 'Example argument',
            action: 'agree',
            explain: 'Example explanation',
          },
        ],
        oneSidedArgument: 'Example argument',
        rootPrompt: 'Example prompt',
        combinedKnowledge: 'Example knowledge',
      },
      summary: [],
      writingStyle: '',
    };
    const expectedResult = {
      ...options.state,
      isFirm: true,
      rootPrompt:
        'Please read the email below in quotes and rephrase into an email response that is 0 words long from Jane to John:\n\n"Example email"\nDon\'t apologize or use the words apology, apologize, sorry, or regret.',
    };
    expect(await getRootPrompt(options)).toEqual(expectedResult);
  });
});

describe('getInterviewPrompt', () => {
  const interviewPromptTest = (interview: Interview[], sender, receiver) => {
    expect(getInterviewPrompt(interview, sender, receiver)).toBeTruthy();
  };

  it('Interview prompt test with 1 Interview', () => {
    const interview: Interview[] = [
      {
        question: 'What is your favorite color?',
        answer: 'My favorite color is blue.',
      },
    ];
    interviewPromptTest(interview, 'Nicole', 'Dave');
  });

  it('Interview prompt test with multiple interviews', () => {
    const interview: Interview[] = [
      {
        question: 'What is your favorite color?',
        answer: 'My favorite color is blue.',
      },
      {
        question: 'What is your favorite food?',
        answer: 'My favorite food is pizza.',
      },
    ];
    interviewPromptTest(interview, 'Nicole', 'Dave');
  });

  it('Interview prompt test with 0 interviews', () => {
    const interview: Interview[] = [];
    interviewPromptTest(interview, 'Nicole', 'Dave');
  });
});

// describe('getFallacies', () => {
//   it('getFallacies should return a State object', async () => {
//     const state = {
//       fallacies: [],
//     };
//     const isSendEmail = true;
//     const result = await getFallacies({ state, isSendEmail });

//     expect(result).toBeInstanceOf(Object);
//     expect(result).toHaveProperty('fallacies', expect.any(Array));
//   });

//   it('getFallacies should return an array of fallacies', async () => {
//     const state = {
//       fallacies: [],
//     };
//     const isSendEmail = true;
//     const result = await getFallacies({ state, isSendEmail });

//     expect(result.fallacies).toBeInstanceOf(Array);
//     expect(result.fallacies).toHaveLength(expect.any(Number));
//   });
// });

describe('getSummaryResponsesPrompt', () => {
  it('should return "the below bullet points" when includeSummaryResponses is true and summary is a non-empty array', () => {
    const summary: Summary[] = [
      {
        argument: 'item 1',
        action: 'agree',
        explain: 'Explanation for item 1',
      },
      {
        argument: 'item 2',
        action: 'disagree',
        explain: 'Explanation for item 2',
      },
    ];
    expect(getSummaryResponsesPrompt(true, summary)).toEqual(
      ' the below bullet points ',
    );
  });

  it('should return an empty string when includeSummaryResponses is false and summary is a non-empty array', () => {
    const summary: Summary[] = [
      {
        argument: 'item 1',
        action: 'agree',
        explain: 'Explanation for item 1',
      },
      {
        argument: 'item 2',
        action: 'disagree',
        explain: 'Explanation for item 2',
      },
    ];
    expect(getSummaryResponsesPrompt(false, summary)).toEqual(' ');
  });

  it('should return an empty string when includeSummaryResponses is true and summary is an empty array', () => {
    expect(getSummaryResponsesPrompt(true, [])).toEqual(' ');
  });

  it('should return an empty string when includeSummaryResponses is false and summary is an empty array', () => {
    expect(getSummaryResponsesPrompt(false, [])).toEqual(' ');
  });
});

describe('getSummaryText', () => {
  // it('should return an empty string if includeSummaryResponses is false', () => {
  //   const result = getSummaryText(false, ['some', 'summary', 'text']);
  //   expect(result).toEqual('');
  // });

  it('should return an empty string if summary is an empty array', () => {
    const result = getSummaryText(true, []);
    expect(result).toEqual('');
  });

  // it('should return the transformed summary if includeSummaryResponses is true and summary is not empty', () => {
  //   const result = getSummaryText(true, ['some', 'summary', 'text']);
  //   expect(result).toEqual('\nsome summary text');
  // });
});

describe('getSummary', () => {
  it('should return a GetSummaryReturn object', async () => {
    const state: State = {
      sender: 'John',
      receiver: 'Jane',
      thread: 'Example thread',
      email: 'Example email',
      emailResponse: 'Example response',
      fallacies: [
        {
          fallacy: 'Example fallacy',
          evidence: 'Example evidence',
          explanation: 'Example explanation',
        },
      ],
      summary: [
        {
          argument: 'Example argument',
          action: 'agree',
          explain: 'Example explanation',
        },
      ],
      oneSidedArgument: 'Example argument',
      rootPrompt: 'Example prompt',
      combinedKnowledge: 'Example knowledge',
    };
    const result = await getSummary({ state });
    expect(result).toEqual({
      sender: 'John',
      receiver: 'Jane',
      thread: 'Example thread',
      email: 'Example email',
      emailResponse: 'Example response',
      fallacies: [
        {
          fallacy: 'Example fallacy',
          evidence: 'Example evidence',
          explanation: 'Example explanation',
        },
      ],
      summary: expect.any(Array),
      oneSidedArgument: 'Example argument',
      rootPrompt: 'Example prompt',
      combinedKnowledge: 'Example knowledge',
    });
  }, 30000);
});

describe('trackSummary', () => {
  it('should call smartlookClient.track with the correct arguments', () => {
    const summaryPrompt = 'This is a summary prompt';
    const summary = 'This is a summary';

    // create a mock function for smartlookClient.track
    const mockTrack = jest.fn();
    smartlookClient.track = mockTrack;

    trackSummary(summaryPrompt, summary);

    // assert that smartlookClient.track was called with the correct arguments
    expect(mockTrack).toHaveBeenCalledWith('summarizer', {
      prompt: summaryPrompt,
      response: summary,
    });
  });
});

describe('getSendOrReplyPrompt', () => {
  it('should return the correct prompt for a new email', () => {
    const isSendEmail = true;
    const lengthPrompt = ' that is 200 words or less ';
    const sender = 'test@example.com';
    const receiver = 'test@example.com';
    const summaryResponsesPrompt = ' the below bullet points ';
    const prompt = getSendOrReplyPrompt(
      isSendEmail,
      lengthPrompt,
      sender,
      receiver,
      summaryResponsesPrompt,
    );
    expect(prompt).toBe(
      'Please read the following points and rephrase into an email that is 200 words or less from test@example.com to test@example.com:',
    );
  });
  it('should return the correct prompt for a reply email', () => {
    const isSendEmail = false;
    const lengthPrompt = ' that is 200 words or less ';
    const sender = 'test@example.com';
    const receiver = 'test@example.com';
    const summaryResponsesPrompt = ' the below bullet points ';
    const prompt = getSendOrReplyPrompt(
      isSendEmail,
      lengthPrompt,
      sender,
      receiver,
      summaryResponsesPrompt,
    );
    expect(prompt).toBe(
      'Please read the email below in quotes and rephrase the below bullet points into an email response that is 200 words or less from test@example.com to test@example.com:',
    );
  });
});

describe('getStylePrompt', () => {
  it('should return a string with the correct writing style', () => {
    const writingStyle = 'Conversational';
    const stylePrompt = getStylePrompt(writingStyle);
    expect(stylePrompt).toBe('a conversational writing style');
  });

  it('should return an empty string for the "No Style Change" writing style', () => {
    const writingStyle = 'No Style Change';
    const stylePrompt = getStylePrompt(writingStyle);
    expect(stylePrompt).toBe('');
  });
});

describe('getTonePrompt', () => {
  it('should return a string with the correct tone descriptor', () => {
    const descriptors = ['happy', 'excited'];
    const tonePrompt = getTonePrompt(descriptors);
    expect(tonePrompt).toBe('a tone that is happy, and excited');
  });

  it('should handle a single descriptor correctly', () => {
    const descriptors = ['happy'];
    const tonePrompt = getTonePrompt(descriptors);
    expect(tonePrompt).toBe('a tone that is happy');
  });

  it('should handle an empty array correctly', () => {
    const descriptors = [];
    const tonePrompt = getTonePrompt(descriptors);
    expect(tonePrompt).toBe('');
  });
});

describe('getSummaryArray', () => {
  it('should return an array of summary objects', () => {
    const summary_ = 'first point; second point; third point';
    const summaryArray = getSummaryArray(summary_);
    expect(summaryArray).toEqual([
      {
        action: 'ignore',
        explain: '',
        argument: 'first point',
        key: expect.any(String),
      },
      {
        action: 'ignore',
        explain: '',
        argument: 'second point',
        key: expect.any(String),
      },
      {
        action: 'ignore',
        explain: '',
        argument: 'third point',
        key: expect.any(String),
      },
    ]);
  });

  it('should trim leading whitespace from the argument field', () => {
    const summary_ = '  first point; second point; third point';
    const summaryArray = getSummaryArray(summary_);
    expect(summaryArray).toEqual([
      {
        action: 'ignore',
        explain: '',
        argument: 'first point',
        key: expect.any(String),
      },
      {
        action: 'ignore',
        explain: '',
        argument: 'second point',
        key: expect.any(String),
      },
      {
        action: 'ignore',
        explain: '',
        argument: 'third point',
        key: expect.any(String),
      },
    ]);
  });
});

describe('getSentenceSuggestions', () => {
  it('should generate and return new sentence suggestions', async () => {
    const sendEmailPoints = ['sentence 1', 'sentence 2', 'sentence 3'];
    const index = 1;
    const sentenceSuggestions = {
      0: {},
      1: {},
      2: {},
    };
    const temperature = 0.5;

    const expected = {
      0: {},
      1: {
        '123': {
          key: '123',
          selected: false,
          suggestion: 'suggestion 1',
        },
        '456': {
          key: '456',
          selected: false,
          suggestion: 'suggestion 2',
        },
      },
      2: {},
    };

    const mockCallChatGPT = jest
      .fn()
      .mockResolvedValue(JSON.stringify(['suggestion 1', 'suggestion 2']));
    const mockTrackSentenceSuggestions = jest.fn();
    const mockGenerateSentenceSuggestions = jest.fn().mockReturnValue(expected);

    const result = await getSentenceSuggestions({
      sendEmailPoints,
      index,
      sentenceSuggestions,
      temperature,
      callChatGPT: mockCallChatGPT,
      trackSentenceSuggestions: mockTrackSentenceSuggestions,
      generateSentenceSuggestions: mockGenerateSentenceSuggestions,
    });

    expect(result).toEqual(expected);
  });

  it('should call callChatGPT with the correct arguments', async () => {
    const sendEmailPoints = ['sentence 1', 'sentence 2', 'sentence 3'];
    const index = 1;
    const sentenceSuggestions = {
      0: {},
      1: {},
      2: {},
    };
    const temperature = 0.5;

    const expectedPrompt =
      'Write 5 different variations, rephrasing the following sentence in random professional styles, random language complexities, and random tone. Format as an array of strings.\n\n"sentence 2\n\nConvert to stringified json."';

    const mockCallChatGPT = jest
      .fn()
      .mockResolvedValue(JSON.stringify(['suggestion 1', 'suggestion 2']));
    const mockTrackSentenceSuggestions = jest.fn();
    const mockGenerateSentenceSuggestions = jest.fn();

    await getSentenceSuggestions({
      sendEmailPoints,
      index,
      sentenceSuggestions,
      temperature,
      callChatGPT: mockCallChatGPT,
      trackSentenceSuggestions: mockTrackSentenceSuggestions,
      generateSentenceSuggestions: mockGenerateSentenceSuggestions,
    });

    expect(mockCallChatGPT).toHaveBeenCalledWith(expectedPrompt, temperature);
  });
});

describe('generateSentenceSuggestionsPrompt', () => {
  it('should return a string with the correct sentence and instructions', () => {
    const sendEmailPoints = [
      'This is a test sentence.',
      'This is another test sentence.',
    ];
    const index = 1;
    const expected =
      'Write 5 different variations, rephrasing the following sentence in random professional styles, random language complexities, and random tone. Format as an array of strings.\n\n"This is another test sentence.\n\nConvert to stringified json."';
    expect(generateSentenceSuggestionsPrompt(sendEmailPoints, index)).toEqual(
      expected,
    );
  });

  it('should handle sentences with special characters correctly', () => {
    const sendEmailPoints = [
      'This is a test sentence with a "quote".',
      'This is another test sentence.',
    ];
    const index = 0;
    const expected =
      'Write 5 different variations, rephrasing the following sentence in random professional styles, random language complexities, and random tone. Format as an array of strings.\n\n"This is a test sentence with a "quote".\n\nConvert to stringified json."';
    expect(generateSentenceSuggestionsPrompt(sendEmailPoints, index)).toEqual(
      expected,
    );
  });
});

describe('generateSentenceSuggestions', () => {
  it('should generate new sentence suggestions for the correct index', () => {
    const sendEmailPoints = ['point 1', 'point 2', 'point 3'];
    const index = 1;
    const suggestions = {
      0: {},
      1: {
        '123': {
          key: '123',
          selected: false,
          suggestion: 'suggestion 1',
        },
        '456': {
          key: '456',
          selected: false,
          suggestion: 'suggestion 2',
        },
      },
      2: {},
    };
    const sentenceSuggestions_ = JSON.stringify([
      'suggestion 3',
      'suggestion 4',
    ]);
    const expected = {
      0: {},
      1: {
        '123': {
          key: '123',
          selected: false,
          suggestion: 'suggestion 1',
        },
        '456': {
          key: '456',
          selected: false,
          suggestion: 'suggestion 2',
        },
        [v4()]: {
          key: v4(),
          selected: false,
          suggestion: 'suggestion 3',
        },
        [v4()]: {
          key: v4(),
          selected: false,
          suggestion: 'suggestion 4',
        },
      },
      2: {},
    };

    expect(
      generateSentenceSuggestions(
        sendEmailPoints,
        index,
        // @ts-ignore
        suggestions,
        sentenceSuggestions_,
      ),
    ).toEqual(expect.objectContaining(expected));
  });

  it('should not modify the original suggestions object', () => {
    const sendEmailPoints = ['point 1', 'point 2', 'point 3'];
    const index = 1;
    const suggestions = {
      0: {},
      2: {},
    };
    const sentenceSuggestions_ = JSON.stringify([
      'suggestion 1',
      'suggestion 2',
    ]);
    generateSentenceSuggestions(
      sendEmailPoints,
      index,
      // @ts-ignore
      suggestions,
      sentenceSuggestions_,
    );
    expect(suggestions).toEqual({
      0: {},
      2: {},
    });
  });

  it('should return an empty object if sendEmailPoints is empty', () => {
    const sendEmailPoints = [];
    const index = 1;
    const suggestions = {
      0: {},
      2: {},
    };
    const sentenceSuggestions_ = JSON.stringify([
      'suggestion 1',
      'suggestion 2',
    ]);
    expect(
      generateSentenceSuggestions(
        sendEmailPoints,
        index,
        // @ts-ignore
        suggestions,
        sentenceSuggestions_,
      ),
    ).toEqual({});
  });
});

describe('trackSentenceSuggestions', () => {
  it('should call smartlookClient.track with the correct arguments', () => {
    // Mock the smartlookClient.track function
    const mockTrack = jest.fn();
    const smartlookClient = {
      track: mockTrack,
    };
    trackSentenceSuggestions(smartlookClient, 'prompt text', 'response text');
    expect(mockTrack).toHaveBeenCalledWith('sentenceSuggestions', {
      prompt: 'prompt text',
      response: 'response text',
    });
  });
});

describe('getLanguageComplexityPrompt', () => {
  it('returns the correct language complexity prompt', () => {
    expect(getLanguageComplexityPrompt('Easy to Understand', [])).toEqual(
      'using language that is easy to understand',
    );
    expect(
      getLanguageComplexityPrompt('Easy to Understand', ['Simple']),
    ).toEqual('using language that is easy to understand and Simple');
    expect(getLanguageComplexityPrompt('Ignore Complexity', [])).toEqual('');
  });
});

describe('getEmailRewritePrompt', () => {
  it('returns an empty string if no prompts are provided', () => {
    const stylePrompt = '';
    const languageComplexityPrompt = '';
    const tonePrompt = '';
    const result = getEmailRewritePrompt(
      stylePrompt,
      languageComplexityPrompt,
      tonePrompt,
    );
    expect(result).toEqual('');
  });

  describe('getApologyPrompt', () => {
    it('should return an apology prompt when isFirm is true and isSendEmail is false', () => {
      expect(getApologyPrompt(true, false)).toBe(
        `\nDon't apologize or use the words apology, apologize, sorry, or regret.`,
      );
    });

    it('should return an empty string when isFirm is false and isSendEmail is false', () => {
      expect(getApologyPrompt(false, false)).toBe('');
    });

    it('should return an empty string when isFirm is true and isSendEmail is true', () => {
      expect(getApologyPrompt(true, true)).toBe('');
    });

    it('should return an empty string when isFirm is false and isSendEmail is true', () => {
      expect(getApologyPrompt(false, true)).toBe('');
    });
  });

  it('returns a prompt with only the tone prompt if only the tone prompt is provided', () => {
    const stylePrompt = '';
    const languageComplexityPrompt = '';
    const tonePrompt = 'a persuasive tone';
    const result = getEmailRewritePrompt(
      stylePrompt,
      languageComplexityPrompt,
      tonePrompt,
    );
    expect(result).toEqual('\n\nRewrite this email with a persuasive tone.');
  });

  it('returns a prompt with all prompts if all prompts are provided', () => {
    const stylePrompt = 'a formal writing style';
    const languageComplexityPrompt =
      'using language that is easy to understand';
    const tonePrompt = 'a persuasive tone';
    const result = getEmailRewritePrompt(
      stylePrompt,
      languageComplexityPrompt,
      tonePrompt,
    );
    expect(result).toEqual(
      '\n\nRewrite this email with a formal writing style using language that is easy to understand and a persuasive tone.',
    );
  });
});

describe('getFallaciesPrompt', () => {
  it('returns an empty string if includeFallacyFinder is false', () => {
    const includeFallacyFinder = false;
    const fallacies = [
      {
        evidence: 'Example evidence',
        fallacy: 'Example Fallacy',
        explanation: 'Example explanation',
      },
    ];
    expect(getFallaciesPrompt(includeFallacyFinder, fallacies)).toEqual('');
  });

  it('returns an empty string if fallacies is an empty array', () => {
    const includeFallacyFinder = true;
    const fallacies = [];
    expect(getFallaciesPrompt(includeFallacyFinder, fallacies)).toEqual('');
  });

  it('returns a string with fallacies if includeFallacyFinder is true and fallacies is a non-empty array', () => {
    const includeFallacyFinder = true;
    const fallacies = [
      {
        evidence: 'Example evidence',
        fallacy: 'Example Fallacy',
        explanation: 'Example explanation',
      },
    ];
    expect(getFallaciesPrompt(includeFallacyFinder, fallacies)).toEqual(
      '\n• Make the point that when you wrote "Example evidence" that\'s an example of Example Fallacy. Example explanation\n',
    );
  });

  it('returns a string with the correct formatting for the fallacies', () => {
    const includeFallacyFinder = true;
    const fallacies = [
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
    expect(getFallaciesPrompt(includeFallacyFinder, fallacies)).toEqual(
      '\n• Make the point that when you wrote "Example evidence" that\'s an example of Example Fallacy. Example explanation\n• Make the point that when you wrote "Another example evidence" that\'s an example of Another example Fallacy. Another example explanation\n',
    );
  });
});

describe('getPoints', () => {
  it('returns the original point if no suggestion has been selected', () => {
    const sendEmailPoints = ['point 1', 'point 2'];
    const selectedSentence = [undefined, undefined];
    const sentenceSuggestions: ISentenceSuggestion = {
      0: {
        '8678077e-efd5-4cee-90c9-cc45366279e2': {
          selected: false,
          suggestion: 'suggestion 1',
          key: '8678077e-efd5-4cee-90c9-cc45366279e2',
        },
        '7b40627b-f87a-4f61-af85-ed09c89f5d32': {
          selected: false,
          suggestion: 'suggestion 2',
          key: '7b40627b-f87a-4f61-af85-ed09c89f5d32',
        },
      },
      1: {
        '241343fc-aa71-43fd-969c-14d49b90749d': {
          selected: false,
          suggestion: 'suggestion 3',
          key: '241343fc-aa71-43fd-969c-14d49b90749d',
        },
        'b21493fc-f83c-43d9-b27a-11b0a741b1d0': {
          selected: false,
          suggestion: 'suggestion 4',
          key: 'b21493fc-f83c-43d9-b27a-11b0a741b1d0',
        },
      },
    };

    const result = getPoints(
      sendEmailPoints,
      selectedSentence,
      sentenceSuggestions,
    );
    expect(result).toEqual('• point 1\n• point 2');
  });

  it('returns the selected suggestion if one has been selected', () => {
    const sendEmailPoints = ['point 1', 'point 2'];
    const selectedSentence: ISelectedSentence = {
      0: '7b40627b-f87a-4f61-af85-ed09c89f5d32',
      1: '241343fc-aa71-43fd-969c-14d49b90749d',
    };
    const sentenceSuggestions: ISentenceSuggestion = {
      0: {
        '8678077e-efd5-4cee-90c9-cc45366279e2': {
          selected: false,
          suggestion: 'suggestion 1',
          key: '8678077e-efd5-4cee-90c9-cc45366279e2',
        },
        '7b40627b-f87a-4f61-af85-ed09c89f5d32': {
          selected: false,
          suggestion: 'suggestion 2',
          key: '7b40627b-f87a-4f61-af85-ed09c89f5d32',
        },
      },
      1: {
        '241343fc-aa71-43fd-969c-14d49b90749d': {
          selected: false,
          suggestion: 'suggestion 3',
          key: '241343fc-aa71-43fd-969c-14d49b90749d',
        },
        'b21493fc-f83c-43d9-b27a-11b0a741b1d0': {
          selected: false,
          suggestion: 'suggestion 4',
          key: 'b21493fc-f83c-43d9-b27a-11b0a741b1d0',
        },
      },
    };

    const result = getPoints(
      sendEmailPoints,
      selectedSentence,
      sentenceSuggestions,
    );
    expect(result).toEqual('• suggestion 2\n• suggestion 3');
  });

  it('returns "WRITE A POINT HERE" with the correct index number when given an array of sendEmailPoints with an empty string', () => {
    const sendEmailPoints = ['', '', '', ''];
    const selectedSentence = undefined;
    const sentenceSuggestions = undefined;
    const result = getPoints(
      sendEmailPoints,
      selectedSentence,
      sentenceSuggestions,
    );
    expect(result).toEqual(
      '• WRITE A POINT HERE (1)\n• WRITE A POINT HERE (2)\n• WRITE A POINT HERE (3)\n• WRITE A POINT HERE (4)',
    );
  });
});

const testState: State = {
  sender: 'test@example.com',
  receiver: 'test@example.com',
  thread: 'test thread',
  email: 'test email',
  emailResponse: 'test email response',
  fallacies: [
    {
      fallacy: 'test fallacy',
      evidence: 'test evidence',
      explanation: 'test explanation',
    },
  ],
  summary: [
    {
      argument: 'test argument',
      action: 'agree',
      explain: 'test explain',
    },
  ],
  oneSidedArgument: 'test one sided argument',
  rootPrompt: 'test root prompt',
  combinedKnowledge: 'test combined knowledge',
};

describe('trackResponseEmail', () => {
  it('should call smartlookClient.track with the correct arguments', () => {
    const smartlookClientTrackSpy = jest.spyOn(smartlookClient, 'track');
    const prompt = 'What is the weather like today?';
    const response = 'It is sunny and warm.';
    trackResponseEmail(prompt, response);
    expect(smartlookClientTrackSpy).toHaveBeenCalledWith('response email', {
      prompt,
      response,
    });
  });
});

describe('generateResponseState', () => {
  it('should return a new state object with the emailResponse field set', () => {
    const emailResponse = 'Hello, World!';
    const newState = generateResponseState(testState, emailResponse);
    expect(newState).toEqual({
      ...testState,
      emailResponse: 'Hello, World!',
    });
  });

  it('should trim leading whitespace from the emailResponse field', () => {
    const emailResponse = '  Hello, World!';
    const newState = generateResponseState(testState, emailResponse);
    expect(newState).toEqual({
      ...testState,
      emailResponse: 'Hello, World!',
    });
  });
});
