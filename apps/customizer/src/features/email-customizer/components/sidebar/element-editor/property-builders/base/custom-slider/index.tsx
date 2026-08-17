/* eslint-disable react-refresh/only-export-components */
import { Slider, SliderSingleProps } from 'antd';

// eslint-disable-next-line no-restricted-imports
import withMemo from '@src/features/email-customizer/components/email-template-container/elements/with-memo';

import YAYMAIL_TOKENS from '@src/constants/tokens';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';

import './index.scss';

interface ICustomSliderProps {
  title: string;
  value: number;
  displayUnit: 'px' | '%' | 'em' | 'rem';
  min: number;
  max: number;
  onChange: SliderSingleProps['onChange'];
  className?: string;
}

const CustomSlider = (props: ICustomSliderProps) => {
  return (
    <div className={classNames('yaymail-editor-property', props.className)}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="yaymail-title">{__(props.title)}</div>
        <div className="yaymail-current-value">
          {props.value}
          {props.displayUnit}
        </div>
      </div>
      <Slider
        railStyle={{ background: '#383B3D' }}
        trackStyle={{ background: YAYMAIL_TOKENS.color.wcPurple.default }}
        handleStyle={{ border: 'none' }}
        style={{ margin: '0 7px 0 0' }}
        min={props.min}
        max={props.max}
        value={props.value}
        onChange={props.onChange}
        tooltip={{
          placement: 'topRight',
        }}
      />
    </div>
  );
};

export default withMemo(CustomSlider);
