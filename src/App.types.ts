export type SummaryAction =
  | 'agree'
  | 'disagree'
  | 'deny'
  | 'ignore'
  | 'explain';

export interface FactCheckedThreadSummary {
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
  invalidArguments: Fallacy[];
  factCheckedThreadSummary: FactCheckedThreadSummary[];
  oneSidedArgument: string;
  rootPrompt: string;
  combinedKnowledge: string;
}

export interface HandleLoadingProps {
  type: 'expertFeedback' | 'debatePrompt' | 'rootPrompt' | 'emailResponse';
  value: boolean;
}
