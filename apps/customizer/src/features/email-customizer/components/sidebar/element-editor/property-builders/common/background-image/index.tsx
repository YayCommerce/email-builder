import { useCallback, useMemo } from 'react';

import { Select } from 'antd';

import { BackgroundImageType as BackgroundImageDataType } from '@src/features/email-customizer/type';
import useTemplateContentStore from '@src/stores/templateContent';
import { underscoreToSpace } from '@src/utils';
import { __ } from '@wordpress/i18n';
import { getValueByPath, setValueByPath } from '@yaymail/utilities/src/functions';

import { PropertyBuilderComponentType } from '../../../types';
import CustomSlider from '../../base/custom-slider';
import MediaBase from '../../base/media-base';
import SelectorBase from '../../base/selector-base';
import { BackgroundImageType as BackgroundImagePropsType } from './type';

import './index.scss';

const { Option } = Select;

const generateOptions = (optionsArray: Array<string>) => {
  return (
    <>
      {optionsArray.map((option) => (
        <Option value={option} label={option} key={option}>
          <span style={{ textTransform: 'capitalize' }}>{underscoreToSpace(option)}</span>
        </Option>
      ))}
    </>
  );
};

const POSITIONS: BackgroundImageDataType['position'][] = [
  'default',
  'center_center',
  'center_left',
  'center_right',
  'top_center',
  'top_left',
  'top_right',
  'bottom_center',
  'bottom_left',
  'bottom_right',
  'custom',
];
const REPEATS: BackgroundImageDataType['repeat'][] = [
  'default',
  'no-repeat',
  'repeat',
  'repeat-x',
  'repeat-y',
];
const SIZES: BackgroundImageDataType['size'][] = ['default', 'auto', 'cover', 'contain', 'custom'];

const POSITION_OPTIONS = generateOptions(POSITIONS);
const REPEAT_OPTIONS = generateOptions(REPEATS);
const SIZE_OPTIONS = generateOptions(SIZES);

const BackgroundImage: PropertyBuilderComponentType<BackgroundImagePropsType> = (props?) => {
  const {
    value_path,
    title,
    media_type,
    button_title,
    show_preview,
    hide_preview_on_empty_url,
    url_input_place_holder,
    show_delete_button,
  } = props ?? {};

  const valuePath = value_path ?? 'background_image';

  const backgroundImage = useTemplateContentStore((state) =>
    getValueByPath(state.chosenElement?.data, valuePath),
  );

  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);

  const urlValue = useMemo(() => backgroundImage?.url, [backgroundImage?.url]);

  const updateUrl = useCallback(
    (url: string) => {
      updateChosenElementData(
        (data) => {
          setValueByPath(data, `${valuePath}.url`, url);
        },
        { attribute: __('Background Image URL', 'yaymail') },
      );
    },
    [updateChosenElementData],
  );

  const positionValue = useMemo(() => backgroundImage?.position, [backgroundImage?.position]);

  const onSelectingPosition = useCallback(
    (position: BackgroundImageDataType['position']) => {
      updateChosenElementData(
        (data) => {
          setValueByPath(data, `${valuePath}.position`, position);
        },
        { attribute: __('Background Image Position', 'yaymail') },
      );
    },
    [updateChosenElementData],
  );

  const isUsingCustomPosition = useMemo(() => positionValue === 'custom', [positionValue]);
  const xPositionValue = useMemo(
    () => backgroundImage?.x_position ?? 0,
    [backgroundImage?.x_position],
  );

  const handleOnXPositionChange = useCallback(
    (x_position: BackgroundImageDataType['x_position']) => {
      updateChosenElementData(
        (data) => {
          setValueByPath(data, `${valuePath}.x_position`, x_position);
        },
        { attribute: __('Background Image Position X', 'yaymail') },
      );
    },
    [updateChosenElementData],
  );
  const yPositionValue = useMemo(
    () => backgroundImage?.y_position ?? 0,
    [backgroundImage?.y_position],
  );

  const handleOnYPositionChange = useCallback(
    (y_position: BackgroundImageDataType['y_position']) => {
      updateChosenElementData(
        (data) => {
          setValueByPath(data, `${valuePath}.y_position`, y_position);
        },
        { attribute: __('Background Image Position Y', 'yaymail') },
      );
    },
    [updateChosenElementData],
  );

  const repeatValue = useMemo(() => backgroundImage?.repeat, [backgroundImage?.repeat]);

  const onSelectingRepeat = useCallback(
    (repeat: BackgroundImageDataType['repeat']) => {
      updateChosenElementData(
        (data) => {
          setValueByPath(data, `${valuePath}.repeat`, repeat);
        },
        { attribute: __('Background Image Size', 'yaymail') },
      );
    },
    [updateChosenElementData],
  );

  const sizeValue = useMemo(() => backgroundImage?.size, [backgroundImage?.size]);

  const onSelectingSize = useCallback(
    (size: BackgroundImageDataType['size']) => {
      updateChosenElementData(
        (data) => {
          setValueByPath(data, `${valuePath}.size`, size);
        },
        { attribute: __('Background Image Position Repeat', 'yaymail') },
      );
    },
    [updateChosenElementData],
  );

  const isUsingCustomSize = useMemo(() => sizeValue === 'custom', [sizeValue]);
  const customSizeValue = useMemo(
    () => backgroundImage?.custom_size ?? 100,
    [backgroundImage?.custom_size],
  );

  const handleOnCustomSizeChange = useCallback(
    (custom_size: BackgroundImageDataType['custom_size']) => {
      updateChosenElementData(
        (data) => {
          setValueByPath(data, `${valuePath}.custom_size`, custom_size);
        },
        { attribute: __('Background Image Custom Size', 'yaymail') },
      );
    },
    [updateChosenElementData],
  );

  return (
    <>
      <MediaBase
        value={urlValue ?? ''}
        mediaUrlUpdateCallback={updateUrl}
        mediaType={media_type}
        buttonTitle={button_title}
        showPreview={show_preview}
        hidePreviewOnEmptyUrl={hide_preview_on_empty_url}
        urlInputPlaceHolder={url_input_place_holder}
        showDeleteButton={show_delete_button}
      />
      {Boolean(urlValue) && (
        <>
          <SelectorBase
            title={__('Background position', 'yaymail')}
            value={positionValue}
            onChange={onSelectingPosition}
            defaultValue={POSITIONS[0]}
          >
            {POSITION_OPTIONS}
          </SelectorBase>
          {isUsingCustomPosition && (
            <>
              <CustomSlider
                className="yaymail-background-custom-position"
                title={__('X Position', 'yaymail')}
                value={xPositionValue}
                displayUnit={'%'}
                min={-100}
                max={100}
                onChange={handleOnXPositionChange}
              />
              <CustomSlider
                className="yaymail-background-custom-position"
                title={__('Y Position', 'yaymail')}
                value={yPositionValue}
                displayUnit={'%'}
                min={-100}
                max={100}
                onChange={handleOnYPositionChange}
              />
            </>
          )}

          <SelectorBase
            title={__('Background repeat', 'yaymail')}
            value={repeatValue}
            onChange={onSelectingRepeat}
            defaultValue={POSITIONS[0]}
          >
            {REPEAT_OPTIONS}
          </SelectorBase>

          <SelectorBase
            title={__('Background size', 'yaymail')}
            value={sizeValue}
            onChange={onSelectingSize}
            defaultValue={SIZES[0]}
          >
            {SIZE_OPTIONS}
          </SelectorBase>
          {isUsingCustomSize && (
            <CustomSlider
              className="yaymail-background-custom-slider"
              title={__('Width', 'yaymail')}
              value={customSizeValue}
              displayUnit={'%'}
              min={0}
              max={100}
              onChange={handleOnCustomSizeChange}
            />
          )}
        </>
      )}
    </>
  );
};

export default BackgroundImage;
