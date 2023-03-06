import { createReduxModule } from 'hooks-for-redux';
import produce from 'immer';
import {
  IUnitTests,
  IUnitTestsLoading,
  ICustomFixInstructions,
  IHandleUnitTestsLoading,
} from '../types';

interface IUnitTestsState {
  unitTests: IUnitTests;
  unitTestsLoading: IUnitTestsLoading;
  customFixInstructions: ICustomFixInstructions;
}

const initialState: IUnitTestsState = {
  unitTests: {},
  unitTestsLoading: {},
  customFixInstructions: {},
};

export const [
  useUnitTestsState,
  {
    deleteUnitTest,
    updateCustomFixInstructions,
    updateUnitTests,
    updateUnitTestsLoading,
  },
  useUnitTestsStore,
] = createReduxModule('unitTests', initialState, {
  deleteUnitTest: produce((state: IUnitTestsState, index: number) => {
    delete state.unitTests[index];
    localStorage.setItem('unitTests', JSON.stringify(state.unitTests));
  }),
  updateUnitTests: produce((state: IUnitTestsState, unitTests: IUnitTests) => {
    state.unitTests = unitTests;
    localStorage.setItem('unitTests', JSON.stringify(unitTests));
  }),
  updateUnitTestsLoading: produce(
    (
      state: IUnitTestsState,
      {
        index,
        isLast = false,
        isLoading = false,
        isRemove = false,
        unitTestsLoading: unitTestsLoading_,
      }: IHandleUnitTestsLoading,
    ) => {
      let newLoading = {
        ...unitTestsLoading_,
        [index]: isLoading,
      };
      isRemove && delete newLoading[index];
      if (isLast) newLoading = { 0: false };
      state.unitTestsLoading = newLoading;
    },
  ),
  updateCustomFixInstructions: produce(
    (state: IUnitTestsState, customFixInstructions: ICustomFixInstructions) => {
      state.customFixInstructions = customFixInstructions;
    },
  ),
});
