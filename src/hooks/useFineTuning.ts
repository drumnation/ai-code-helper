import { useState } from 'react';
import useTone from './useTone';
import useLanguageComplexity from './useLanguageComplexity';
import useWritingStyle from './useWritingStyle';

function useFineTuning() {
  const [isFirm, setIsFirmOn] = useState(true);

  const handleToggleFirm = () => {
    setIsFirmOn((isFirm) => !isFirm);
  };

  const [enableWordCount, setEnableWordCount] = useState<boolean>(false);

  const handleToggleWordCount = () => {
    setEnableWordCount(!enableWordCount);
  };

  const [promptWordCount, setPromptWordCount] = useState<number>(300);

  const handleChangeWordCount = (count: number) => {
    setPromptWordCount(count);
  };

  const [temperature, updateTemperature] = useState<number>(0.6);

  const handleChangeTemperature = (temp) => {
    updateTemperature(temp);
  };

  const { descriptors, handleDescriptorRephrase } = useTone();
  const {
    handleLanguageLevelCategorySelect,
    handleLanguageLevelSubChoiceSelect,
    languageLevelCategory,
    languageLevelSubChoices,
  } = useLanguageComplexity();

  const { handleWritingStyleRephrase, writingStyle } = useWritingStyle();

  return {
    enableWordCount,
    handleChangeTemperature,
    handleChangeWordCount,
    handleToggleFirm,
    handleToggleWordCount,
    isFirm,
    promptWordCount,
    temperature,
    descriptors,
    handleDescriptorRephrase,
    handleLanguageLevelCategorySelect,
    handleLanguageLevelSubChoiceSelect,
    languageLevelCategory,
    languageLevelSubChoices,
    handleWritingStyleRephrase,
    writingStyle,
  };
}

export default useFineTuning;
