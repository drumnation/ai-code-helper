import { useState } from 'react';
import { callChatGPT } from '../App.logic';
import { LoadingState } from '../App.types';

interface UseInterviewerProps {
  email: string;
  sender: string;
  receiver: string;
  updateLoading: (loading: LoadingState) => void;
  loading: LoadingState;
}

export interface Interview {
  question: string;
  answer: string;
}

export type HandleUpdateInterview = ({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) => void;

const useInterviewer = ({
  updateLoading,
  loading,
  email,
  sender,
  receiver,
}: UseInterviewerProps) => {
  const [interview, updateInterview] = useState<Interview[]>([]);
  console.debug('interview', interview);
  const handleUpdateInterview: HandleUpdateInterview = ({
    question,
    answer,
    index,
  }) => {
    let newInterview = [...interview];
    newInterview[index] = { question, answer };
    updateInterview(newInterview);
    localStorage.setItem('interview', JSON.stringify(newInterview));
  };

  const clearInterview = () => {
    updateInterview([]);
    localStorage.removeItem('interview');
  };

  const generateInterview = async () => {
    updateLoading({ ...loading, interviewer: true });
    const prompt = `Please read the following email from ${sender} asking questions so that you can write a persuasive response as ${receiver}: ${email}\n\nPlease interview ${receiver} and questions about this email that would enable you to write a persuasive response on his behalf. Convert to an array and return as stringified JSON.`;
    const interviewResponse = await callChatGPT(prompt, 0.5);
    const interviewData = JSON.parse(interviewResponse).map((question) => ({
      question,
      answer: '',
    }));
    console.debug('interviewer', { interviewResponse, interviewData });
    updateInterview(interviewData);
    updateLoading({ ...loading, interviewer: false });
  };

  return {
    interview,
    handleUpdateInterview,
    generateInterview,
    updateInterview,
    clearInterview,
  };
};

export default useInterviewer;
