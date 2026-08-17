/* eslint-disable no-restricted-imports */
import React, { useMemo, useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Empty, Input, message, Modal as AntModal } from 'antd';

import { ModalHeader } from '@src/components/modal-header-footer';

import { groupShortcodes } from '@src/features/email-customizer/utils';
import useCustomizerPageStore from '@src/stores/customizerPage';
import copy from 'copy-to-clipboard';

import './Modal.scss';
import styles from '@src/components/modal-header-footer/styles.module.scss';

interface IModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

interface ISearchText {
  searchText: string;
  // eslint-disable-next-line no-unused-vars
  onChangeSearchText: (value: string) => void;
}

const wrapShortcode = (text: string, attributes: { [key: string]: string | null }) => {
  if (!attributes) return `[${text}]`;

  const isOrderMeta = text.includes('yaymail_order_meta:');

  const attrStr = Object.entries(attributes)
    .filter(([, value]) => !isOrderMeta || value) // Skip empty values for order meta
    .map(([key, value]) => ` ${key}="${value}"`)
    .join('');

  return `[${text}${attrStr}]`;
};

const HeaderContent: React.FC<ISearchText> = ({ searchText, onChangeSearchText }) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeSearchText(e.target.value);
  };
  return (
    <>
      <h4 className={styles['modal_header_title']}>Shortcodes</h4>
      <div className={styles['modal-header-right']}>
        <Input
          type="text"
          className="modal__header--search"
          placeholder="Search"
          suffix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearch}
        />
      </div>
    </>
  );
};

const Modal: React.FC<IModalProps> = ({ isOpen, onClose }) => {
  const [messageApi, contextHolder] = message.useMessage({
    top: 30,
    duration: 1,
  });
  const [searchText, setSearchText] = useState<string>('');
  const handleCopyShortcode = (value: string) => () => {
    messageApi.success('Shortcode copied');
    copy(value, { format: 'text/plain' });
  };

  const allShortcodes = useCustomizerPageStore((state) => state.shortcodes);

  const matchingShortcodes = useMemo(() => {
    const compareString = searchText.toLowerCase();
    return allShortcodes.filter(
      (shortcode) =>
        shortcode.name.toLowerCase().includes(compareString) ||
        shortcode.description.toLowerCase().includes(compareString),
    );
  }, [searchText, allShortcodes]);

  const shortcodesGroups = useMemo(
    () => Object.values(groupShortcodes(matchingShortcodes)),
    [matchingShortcodes],
  );

  const handleCancel = () => {
    setSearchText('');
    onClose();
  };

  return (
    <>
      {contextHolder}
      <AntModal
        title={
          <ModalHeader
            content={<HeaderContent searchText={searchText} onChangeSearchText={setSearchText} />}
          />
        }
        className="yaymail-global__modal yaymail-shortcodes-information__modal"
        open={isOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
        centered
        destroyOnClose
      >
        {shortcodesGroups.length > 0 ? (
          shortcodesGroups.map(({ shortcodes, groupLabel }, index) => {
            return (
              // Using index as key because maybe type after translating can be duplicate.
              <div className="modal__content__shortcode-group" key={index}>
                <h4 className="modal__content__shortcode-group__title">{groupLabel} :</h4>
                <table className="modal__content__shortcode-group__table">
                  <tbody>
                    {shortcodes.map((shortcode, index) => {
                      const wrappedShortcode = wrapShortcode(shortcode.name, shortcode.attributes);
                      return (
                        <tr key={index} className="shortcode-item">
                          <td
                            className="shortcode-item__name"
                            onClick={handleCopyShortcode(wrappedShortcode)}
                          >
                            <span dangerouslySetInnerHTML={{ __html: wrappedShortcode }} />
                          </td>
                          <td className="shortcode-item__description">- {shortcode.description}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })
        ) : (
          <div className="yaymail-shortcodes-information__modal__empty">
            <Empty description="No shortcode found" />
          </div>
        )}
      </AntModal>
    </>
  );
};

export default Modal;
