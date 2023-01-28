import { useCallback, useState } from 'react';

interface LoadingState {
  testCases: boolean;
  allUnitTests: boolean;
}

interface HandleLoadingProps {
  type: 'testCases' | 'allUnitTests';
  value: boolean;
}
interface UseLoadingReturn {
  loading: LoadingState;
  updateLoading: React.Dispatch<React.SetStateAction<LoadingState>>;
  handleLoading: ({ type, value }: HandleLoadingProps) => void;
}

type UseLoading = () => UseLoadingReturn;

type HandleLoading = ({ type, value }: HandleLoadingProps) => void;

const useLoading: UseLoading = () => {
  const [loading, updateLoading] = useState<LoadingState>({
    testCases: false,
    allUnitTests: false,
  });

  const handleLoading: HandleLoading = useCallback(
    ({ type, value }) => {
      switch (type) {
        case 'testCases':
          return updateLoading({ ...loading, testCases: value });
        case 'allUnitTests':
          return updateLoading({ ...loading, allUnitTests: value });
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
