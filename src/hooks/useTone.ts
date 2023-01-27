import { useState } from 'react';

function useTone() {
  const [descriptors, updateDescriptors] = useState([
    'Brief',
    'Informative',
    'Firm',
    'Friendly',
  ]);

  const handleDescriptorRephrase = (descriptors) => {
    updateDescriptors(descriptors);
  };

  return {
    descriptors,
    handleDescriptorRephrase,
  };
}

export default useTone;
