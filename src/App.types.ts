export type SummaryAction =
  | 'agree'
  | 'disagree'
  | 'deny'
  | 'ignore'
  | 'explain';

export interface Summary {
  argument: string;
  action: SummaryAction;
  explain: string;
}

export interface Fallacy {
  fallacy: string;
  evidence: string;
  explanation: string;
}

export interface State {
  sender: string;
  receiver: string;
  thread: string;
  email: string;
  emailResponse: string;
  fallacies: Fallacy[];
  summary: Summary[];
  oneSidedArgument: string;
  rootPrompt: string;
  combinedKnowledge: string;
}

export interface HandleLoadingProps {
  type:
    | 'fallacies'
    | 'summary'
    | 'debatePrompt'
    | 'rootPrompt'
    | 'emailResponse';
  value: boolean;
}

export interface LoadingState {
  fallacies: boolean;
  summary: boolean;
  debatePrompt: boolean;
  rootPrompt: boolean;
  emailResponse: boolean;
}

export interface ISelectedSentence {
  [key: number]: string;
}

export type ISendEmailPoints = string[];

// export interface Suggestion {
//   selected: boolean;
//   suggestion: string;
//   key: string;
// }

// export interface Suggestions {
//   [key: string]: Suggestion;
// }

export interface ISentenceSuggestion {
  [key: number]: {
    [key: string]: {
      selected: boolean;
      suggestion: string;
      key: string;
    };
  };
}

export interface IRootPromptOptions {
  descriptors: string[];
  enableWordCount: boolean;
  fallacies: Fallacy[];
  includeFallacyFinder: boolean;
  includeSummaryResponses: boolean;
  isFirm: boolean;
  isSendEmail: boolean;
  languageLevelCategory: string;
  languageLevelSubChoices: string[];
  promptWordCount: number;
  selectedSentence: ISelectedSentence;
  sendEmailPoints: ISendEmailPoints;
  sentenceSuggestions: ISentenceSuggestion;
  state: State;
  summary: Summary[];
  writingStyle: string;
}

export interface GetRootPromptReturn extends State {
  isFirm: boolean;
}
