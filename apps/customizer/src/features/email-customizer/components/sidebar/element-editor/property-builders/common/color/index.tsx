import { useCallback, useMemo } from 'react';

import { Color as ColorTypeAntd } from 'antd/es/color-picker';

import useTemplateContentStore from '@src/stores/templateContent';
import debounce from 'lodash.debounce';

import CustomColorPicker from '../../../../custom-color-picker';
import { PropertyBuilderComponentType } from '../../../types';
import { ColorType } from './type';

import './index.scss';
import { getValueByPath, setValueByPath } from '@yaymail/utilities/src/functions';

const Color: PropertyBuilderComponentType<ColorType> = (props?) => {
  const valuePath: string = useMemo(
    () => props?.value_path ?? 'background_color',
    [props?.value_path],
  );

  const color = useTemplateContentStore((state) =>
    getValueByPath(state.chosenElement?.data, valuePath),
  );

  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);

  const handleOnChange = useCallback(
    debounce((_: ColorTypeAntd, hex: string) => {
      if (hex.includes('rgb')) {
        hex = _.toHexString();
      }
      
      updateChosenElementData(
        (data) => {
          setValueByPath(data, valuePath, hex);
        },
        { attribute: props?.title ?? 'Color' },
      );
    }, 0),
    [updateChosenElementData, color, valuePath],
  );

  const displayColor = useMemo(() => color ?? '#F0F0F1', [color]);

  const { ...rest } = props || {};

  return (
    <div className="yaymail-editor-property yaymail-editor-property-color">
      {/* <div className="yaymail-title">{color?.title}</div> */}
      <CustomColorPicker value={displayColor} onChange={handleOnChange} {...rest} />
    </div>
  );
};

export default Color;
