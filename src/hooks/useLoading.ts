import { useCallback, useState } from 'react';
import { HandleLoading, LoadingState, UseLoading } from './types';

const useLoading: UseLoading = () => {
  const [loading, updateLoading] = useState<LoadingState>({
    testCases: false,
    allUnitTests: false,
    fixTest: false,
    fixFunction: false,
  });

  const handleLoading: HandleLoading = useCallback(
    ({ type, value }) => {
      switch (type) {
        case 'testCases':
          return updateLoading({ ...loading, testCases: value });
        case 'allUnitTests':
          return updateLoading({ ...loading, allUnitTests: value });
        case 'fixTest':
          return updateLoading({ ...loading, fixTest: value });
        case 'fixFunction':
          return updateLoading({ ...loading, fixFunction: value });
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
