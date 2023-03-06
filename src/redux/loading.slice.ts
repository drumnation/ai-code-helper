import { createReduxModule } from 'hooks-for-redux';
import produce from 'immer';
import { LoadingState } from '../types';

const initialState: LoadingState = {
  testCases: false,
  allUnitTests: false,
  fixTest: false,
  fixFunction: false,
};

export const [useLoadingState, { updateLoading }, useLoadingStore] =
  createReduxModule('loading', initialState, {
    updateLoading: produce((state: LoadingState, { loading, type }) => {
      switch (type) {
        case 'testCases':
          state.testCases = loading;
          break;
        case 'allUnitTests':
          state.allUnitTests = loading;
          break;
        case 'fixTest':
          state.fixTest = loading;
          break;
        case 'fixFunction':
          state.fixFunction = loading;
          break;
      }
    }),
  });
