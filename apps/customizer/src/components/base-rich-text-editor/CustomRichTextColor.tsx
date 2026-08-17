import React, { MouseEventHandler, useCallback, useMemo, useState } from 'react';

import { ColorPicker } from 'antd';
import { Color as ColorTypeAntd } from 'antd/es/color-picker';

import classNames from 'classnames';
import debounce from 'lodash.debounce';

import { ICustomColorButtonProps } from './type';

const CustomRichTextColor: React.FC<ICustomColorButtonProps> = ({
  colorType,
  initialValue,
  editorId,
  onChange,
}) => {
  const [color, setColor] = useState<ICustomColorButtonProps['initialValue']>(initialValue);
  const editor = useMemo(() => window.tinymce.get(editorId), [editorId]);

  const handleChange = debounce((newColor: ColorTypeAntd) => {
    const editor = window.tinymce.get(editorId);
    if (editor) {
      const newColorHex = newColor.toHexString();
      setColor(newColorHex);
      editor.execCommand(colorType, false, newColorHex);
      onChange(editor.getContent());
    }
  }, 200);

  const applyCurrentColor: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.stopPropagation();
      editor.execCommand(colorType, false, color);
      onChange(editor.getContent());
    },
    [editor, color],
  );

  return (
    <ColorPicker
      className="yaymail-color-picker-wrapper"
      defaultValue={color}
      onChange={handleChange}
    >
      <div
        className="mce-widget mce-btn mce-splitbtn mce-colorbutton"
        role="button"
        aria-haspopup="true"
        aria-label="Background color"
      >
        <button role="presentation" type="button" onClick={applyCurrentColor}>
          <i
            className={classNames(
              'mce-ico',
              colorType === 'ForeColor' ? 'mce-i-forecolor' : 'mce-i-backcolor',
            )}
          />
          <span className="mce-preview" style={{ background: color }}></span>
        </button>
        <button type="button" className="mce-open">
          <i className="mce-caret" />
        </button>
      </div>
    </ColorPicker>
  );
};

export default CustomRichTextColor;
