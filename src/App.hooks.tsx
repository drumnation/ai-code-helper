import { useEffect, useState } from 'react';
import { useLocalStorage } from './hooks';

function useApp() {
  useLocalStorage();
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (cleared) {
      const timeout = setTimeout(() => {
        setCleared(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [cleared]);
  return { cleared, setCleared };
}

export default useApp;
