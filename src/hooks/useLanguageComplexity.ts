import { useEffect, useState } from 'react';

function useLanguageComplexity() {
  const [languageLevelCategory, updateLanguageLevelCategory] =
    useState('Ignore Complexity');
  const [languageLevelSubChoices, updateLanguageLevelSubChoice] = useState([]);

  const handleLanguageLevelCategorySelect = (choice) => {
    updateLanguageLevelCategory(choice);
  };

  const handleLanguageLevelSubChoiceSelect = (choice) => {
    updateLanguageLevelSubChoice(choice);
  };

  useEffect(() => {
    handleLanguageLevelSubChoiceSelect([]);
    return () => {};
  }, [languageLevelCategory]);

  return {
    handleLanguageLevelCategorySelect,
    handleLanguageLevelSubChoiceSelect,
    languageLevelCategory,
    languageLevelSubChoices,
  };
}

export default useLanguageComplexity;
