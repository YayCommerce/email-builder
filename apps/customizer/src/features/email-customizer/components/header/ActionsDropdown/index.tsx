import React, { useState } from 'react';

import type { MenuProps } from 'antd';
import { Button, Dropdown } from 'antd';

import { ReactComponent as EmptyTemplateIcon } from '@src/assets/svgs/empty-template-icon.svg';
import { ReactComponent as ImportTemplateIcon } from '@src/assets/svgs/import-template-icon.svg';
import { ReactComponent as MoreActionIcon } from '@src/assets/svgs/more-action-icon.svg';
import { ReactComponent as ResetTemplateIcon } from '@src/assets/svgs/reset-template-icon.svg';
import { ReactComponent as ShortcodesIcon } from '@src/assets/svgs/shortcodes-icon.svg';
import useCustomizerPageStore from '@src/stores/customizerPage';
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';

import ClearTemplateModal from '../ClearTemplate/Modal';
import ImportTemplateModal from '../ImportTemplate/Modal';
import ResetTemplateModal from '../ResetTemplate/Modal';
import ShortcodesModal from '../ShortcodesInformation/Modal';

type ModalType = 'shortcodes' | 'empty' | 'import' | 'reset' | null;

interface ActionsDropdownProps {
  hasTemplateImporter?: boolean;
  showReset?: boolean;
}

const ActionsDropdown: React.FC<ActionsDropdownProps> = ({ hasTemplateImporter, showReset }) => {
  const [openModal, setOpenModal] = useState<ModalType>(null);

  const isEditable = useCustomizerPageStore(
    (s) => s.templateData?.support_status === 'already_supported',
  );
  const isContentEmpty = useTemplateContentStore((state) => state.list?.length === 0);

  const handleOpen = (type: ModalType) => setOpenModal(type);
  const handleClose = () => setOpenModal(null);

  const items: MenuProps['items'] = [
    {
      key: 'shortcodes',
      label: __('Shortcodes', 'yaymail'),
      icon: (
        <span className="anticon" style={{ display: 'flex' }}>
          <ShortcodesIcon width={12} height={12} />
        </span>
      ),
      disabled: !isEditable,
      onClick: () => handleOpen('shortcodes'),
    },
    {
      key: 'empty',
      label: __('Empty', 'yaymail'),
      icon: (
        <span className="anticon" style={{ display: 'flex' }}>
          <EmptyTemplateIcon width={12} height={12} />
        </span>
      ),
      disabled: isContentEmpty || !isEditable,
      onClick: () => handleOpen('empty'),
    },
    ...(hasTemplateImporter
      ? [
          {
            key: 'import',
            label: __('Import', 'yaymail'),
            icon: (
              <span className="anticon" style={{ display: 'flex' }}>
                <ImportTemplateIcon width={12} height={12} />
              </span>
            ),
            disabled: !isEditable,
            onClick: () => handleOpen('import'),
          },
        ]
      : []),
    ...(showReset
      ? [
          {
            key: 'reset',
            label: __('Reset', 'yaymail'),
            icon: (
              <span className="anticon" style={{ display: 'flex' }}>
                <ResetTemplateIcon width={12} height={12} />
              </span>
            ),
            disabled: !isEditable,
            onClick: () => handleOpen('reset'),
          },
        ]
      : []),
  ];

  return (
    <>
      <Dropdown
        menu={{ items }}
        trigger={['click']}
        placement="bottomLeft"
        overlayClassName="yaymail-actions-dropdown"
        overlayStyle={{ width: 224 }}
      >
        <Button className="yaymail-btn--icon-only yaymail-btn--actions-more">
          <MoreActionIcon />
        </Button>
      </Dropdown>

      {openModal === 'shortcodes' && (
        <ShortcodesModal isOpen onOpen={() => handleOpen('shortcodes')} onClose={handleClose} />
      )}
      {openModal === 'empty' && !isContentEmpty && isEditable && (
        <ClearTemplateModal isOpen onOpen={() => handleOpen('empty')} onClose={handleClose} />
      )}
      {openModal === 'import' && isEditable && (
        <ImportTemplateModal isOpen onOpen={() => handleOpen('import')} onClose={handleClose} />
      )}
      {openModal === 'reset' && isEditable && (
        <ResetTemplateModal isOpen onOpen={() => handleOpen('reset')} onClose={handleClose} />
      )}
    </>
  );
};

export default ActionsDropdown;
