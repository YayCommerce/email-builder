import { PropertyBuilderComponentType } from '../types';
import { LayoutType } from './type';

import './index.scss';

const GridLayout: PropertyBuilderComponentType<LayoutType> = (props) => {
  return (
    <div className="yaymail-layout-grid-column">
      {props?.itemList?.map((child, index) => {
        const Component = child.Component;
        const childProps = child.props;

        return (
          <div className="yaymail-layout-grid-column__item" key={index}>
            <Component {...childProps} />
          </div>
        );
      })}
    </div>
  );
};

export default GridLayout;
