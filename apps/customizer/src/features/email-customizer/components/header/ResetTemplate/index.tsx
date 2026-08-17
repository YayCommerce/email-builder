import React, { useState } from 'react';

import { Button, Tooltip } from 'antd';

import useCustomizerPageStore from '@src/stores/customizerPage';
import { __ } from '@wordpress/i18n';

import { ReactComponent as ResetTemplateIcon } from '@src/assets/svgs/reset-template-icon.svg';

import Modal from './Modal';

const ResetTemplate: React.FC = () => {
  const isEditable = useCustomizerPageStore(
    (s) => s.templateData?.support_status === 'already_supported',
  );

  const [openModal, setOpenModal] = useState<boolean>(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  return (
    <div className="header__btn--action">
      <Tooltip placement="bottom" title={__('Reset template', 'yaymail')}>
        <Button onClick={handleOpenModal} disabled={!isEditable} className="yaymail-btn--icon-only">
          <span className="anticon" style={{ display: 'flex' }}>
            <ResetTemplateIcon />
          </span>
        </Button>
      </Tooltip>
      {isEditable && (
        <Modal isOpen={openModal} onOpen={handleOpenModal} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ResetTemplate;
