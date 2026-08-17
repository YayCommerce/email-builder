import React, { useMemo, useState } from 'react';

import { Button, Tooltip } from 'antd';

import { ReactComponent as EmptyTemplateIcon } from '@src/assets/svgs/empty-template-icon.svg';
import useCustomizerPageStore from '@src/stores/customizerPage';
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';

import Modal from './Modal';

const BlankTemplate: React.FC = () => {
  const isEditable = useCustomizerPageStore(
    (s) => s.templateData?.support_status === 'already_supported',
  );

  const [openModal, setOpenModal] = useState<boolean>(false);

  const isContentEmpty = useTemplateContentStore((state) => state.list?.length === 0);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const isDisabled = useMemo(() => isContentEmpty || !isEditable, [isContentEmpty, isEditable]);

  return (
    <div className="header__btn--action">
      <Tooltip placement="bottom" title={__('Empty layout', 'yaymail')}>
        <Button onClick={handleOpenModal} disabled={isDisabled} className="yaymail-btn--icon-only">
          <span className="anticon" style={{ display: 'flex' }}>
            <EmptyTemplateIcon />
          </span>
        </Button>
      </Tooltip>
      {!isDisabled && (
        <Modal isOpen={openModal} onOpen={handleOpenModal} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default BlankTemplate;
