/* eslint-disable react-refresh/only-export-components */
import { ChangeEvent, MouseEvent, useCallback, useMemo } from 'react';

import { DeleteOutlined } from '@ant-design/icons';
import { Button, Image as AntdImage, Input, Space } from 'antd';

// eslint-disable-next-line no-restricted-imports
import withMemo from '@src/features/email-customizer/components/email-template-container/elements/with-memo';

import { useWordpressMediaSelector } from '@src/hooks/useWordpressMediaSelector';

import COMMON_ASSET_STRINGS from '@src/assets/common.json';
import { isDefined } from '@src/utils';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';

import { PropertyBuilderComponentType } from '../../../types';
import { MediaBaseType } from './type';

import './index.scss';

const MediaBase: PropertyBuilderComponentType<MediaBaseType> = (props?) => {
  const mediaType = useMemo(() => props?.mediaType ?? 'image', [props?.mediaType]);

  const { value, mediaUrlUpdateCallback } = props || {};

  if (!mediaUrlUpdateCallback) return null;

  const { mediaUploader } = useWordpressMediaSelector(
    'yaymail-logo-element-uploader',
    mediaUrlUpdateCallback,
    false,
    mediaType,
  );

  const showMediaSelectorModal = useCallback(() => {
    if (mediaUploader) {
      mediaUploader.open();
    }
  }, [mediaUploader]);

  const handleOnInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (isDefined(e.target.value)) {
        mediaUrlUpdateCallback(e.target.value);
      }
    },
    [mediaUrlUpdateCallback],
  );

  const title = useMemo(() => props?.title ?? __('Image URL', 'yaymail'), [props?.title]);

  const buttonTitle = useMemo(() => props?.buttonTitle ?? 'Change image', [props?.buttonTitle]);

  const showPreview = useMemo(() => {
    if (props?.hidePreviewOnEmptyUrl) {
      return Boolean(value && (props?.showPreview ?? true));
    }
    return props?.showPreview ?? true;
  }, [props?.showPreview, value, props?.hidePreviewOnEmptyUrl]);

  const showDeleteButton = useMemo(() => props?.showDeleteButton, [props?.showDeleteButton]);

  const isBtnDeleteDisabled = useMemo(() => !value, [value]);

  const handleDeleteImage = useCallback(
    (e: MouseEvent, isBtnDeleteDisabled: boolean) => {
      e.stopPropagation();
      if (isBtnDeleteDisabled) return;
      mediaUrlUpdateCallback('');
    },
    [mediaUrlUpdateCallback],
  );

  return (
    <div
      className={classNames(
        'yaymail-editor-property',
        'yaymail-editor-property-image',
        props?.className,
      )}
    >
      <div className="yaymail-title">{__(title)}</div>
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <Input
          className="yaymail-custom-input"
          placeholder={props?.urlInputPlaceHolder}
          value={value}
          onChange={handleOnInputChange}
        />
        <Button
          color="default"
          variant="solid"
          className="yaymail-change-image-btn"
          onClick={showMediaSelectorModal}
        >
          {__(buttonTitle)}

          {showDeleteButton && (
            <DeleteOutlined
              className={classNames(
                'yaymail-btn-delete',
                isBtnDeleteDisabled && 'yaymail-disabled',
              )}
              onClick={(e) => handleDeleteImage(e, isBtnDeleteDisabled)}
              disabled={isBtnDeleteDisabled}
            />
          )}
        </Button>
        {showPreview && (
          <AntdImage
            className="yaymail-preview-image"
            fallback={COMMON_ASSET_STRINGS.fallbackImage}
            src={value ?? ''}
            preview={false}
            width={'100%'}
          />
        )}
      </Space>
    </div>
  );
};

export default withMemo(MediaBase);
