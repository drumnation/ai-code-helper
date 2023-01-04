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
