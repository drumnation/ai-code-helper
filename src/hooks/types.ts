import { FC } from 'react';

export interface LoadingState {
  testCases: boolean;
  allUnitTests: boolean;
  fixTest: boolean;
  fixFunction: boolean;
}

export interface HandleLoadingProps {
  type: 'testCases' | 'allUnitTests' | 'fixTest' | 'fixFunction';
  value: boolean;
}

export interface UseLoadingReturn {
  loading: LoadingState;
  updateLoading: React.Dispatch<React.SetStateAction<LoadingState>>;
  handleLoading: ({ type, value }: HandleLoadingProps) => void;
}

export type UseLoading = () => UseLoadingReturn;

export type HandleLoading = ({ type, value }: HandleLoadingProps) => void;

export interface UseLocalStorageProps {
  updateTypescriptTypes: (types: string) => void;
  updateTestCases: (cases: string[]) => void;
  updateTestFunction: (testFunction: string) => void;
  updateUnitTests: (tests: IUnitTests) => void;
}

export type IGenerateTestCasesPrompt = ({
  typescriptTypes,
  testFunction,
}: {
  typescriptTypes: ITypescriptTypes;
  testFunction: ITestFunction;
}) => string;

export type IGenerateTestCases = ({
  testCasesPrompt,
}: {
  testCasesPrompt: string;
}) => Promise<void>;

export type ITestCases = string[];

export type ITestCasesPrompt = string;

export type ITypescriptTypes = string;
export type ITestFunction = string;

export interface ISecondaryTest {
  expectedValue?: string;
  output?: string;
  pass?: boolean;
  test: string;
}

export interface IUnitTest {
  expectedValue?: string;
  fixedTest?: ISecondaryTest;
  fixedFunction?: ISecondaryTest;
  output?: string;
  pass?: boolean;
  test: string;
}

export type IUnitTests = Record<number, IUnitTest>;

export interface ICustomFixInstruction {
  fixTest: string;
  fixFunction: string;
}

export type ICustomFixInstructions = Record<number, ICustomFixInstruction>;

export type IUnitTestsLoading = Record<number, boolean>;

export function isIUnitTests(tests: any): tests is IUnitTests {
  return typeof tests === 'object' && tests !== null && !Array.isArray(tests);
}

export function isIUnitTest(tests: any): tests is String {
  return typeof tests === 'string' && tests !== null;
}

export interface UseUnitTestProps {
  testFunction: ITestFunction;
  typescriptTypes: ITypescriptTypes;
  handleLoading: HandleLoading;
  handleChangeTestFunction: (code: string) => void;
}

export interface IHandleUnitTestsLoading {
  index: number;
  isLast?: boolean;
  isLoading?: boolean;
  isRemove?: boolean;
  unitTestsLoading: IUnitTestsLoading;
}

export interface IGetUnitTests {
  test: string;
  index: number;
  unitTests: IUnitTests;
  single?: boolean;
}

export interface IHandleClickUnitTests {
  index: number;
  test: string;
  unitTestsLoading: IUnitTestsLoading;
}

export interface IHandleClickAllUnitTests {
  testCases: ITestCases;
  unitTests: IUnitTests;
}

export interface TestEditorProps {
  value: string;
  index?: number;
  unitTests?: IUnitTests;
}

export interface IHandleChangeUnitTest {
  index: number;
  test: string;
  unitTests: IUnitTests;
}

export interface IMonacoDiffEditorProps {
  modified: string;
  original: string;
  originalHeading: string;
  modifiedHeading: string;
}

export interface IHandleChangeCustomFixInstruction {
  index: number;
  instruction: string;
  type: 'original' | 'fixTest' | 'fixFunction';
  customFixInstructions: ICustomFixInstruction;
}

export interface IGetFixedTest {
  index: number;
  unitTests: IUnitTests;
  customInstruction: string;
}

export interface IHandleClickFixTest {
  index: number;
  unitTests: IUnitTests;
  customInstruction: string;
}

export interface IGetFixedFunction {
  index: number;
  unitTests: IUnitTests;
  customInstruction: string;
}

export interface IHandleClickFixFunction {
  index: number;
  unitTests: IUnitTests;
  customInstruction: string;
}

export interface ICountPasses {
  trueCount: number;
  falseCount: number;
}
