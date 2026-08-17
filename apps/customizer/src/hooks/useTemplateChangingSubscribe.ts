import { useEffect } from 'react';

import useTemplateContentStore, { IEmailCustomizerState } from '@src/stores/templateContent';
import isEqual from 'lodash.isequal';

const useTemplateChangingSubscribe = () => {
  const changeContentStatus = useTemplateContentStore((state) => state.changeContentStatus);

  useEffect(() => {
    const unsubscribe = useTemplateContentStore.subscribe(
      (state: IEmailCustomizerState) => state.list,
      (list, prevList) => {
        if (!isEqual(list, prevList)) {
          changeContentStatus(true);
        }
      },
    );
    return () => {
      unsubscribe();
    };
  }, []);
};

export default useTemplateChangingSubscribe;
