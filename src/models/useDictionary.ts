import { useState, useCallback } from 'react';
import { ICategory } from '@/pages/systemManage/Dictionary/DictionaryList/type';


export default function useDictionary() {
  const [dictionary, setUseDictionary] = useState<ICategory>({} as ICategory);

  const setDictionary = useCallback((data) => {
    setUseDictionary(data);
  }, []);

  return {
    dictionary,
    setDictionary,
  };
}
