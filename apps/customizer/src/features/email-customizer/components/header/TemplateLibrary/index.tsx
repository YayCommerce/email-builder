import React, { useState } from 'react';

import { Button, Tooltip } from 'antd';

import { ReactComponent as TemplatesIcon } from '@src/assets/svgs/email-templates-icon.svg';
import useCustomizerPageStore from '@src/stores/customizerPage';
import { __ } from '@wordpress/i18n';

import Modal from './Modal';

import './index.scss';

const TemplateLibrary: React.FC = () => {
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
      <Tooltip placement="bottom" title={__('Template Library', 'yaymail')}>
        <Button
          onClick={handleOpenModal}
          disabled={!isEditable}
          className="yaymail-btn--icon-only"
        >
          <span className="anticon" style={{ display: 'flex' }}>
            <TemplatesIcon/>
          </span>
          <span className='yaymail-btn--text' style={{color: 'initial'}}>{__('Templates', 'yaymail')}</span>
        </Button>
      </Tooltip>

      {isEditable && <Modal isOpen={openModal} onClose={handleCloseModal} />}
    </div>
  );
};

export default TemplateLibrary;
