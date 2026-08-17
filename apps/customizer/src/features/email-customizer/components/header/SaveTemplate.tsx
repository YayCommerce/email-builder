import React, { useContext, useMemo, useState } from 'react';

import { DownOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

import { CustomizerPageContext } from '@src/layouts/customizer/providers/CustomizerProvider';

import useSaveTemplate from '@src/hooks/useSaveTemplate';

import useCustomizerPageStore from '@src/stores/customizerPage';
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';

import SaveAsTemplateModal from './SaveAsTemplate/Modal';

import './SaveAsTemplate/index.scss';

interface ISaveTemplateProps {
  hasIcon?: boolean;
  text?: string;
  btnClassName?: string;
  hasLoading?: boolean;
  savingText?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  /** Split button + Save as template modal (header only). */
  enableSaveAsTemplate?: boolean;
}

const SaveTemplate: React.FC<ISaveTemplateProps> = ({
  hasIcon,
  text,
  btnClassName,
  hasLoading,
  savingText,
  style,
  enableSaveAsTemplate = true,
  ...rest
}) => {
  const isEditable = useCustomizerPageStore(
    (s) => s.templateData?.support_status === 'already_supported',
  );
  const { onSaveSuccess } = useContext(CustomizerPageContext);

  const hasChanged = useTemplateContentStore((state) => state.hasChanged);

  const { saveFunction, isLoading } = useSaveTemplate({ onSaveSuccess });

  const [isSaveAsModalOpen, setIsSaveAsModalOpen] = useState(false);

  const disabled = useMemo(
    () => rest.disabled || !hasChanged || !isEditable,
    [hasChanged, isEditable, rest.disabled],
  );

  const saveAsDisabled = useMemo(() => rest.disabled || !isEditable, [isEditable, rest.disabled]);

  const saveButton = (
    <Button
      type="primary"
      disabled={disabled}
      onClick={saveFunction}
      className={
        enableSaveAsTemplate
          ? `yaymail-save-template__main-btn ${btnClassName ?? ''}`
          : btnClassName
      }
      loading={hasLoading && isLoading}
      icon={hasLoading && isLoading ? <LoadingOutlined /> : undefined}
      style={{ minWidth: 69, textAlign: 'center', ...style }}
    >
      {hasLoading && isLoading
        ? savingText ?? __('Saving...', 'yaymail')
        : text ?? __('Save', 'yaymail')}
    </Button>
  );

  return (
    <section className="yaymail-email-customizer__action yaymail-email-customizer__action__save-template">
      {enableSaveAsTemplate ? (
        <>
          <Button.Group className="yaymail-save-template__split">
            {saveButton}
            <Tooltip title={__('Save as template', 'yaymail')}>
              <Button
                type="primary"
                disabled={saveAsDisabled}
                className="yaymail-save-template__arrow-btn"
                icon={<DownOutlined />}
                aria-label={__('Save as template', 'yaymail')}
                onClick={() => setIsSaveAsModalOpen(true)}
              />
            </Tooltip>
          </Button.Group>
          <SaveAsTemplateModal
            isOpen={isSaveAsModalOpen}
            onClose={() => setIsSaveAsModalOpen(false)}
          />
        </>
      ) : (
        saveButton
      )}
    </section>
  );
};

export default SaveTemplate;
