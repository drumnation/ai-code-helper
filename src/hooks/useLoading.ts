import { useCallback, useState } from 'react';
import { HandleLoadingProps, LoadingState } from '../App.types';

interface UseLoadingReturn {
  loading: LoadingState;
  updateLoading: React.Dispatch<React.SetStateAction<LoadingState>>;
  handleLoading: ({ type, value }: HandleLoadingProps) => void;
}

type UseLoading = () => UseLoadingReturn;

type HandleLoading = ({ type, value }: HandleLoadingProps) => void;

const useLoading: UseLoading = () => {
  const [loading, updateLoading] = useState<LoadingState>({
    fallacies: false,
    summary: false,
    debatePrompt: false,
    rootPrompt: false,
    emailResponse: false,
    interviewer: false,
  });

  const handleLoading: HandleLoading = useCallback(
    ({ type, value }) => {
      switch (type) {
        case 'fallacies':
          return updateLoading({ ...loading, fallacies: value });
        case 'summary':
          return updateLoading({ ...loading, summary: value });
        case 'debatePrompt':
          return updateLoading({ ...loading, debatePrompt: value });
        case 'rootPrompt':
          return updateLoading({ ...loading, rootPrompt: value });
        case 'emailResponse':
          return updateLoading({ ...loading, emailResponse: value });
      }
    },
    [loading],
  );

  return {
    loading,
    updateLoading,
    handleLoading,
  };
};

export default useLoading;
