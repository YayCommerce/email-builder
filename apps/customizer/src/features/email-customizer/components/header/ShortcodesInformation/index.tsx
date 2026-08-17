import React, { useState } from 'react';

import { Button, Tooltip } from 'antd';

import { ReactComponent as ShortcodesIcon } from '@src/assets/svgs/shortcodes-icon.svg';
import useCustomizerPageStore from '@src/stores/customizerPage';

import Modal from './Modal';

const ShortcodesInformation: React.FC = () => {
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
      <Tooltip placement="bottom" title="Shortcodes">
        <Button onClick={handleOpenModal} disabled={!isEditable} className="yaymail-btn--icon-only">
          <span className="anticon" style={{ display: 'flex' }}>
            <ShortcodesIcon />
          </span>
        </Button>
      </Tooltip>
      <Modal isOpen={openModal} onOpen={handleOpenModal} onClose={handleCloseModal} />
    </div>
  );
};

export default ShortcodesInformation;
