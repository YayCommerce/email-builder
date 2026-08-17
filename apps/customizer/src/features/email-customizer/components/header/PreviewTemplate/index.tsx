import React, { useContext, useState } from 'react';

import { Button, Tooltip } from 'antd';

import { OrderDataContext } from '@src/layouts/customizer/providers/OrderDataProvider';

import { previewEmail } from '@src/common/ajax';
import useCustomizerPageStore from '@src/stores/customizerPage';
import useTemplateContentStore from '@src/stores/templateContent';

import { ReactComponent as PreviewIcon } from '@src/assets/svgs/preview-icon.svg';

import Modal from './Modal';

const PreviewTemplate: React.FC = () => {
  const isEditable = useCustomizerPageStore(
    (s) => s.templateData?.support_status === 'already_supported',
  );

  const { selectedOrderID } = useContext(OrderDataContext);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<{ html: string; subject: string } | null>(null);

  const fetchPreviewContentHtml = async () => {
    setIsLoading(true);

    try {
      let templateData = useCustomizerPageStore.getState().templateData;
      const elements = useTemplateContentStore.getState().list;
      const response = await previewEmail(
        { ...templateData, elements } as typeof templateData,
        selectedOrderID,
      );
      if (response.success) {
        setPreviewData({
          html: response.data.html,
          subject: response.data.subject,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => {
    fetchPreviewContentHtml();
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setPreviewData(null);
  };

  return (
    <div className="header__btn--action">
      <Tooltip placement="bottom" title="Preview email">
        <Button onClick={handleOpenModal} disabled={!isEditable} className="yaymail-btn--icon-only">
          <span className="anticon" style={{ display: 'flex' }}>
            <PreviewIcon />
          </span>
        </Button>
      </Tooltip>
      <Modal
        isOpen={openModal}
        isLoading={isLoading}
        data={previewData}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default PreviewTemplate;
