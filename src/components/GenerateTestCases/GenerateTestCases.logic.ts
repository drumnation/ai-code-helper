import { callChatGPT } from '../../api';
import { updateLoading } from '../../redux/loading.slice';
import { updateTestCases } from '../../redux/testCases.slice';
import { IGenerateTestCases } from '../../types';

export const generateTestCases: IGenerateTestCases = async ({
  testCasesPrompt,
}) => {
  updateLoading({ type: 'testCases', loading: true });
  const testCases_ = await callChatGPT(testCasesPrompt);
  const parsed = JSON.parse(testCases_);
  updateTestCases(parsed);
  updateLoading({ type: 'testCases', loading: false });
};
