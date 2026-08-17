import { useCallback, useMemo } from 'react';

import { CheckOutlined, DashOutlined, MinusOutlined, SmallDashOutlined } from '@ant-design/icons';
import { Button, InputNumber, Popover, Space, Tabs } from 'antd';
import { Color as ColorTypeAntd } from 'antd/es/color-picker';

import { ReactComponent as BorderAllIcon } from '@src/assets/svgs/border-all.svg';
import { ReactComponent as BorderBottomIcon } from '@src/assets/svgs/border-bottom.svg';
import { ReactComponent as BorderCustomIcon } from '@src/assets/svgs/border-custom.svg';
import { ReactComponent as BorderLeftIcon } from '@src/assets/svgs/border-left.svg';
import { ReactComponent as BorderNoneIcon } from '@src/assets/svgs/border-none.svg';
import { ReactComponent as BorderRightIcon } from '@src/assets/svgs/border-right.svg';
import { ReactComponent as BorderTopIcon } from '@src/assets/svgs/border-top.svg';
import { BorderType, IElement } from '@src/features/email-customizer/type';
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';
import { v4 as uuidv4 } from 'uuid';

import CustomColorPicker from '../../../../custom-color-picker';
import { PropertyBuilderComponentType } from '../../../types';
import SelectorBase from '../../base/selector-base';

import './index.scss';

type BorderValueType = BorderType & {
  side: BorderType['side'] | 'all';
};

const DEFAULT_BORDER: BorderValueType = {
  side: 'none',
  width: 1,
  style: 'solid',
  color: '#e5e5e5',
  custom: {
    top: 1,
    right: 1,
    bottom: 1,
    left: 1,
  },
};

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
  { value: 'all', label: __('All', 'yaymail'), icon: <BorderAllIcon /> },
  { value: 'top', label: __('Top', 'yaymail'), icon: <BorderTopIcon /> },
  { value: 'bottom', label: __('Bottom', 'yaymail'), icon: <BorderBottomIcon /> },
  { value: 'left', label: __('Left', 'yaymail'), icon: <BorderLeftIcon /> },
  { value: 'right', label: __('Right', 'yaymail'), icon: <BorderRightIcon /> },
  { value: 'custom', label: __('Custom', 'yaymail'), icon: <BorderCustomIcon /> },
  { value: 'none', label: __('None', 'yaymail'), icon: <BorderNoneIcon /> },
];

const BorderSideSelector = ({
  currentSide,
  onSideChange,
}: {
  currentSide: string;
  // eslint-disable-next-line no-unused-vars
  onSideChange: (side: BorderValueType['side']) => void;
}) => (
  <div className="yaymail-border-side-selector">
    {BORDER_SIDE_OPTIONS.map((option, index) => (
      <div key={option.value}>
        <button
          type="button"
          className={`yaymail-border-side-option ${
            currentSide === option.value ? 'yaymail-border-side-option--active' : ''
          }`}
          onClick={() => onSideChange(option.value as BorderValueType['side'])}
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
  const id = useMemo(() => uuidv4(), []);
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

const toBorder = (value?: Partial<BorderValueType>): BorderValueType => ({
  ...DEFAULT_BORDER,
  ...value,
  custom: {
    ...DEFAULT_BORDER.custom,
    ...(value?.custom ?? {}),
  },
});

const ColumnBorderEditor = ({
  columnIndex,
  border,
}: {
  columnIndex: number;
  border: BorderValueType;
}) => {
  const updateChosenElementChildren = useTemplateContentStore(
    (state) => state.updateChosenElementChildren,
  );

  const updateBorder = useCallback(
    // eslint-disable-next-line no-unused-vars
    (updater: (prev: BorderValueType) => BorderValueType, attribute: string) => {
      updateChosenElementChildren(
        (children) => {
          if (!children?.[columnIndex]) return;
          const column = children[columnIndex] as IElement<'column'>;
          const previous = toBorder(
            (column.data as IElement<'column'>['data']).border as BorderValueType,
          );
          column.data.border = updater(previous);
        },
        { attribute },
      );
    },
    [columnIndex, updateChosenElementChildren],
  );

  const handleBorderChange = useCallback(
    (key: keyof BorderValueType, value: any) => {
      updateBorder((previous) => {
        const next = {
          ...previous,
          [key]: value,
        } as BorderValueType;

        if (key === 'custom') {
          next.custom = {
            ...previous.custom,
            ...value,
          };
        }

        return next;
      }, `${__('Column border', 'yaymail')} ${columnIndex + 1} ${key}`);
    },
    [columnIndex, updateBorder],
  );

  const sideIcon = useMemo(
    () => BORDER_SIDE_OPTIONS.find((option) => option.value === border.side)?.icon,
    [border.side],
  );

  return (
    <div className="yaymail-editor-property yaymail-editor-property-border">
      <div className="yaymail-border-color-wrapper">
        <div
          className={`yaymail-editor-property yaymail-editor-property-color ${
            border.side === 'none' ? 'disabled' : ''
          }`}
        >
          <CustomColorPicker
            value={border.color}
            showPresets={true}
            readOnly={border.side === 'none'}
            onChange={(colorObj: ColorTypeAntd, hex: string) => {
              let normalized = hex;
              if (normalized.includes('rgb')) {
                normalized = colorObj.toHexString();
              }
              handleBorderChange('color', normalized);
            }}
          />
        </div>
      </div>
      <div className="yaymail-border-weight-style-wrapper">
        <BorderInput
          disabled={border.side === 'none' || border.side === 'custom'}
          title={__('Weight', 'yaymail')}
          value={border.width}
          onChange={(value) => handleBorderChange('width', value ?? 0)}
          style={{ width: '67.5px' }}
        />

        <SelectorBase
          disabled={border.side === 'none'}
          title={__('Style', 'yaymail')}
          options={BORDER_STYLE_OPTIONS}
          value={border.style}
          onChange={(value) => handleBorderChange('style', value)}
        />

        <div>
          <Popover
            content={
              <BorderSideSelector
                currentSide={border.side}
                onSideChange={(side) => handleBorderChange('side', side)}
              />
            }
            trigger="click"
            arrow={false}
            placement="right"
            getPopupContainer={() => document.getElementById('yaymail-main-pages') as HTMLElement}
          >
            <Button
              color="default"
              variant="solid"
              className="yaymail-border-side-button"
              icon={sideIcon}
            />
          </Popover>
        </div>
      </div>

      {border.side === 'custom' && (
        <div className="yaymail-border-custom-wrapper">
          <BorderInput
            addonBefore={<BorderLeftIcon />}
            value={border.custom.left}
            onChange={(value) =>
              handleBorderChange('custom', { ...border.custom, left: value ?? 0 })
            }
          />
          <BorderInput
            addonBefore={<BorderTopIcon />}
            value={border.custom.top}
            onChange={(value) =>
              handleBorderChange('custom', { ...border.custom, top: value ?? 0 })
            }
          />
          <BorderInput
            addonBefore={<BorderRightIcon />}
            value={border.custom.right}
            onChange={(value) =>
              handleBorderChange('custom', { ...border.custom, right: value ?? 0 })
            }
          />
          <BorderInput
            addonBefore={<BorderBottomIcon />}
            value={border.custom.bottom}
            onChange={(value) =>
              handleBorderChange('custom', { ...border.custom, bottom: value ?? 0 })
            }
          />
        </div>
      )}
    </div>
  );
};

const ColumnBorders: PropertyBuilderComponentType<{ title?: string }> = (props) => {
  const chosenElement = useTemplateContentStore(
    (state) => state.chosenElement,
  ) as IElement<'column_layout'> | null;

  const columns = chosenElement?.children ?? [];
  const title = props?.title ?? __('Column borders', 'yaymail');

  const items = useMemo(
    () =>
      columns.map((column, index) => {
        const border = toBorder(
          (column.data as IElement<'column'>['data']).border as BorderValueType,
        );
        return {
          key: String(index),
          label: `${__('Column', 'yaymail')} ${index + 1}`,
          children: <ColumnBorderEditor columnIndex={index} border={border} />,
        };
      }),
    [columns],
  );

  if (columns.length === 0) {
    return null;
  }

  return (
    <div className="yaymail-editor-property yaymail-column-borders">
      <div className="yaymail-title">{title}</div>
      {columns.length !== 1 ? (
        <Tabs items={items} />
      ) : (
        <ColumnBorderEditor
          columnIndex={0}
          border={toBorder(
            (columns[0].data as IElement<'column'>['data']).border as BorderValueType,
          )}
        />
      )}
    </div>
  );
};

export default ColumnBorders;
