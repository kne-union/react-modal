import { useCallback, useState } from 'react';

const usePatchElement = () => {
  const [elements, setElements] = useState([]);
  const patchElement = useCallback(element => {
    setElements(originElements => [...originElements, element]);
    return () => {
      setElements(originElements => originElements.filter(ele => ele !== element));
    };
  }, []);
  return [elements, patchElement];
};

export default usePatchElement;
