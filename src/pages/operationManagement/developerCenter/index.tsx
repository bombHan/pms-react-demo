import React from 'react';
import { useSetReactive } from '@pms/middleground-share';
import ClassifyTree from './components/ClassifyTree/index';
import Document from './components/Document/index';
import { CatalogueProps } from './type';
import './index.less';

function developerCenter() {
  // 当前点击的目录信息
  const [state, setState] = useSetReactive({
    curCatalogue: {},
  });

  const changeCatalogue = (curCatalogue: CatalogueProps) => {
    state.curCatalogue = curCatalogue;
    console.log('最新的选择的目录', state.curCatalogue);
  };

  return (
    <div className="developer-container">
      <div className="left-container">
        <ClassifyTree curCatalogue={state.curCatalogue} changeCatalogue={changeCatalogue} />
      </div>
      <div className="right-container">
        {
          state.curCatalogue.documentId && <Document curCatalogue={state.curCatalogue} />
        }
      </div>
    </div>
  );
}

export default developerCenter;
