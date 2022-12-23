export type SummaryAction = 'agree' | 'deny' | 'ignore' | 'rebuttal';

export interface FactCheckedThreadSummary {
  argument: string;
  action: SummaryAction;
  rebuttal: string;
}

export interface Fallacy {
  fallacy: string;
  evidence: string;
  explanation: string;
}

export interface State {
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
