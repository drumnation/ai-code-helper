import * as App_prompts from '../App.prompts';
// @ponicode
describe('App_prompts.getFallacies', () => {
  test('0', async () => {
    let object2: any = [
      {
        argument: '/path/to/file',
        action: 'Senior Brand Assistant',
        explain: 'http://placeimg.com/640/480/fashion',
      },
      {
        argument: 'C:\\\\path\\to\\file.ext',
        action: 'Principal Implementation Strategist',
        explain: 'http://placeimg.com/640/480/fashion',
      },
      {
        argument: 'path/to/folder/',
        action: 'Senior Brand Assistant',
        explain: 'http://placeimg.com/640/480/fashion',
      },
      {
        argument: 'path/to/file.ext',
        action: 'deny',
        explain: 'http://placeimg.com/640/480/fashion',
      },
      {
        argument: 'C:\\\\path\\to\\folder\\',
        action: 'Customer Metrics Consultant',
        explain: 'http://placeimg.com/640/480/fashion',
      },
    ];
    let object: any = [
      { fallacy: 'Secured', evidence: 'Harbors', explanation: 'canceled' },
      { fallacy: 'Face to face', evidence: 'Lights', explanation: 'draft' },
      { fallacy: 'Secured', evidence: 'Port', explanation: 'done' },
    ];
    await App_prompts.getFallacies({
      state: {
        sender: '192.168.1.5',
        receiver: 'Marketing',
        thread: 'Small Cotton Chips',
        email: 'ponicode.com',
        emailResponse: 'TestUpperCase@Example.com',
        fallacies: object,
        summary: object2,
        oneSidedArgument: 'C:\\\\path\\to\\folder\\',
        rootPrompt: 'Hit Return for more, or q (and Return) to quit: ',
        combinedKnowledge: 'bc23a9d531064583ace8f67dad60f6bb',
      },
      isSendEmail: false,
    });
  }, 10000);

  test('1', async () => {
    let object2: any = [
      {
        argument: '/path/to/file',
        action: 'National Infrastructure Supervisor',
        explain: 'http://placeimg.com/640/480/fashion',
      },
      {
        argument: 'C:\\\\path\\to\\folder\\',
        action: 'National Infrastructure Supervisor',
        explain: 'http://placeimg.com/640/480/fashion',
      },
      {
        argument: '.',
        action: 'Customer Metrics Consultant',
        explain: 'http://placeimg.com/640/480/fashion',
      },
      {
        argument: 'path/to/file.ext',
        action: 'Product Accountability Executive',
        explain: 'http://placeimg.com/640/480/fashion',
      },
      {
        argument: 'path/to/file.ext',
        action: 'Product Accountability Executive',
        explain: 'http://placeimg.com/640/480/fashion',
      },
    ];
    let object: any = [
      { fallacy: 'Customizable', evidence: 'Extensions', explanation: 'draft' },
      { fallacy: 'User-centric', evidence: 'Lights', explanation: 'pending' },
      { fallacy: 'Face to face', evidence: 'Port', explanation: 'processing' },
    ];
    await App_prompts.getFallacies({
      state: {
        sender: '192.168.1.5',
        receiver: 'Data Scientist',
        thread: 'Small Cotton Chips',
        email: 'TestUpperCase@Example.com',
        emailResponse: 'email@Google.com',
        fallacies: object,
        summary: object2,
        oneSidedArgument: 'C:\\\\path\\to\\folder\\',
        rootPrompt: 'Message describing this patch set: ',
        combinedKnowledge: '12345',
      },
      isSendEmail: true,
    });
  }, 10000);

  test('2', async () => {
    let object2: any = [
      {
        argument: 'path/to/folder/',
        action: 'Product Accountability Executive',
        explain: 'http://placeimg.com/640/480/fashion',
      },
      {
        argument: 'C:\\\\path\\to\\folder\\',
        action: 'National Infrastructure Supervisor',
        explain: 'http://placeimg.com/640/480/fashion',
      },
      {
        argument: '.',
        action: 'National Infrastructure Supervisor',
        explain: 'http://placeimg.com/640/480/fashion',
      },
    ];
    let object: any = [
      { fallacy: 'Face to face', evidence: 'Port', explanation: 'draft' },
      {
        fallacy: 'Face to face',
        evidence: 'Extensions',
        explanation: 'completed',
      },
      { fallacy: 'Face to face', evidence: 'Extensions', explanation: 'draft' },
      { fallacy: 'Face to face', evidence: 'Harbors', explanation: 'canceled' },
    ];
    await App_prompts.getFallacies({
      state: {
        sender: '0.0.0.0',
        receiver: 'Software Engineer',
        thread: 'Small Cotton Chips',
        email: 'something@example.com',
        emailResponse: 'bed-free@tutanota.de',
        fallacies: object,
        summary: object2,
        oneSidedArgument: 'path/to/folder/',
        rootPrompt: 'This is a searchable index. Enter search keywords: ',
        combinedKnowledge: '9876',
      },
      isSendEmail: true,
    });
  }, 10000);

  test('3', async () => {
    let object2: any = [
      {
        argument: 'path/to/file.ext',
        action: 'Senior Brand Assistant',
        explain: 'http://placeimg.com/640/480/fashion',
      },
      {
        argument: './path/to/file',
        action: 'Senior Brand Assistant',
        explain: 'http://placeimg.com/640/480/fashion',
      },
    ];
    let object: any = [
      { fallacy: 'Secured', evidence: 'Extensions', explanation: 'draft' },
      { fallacy: 'Secured', evidence: 'Extensions', explanation: 'completed' },
      { fallacy: 'Customizable', evidence: 'Lights', explanation: 'done' },
      { fallacy: 'Face to face', evidence: 'Harbors', explanation: 'done' },
      { fallacy: 'Secured', evidence: 'Lights', explanation: 'processing' },
    ];
    await App_prompts.getFallacies({
      state: {
        sender: '192.168.1.5',
        receiver: 'Software Engineer',
        thread: 'Ergonomic Rubber Bike',
        email: 'something.example.com',
        emailResponse: 'user@host:300',
        fallacies: object,
        summary: object2,
        oneSidedArgument: 'path/to/file.ext',
        rootPrompt: 'This is a searchable index. Enter search keywords: ',
        combinedKnowledge: '9876',
      },
      isSendEmail: true,
    });
  }, 10000);

  test('4', async () => {
    let object2: any = [
      {
        argument: 'C:\\\\path\\to\\file.ext',
        action: 'Senior Brand Assistant',
        explain: 'http://placeimg.com/640/480/fashion',
      },
      {
        argument: '/path/to/file',
        action: 'agree',
        explain: 'http://placeimg.com/640/480/fashion',
      },
      {
        argument: 'C:\\\\path\\to\\file.ext',
        action: 'Principal Implementation Strategist',
        explain: 'http://placeimg.com/640/480/fashion',
      },
      {
        argument: '.',
        action: 'Customer Metrics Consultant',
        explain: 'http://placeimg.com/640/480/fashion',
      },
    ];
    let object: any = [
      { fallacy: 'Customizable', evidence: 'Extensions', explanation: 'done' },
      { fallacy: 'Face to face', evidence: 'Port', explanation: 'draft' },
      {
        fallacy: 'User-centric',
        evidence: 'Extensions',
        explanation: 'completed',
      },
      { fallacy: 'Secured', evidence: 'Lights', explanation: 'processing' },
      { fallacy: 'Face to face', evidence: 'Extensions', explanation: 'done' },
    ];
    await App_prompts.getFallacies({
      state: {
        sender: '0.0.0.0',
        receiver: 'Software Engineer',
        thread: 'Refined Frozen Pizza',
        email: 'bed-free@tutanota.de',
        emailResponse: 'bed-free@tutanota.de',
        fallacies: object,
        summary: object2,
        oneSidedArgument: 'path/to/folder/',
        rootPrompt: 'Enter a number:',
        combinedKnowledge: '9876',
      },
      isSendEmail: false,
    });
  }, 10000);

  test('5', async () => {
    await App_prompts.getFallacies({
      state: {
        sender: '',
        receiver: '',
        thread: '',
        email: '',
        emailResponse: '',
        fallacies: [],
        summary: [],
        oneSidedArgument: '',
        rootPrompt: '',
        combinedKnowledge: '',
      },
      isSendEmail: true,
    });
  }, 10000);
});
