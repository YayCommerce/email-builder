import { useCallback, useMemo } from 'react';

import { CheckOutlined, DashOutlined, MinusOutlined, SmallDashOutlined } from '@ant-design/icons';
import { Button, InputNumber, Popover, Space } from 'antd';

import { ReactComponent as BorderAllIcon } from '@src/assets/svgs/border-all.svg';
import { ReactComponent as BorderBottomIcon } from '@src/assets/svgs/border-bottom.svg';
import { ReactComponent as BorderCustomIcon } from '@src/assets/svgs/border-custom.svg';
import { ReactComponent as BorderLeftIcon } from '@src/assets/svgs/border-left.svg';
import { ReactComponent as BorderNoneIcon } from '@src/assets/svgs/border-none.svg';
import { ReactComponent as BorderRightIcon } from '@src/assets/svgs/border-right.svg';
import { ReactComponent as BorderTopIcon } from '@src/assets/svgs/border-top.svg';
// eslint-disable-next-line no-restricted-imports
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';
import { getValueByPath, setValueByPath } from '@yaymail/utilities/src/functions';
import { v4 as uuidv4 } from 'uuid';

import { PropertyBuilderComponentType } from '../../../types';
import Color from '../color';
import Selector from '../selector';
import { BorderType } from './type.';

import './index.scss';

const BORDER_STYLE_OPTIONS = [
  {
    value: 'solid',
    label: (
      <div className="yaymail-border-style-label">
        <MinusOutlined className="yaymail-border-style-icon" />
        <span>{__('Solid', 'yaymail')}</span>
      </div>
    ),
  },
  {
    value: 'dashed',
    label: (
      <div className="yaymail-border-style-label">
        <DashOutlined className="yaymail-border-style-icon" />
        <span>{__('Dashed', 'yaymail')}</span>
      </div>
    ),
  },
  {
    value: 'dotted',
    label: (
      <div className="yaymail-border-style-label">
        <SmallDashOutlined className="yaymail-border-style-icon" />
        <span>{__('Dotted', 'yaymail')}</span>
      </div>
    ),
  },
];

const BORDER_SIDE_OPTIONS = [
  {
    value: 'all',
    label: __('All', 'yaymail'),
    icon: <BorderAllIcon />,
  },
  {
    value: 'top',
    label: __('Top', 'yaymail'),
    icon: <BorderTopIcon />,
  },
  {
    value: 'bottom',
    label: __('Bottom', 'yaymail'),
    icon: <BorderBottomIcon />,
  },
  {
    value: 'left',
    label: __('Left', 'yaymail'),
    icon: <BorderLeftIcon />,
  },
  {
    value: 'right',
    label: __('Right', 'yaymail'),
    icon: <BorderRightIcon />,
  },
  {
    value: 'custom',
    label: __('Custom', 'yaymail'),
    icon: <BorderCustomIcon />,
  },
  {
    value: 'none',
    label: __('None', 'yaymail'),
    icon: <BorderNoneIcon />,
  },
];

const BorderSideSelector = ({
  currentSide,
  onSideChange,
}: {
  currentSide: string;
  // eslint-disable-next-line no-unused-vars
  onSideChange: (side: string) => void;
}) => {
  return (
    <div className="yaymail-border-side-selector">
      {BORDER_SIDE_OPTIONS.map((option, index) => (
        <div key={option.value}>
          <button
            className={`yaymail-border-side-option ${
              currentSide === option.value ? 'yaymail-border-side-option--active' : ''
            }`}
            onClick={() => onSideChange(option.value)}
          >
            <span
              className={`yaymail-border-side-check ${
                currentSide === option.value ? 'yaymail-border-side-check--active' : ''
              }`}
            >
              <CheckOutlined />
            </span>

            <span className="yaymail-border-side-icon">{option.icon}</span>
            <span className="yaymail-border-side-label">{option.label}</span>
          </button>
          {index === 4 && <div className="yaymail-border-side-divider" />}
        </div>
      ))}
    </div>
  );
};

const BorderInput = ({
  title,
  value,
  disabled,
  addonBefore,
  style,
  onChange,
}: {
  value: number;
  disabled?: boolean;
  // eslint-disable-next-line no-undef
  addonBefore?: React.ReactNode;
  title?: string;
  // eslint-disable-next-line no-undef
  style?: React.CSSProperties;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: number | null) => void;
}) => {
  const id = useMemo(() => {
    return uuidv4();
  }, []);

  return (
    <div className="yaymail-editor-property yaymail-editor-number-input">
      <div className="yaymail-controls-container">
        <Space direction="vertical" className="yaymail-number-input">
          {title && (
            <label htmlFor={id} className="yaymail-number-input-label">
              {title}
            </label>
          )}
          <InputNumber
            id={id}
            value={value}
            onChange={onChange}
            min={0}
            max={50}
            disabled={disabled}
            addonBefore={addonBefore}
            style={style}
          />
        </Space>
      </div>
    </div>
  );
};

const Border: PropertyBuilderComponentType<BorderType> = (props) => {
  const { title, value_path, default_value } = props || {};

  const ensuredValuePath = value_path ?? 'border';

  const borderData = useTemplateContentStore((state) =>
    getValueByPath(state.chosenElement?.data, ensuredValuePath),
  );

  const border = useMemo(() => {
    if (borderData === undefined) {
      return default_value;
    }

    return borderData;
  }, [borderData]);

  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);

  const displayTitle = useMemo(() => title ?? __('Border', 'yaymail'), [title]);

  const handleBorderChange = useCallback(
    (key: string, value: any) => {
      updateChosenElementData(
        (data) => {
          const currentBorderData = getValueByPath(data, ensuredValuePath) || default_value;

          const updateData = JSON.parse(JSON.stringify(currentBorderData));

          updateData[key] = value;

          setValueByPath(data, ensuredValuePath, updateData);
        },
        { attribute: displayTitle + ' ' + key },
      );
    },
    [updateChosenElementData, ensuredValuePath, displayTitle],
  );

  const handleSideChange = useCallback(
    (side: string) => {
      handleBorderChange('side', side);
    },
    [handleBorderChange],
  );

  const sideIcon = useMemo(() => {
    return BORDER_SIDE_OPTIONS.find((option) => option.value === border.side)?.icon;
  }, [border]);

  return (
    <div className="yaymail-editor-property yaymail-editor-property-border">
      <div className="yaymail-border-header">
        <div className="yaymail-title">{__(displayTitle)}</div>
      </div>
      <div className="yaymail-border-color-wrapper">
        <Color value_path="border.color" disabled={border.side === 'none'} />
      </div>
      <div className="yaymail-border-weight-style-wrapper">
        <BorderInput
          disabled={border.side === 'none' || border.side === 'custom'}
          title={__('Weight', 'yaymail')}
          value={border.width}
          onChange={(value) => handleBorderChange('width', value)}
          style={{ width: '67.5px' }}
        />

        <Selector
          disabled={border.side === 'none'}
          title={__('Style', 'yaymail')}
          value_path="border.style"
          options={BORDER_STYLE_OPTIONS}
          defaultValue={border.style}
          onChange={(value) => handleBorderChange('style', value)}
        />
        <div>
          <Popover
            content={
              <BorderSideSelector currentSide={border.side} onSideChange={handleSideChange} />
            }
            trigger="click"
            arrow={false}
            placement="right"
            getPopupContainer={() => document.getElementById('yaymail-main-pages') as HTMLElement}
          >
            <Button color="default" variant="solid" className="yaymail-border-side-button" icon={sideIcon} />
          </Popover>
        </div>
      </div>
      {border.side === 'custom' && (
        <div className="yaymail-border-custom-wrapper">
          <BorderInput
            addonBefore={<BorderLeftIcon />}
            value={border.custom.left}
            onChange={(value) => handleBorderChange('custom', { ...border.custom, left: value })}
          />
          <BorderInput
            addonBefore={<BorderTopIcon />}
            value={border.custom.top}
            onChange={(value) => handleBorderChange('custom', { ...border.custom, top: value })}
          />
          <BorderInput
            addonBefore={<BorderRightIcon />}
            value={border.custom.right}
            onChange={(value) => handleBorderChange('custom', { ...border.custom, right: value })}
          />
          <BorderInput
            addonBefore={<BorderBottomIcon />}
            value={border.custom.bottom}
            onChange={(value) => handleBorderChange('custom', { ...border.custom, bottom: value })}
          />
        </div>
      )}
    </div>
  );
};

export default Border;
