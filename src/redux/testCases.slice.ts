import { createReduxModule } from 'hooks-for-redux';
import produce from 'immer';
import { removeExport } from '../App.logic';
import {
  ITypescriptTypes,
  ITestFunction,
  ITestCases,
  ITestCasesPrompt,
} from '../types';

interface ITestCasesState {
  typescriptTypes: ITypescriptTypes;
  testFunction: ITestFunction;
  testCases: ITestCases;
  testCasesPrompt: ITestCasesPrompt;
}

const initialState: ITestCasesState = {
  typescriptTypes: '',
  testFunction: '',
  testCases: [],
  testCasesPrompt: '',
};

export const [
  useTestCasesState,
  {
    updateTypescriptTypes,
    updateTestFunction,
    updateTestCases,
    updateTestCasesPrompt,
  },
  useTestCasesStore,
] = createReduxModule('testCases', initialState, {
  updateTypescriptTypes: produce(
    (state: ITestCasesState, types: ITypescriptTypes) => {
      state.typescriptTypes = types;
      localStorage.setItem('typescriptTypes', types);
    },
  ),
  updateTestFunction: produce(
    (state: ITestCasesState, testFunction: ITestFunction) => {
      testFunction = removeExport(testFunction);
      state.testFunction = testFunction;
      localStorage.setItem('testFunction', testFunction);
    },
  ),
  updateTestCases: produce((state: ITestCasesState, testCases: ITestCases) => {
    state.testCases = testCases;
    localStorage.setItem('testCases', JSON.stringify(testCases));
  }),
  updateTestCasesPrompt: produce(
    (state: ITestCasesState, testCasesPrompt: ITestCasesPrompt) => {
      state.testCasesPrompt = testCasesPrompt;
    },
  ),
});
