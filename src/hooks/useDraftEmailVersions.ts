import { useState } from 'react';
import { getTags } from '../App.logic';

function useDraftEmailVersions({
  state,
  descriptors,
  promptWordCount,
  languageLevelCategory,
  isFirm,
  languageLevelSubChoices,
  writingStyle,
  enableWordCount,
}) {
  const [draftEmailVersions, updateDraftEmailVersions] = useState([]);

  const handleAddNewDraftEmail = () => {
    const count = draftEmailVersions.length + 1;
    const created = Date.now();
    const email = state.emailResponse;
    const title = `Draft ${count}`;
    const wordCount = promptWordCount;
    const {
      toneTags,
      languageLevelCategoryTag,
      languageLevelSubChoicesTags,
      descriptionTag,
    } = getTags(
      descriptors,
      languageLevelCategory,
      languageLevelSubChoices,
      writingStyle,
    );
    const responses = [
      ...draftEmailVersions,
      {
        email,
        title,
        wordCount,
        enableWordCount,
        isFirm,
        tone: toneTags,
        languageLevelCategory: languageLevelCategoryTag,
        languageLevelSubChoices: languageLevelSubChoicesTags,
        description: descriptionTag,
        created,
      },
    ];
    updateDraftEmailVersions(responses);
  };

  return {
    draftEmailVersions,
    handleAddNewDraftEmail,
  };
}

export default useDraftEmailVersions;
