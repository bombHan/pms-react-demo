import { useState, useCallback } from 'react';
import { ICategory } from '@/pages/systemManage/Rules/servers/api';

export default function useRules() {
  const [ruleDetail, setUseRuleDetail] = useState<ICategory>({} as ICategory);

  const setRuleDetail = useCallback((data) => {
    setUseRuleDetail(data);
  }, []);

  return {
    ruleDetail,
    setRuleDetail,
  };
}
