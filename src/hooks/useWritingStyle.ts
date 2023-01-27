import { useState } from 'react';

function useWritingStyle() {
  const [writingStyle, updateWritingStyle] = useState('No Style Change');
  const handleWritingStyleRephrase = (style) => {
    updateWritingStyle(style);
  };

  return {
    handleWritingStyleRephrase,
    writingStyle,
  };
}

export default useWritingStyle;
