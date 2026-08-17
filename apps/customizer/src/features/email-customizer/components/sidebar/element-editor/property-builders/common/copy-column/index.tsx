import { useCallback, useState } from 'react';

import { Button, Modal, Select } from 'antd';

import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';

import { PropertyBuilderComponentType } from '../../../types';
import { getValueByPath, setValueByPath } from '../../utils';

import './index.scss';

const { Option } = Select;

const CopyColumn: PropertyBuilderComponentType<any> = ({ store }: { store: any }) => {
  const currentColumn = store((state: any) => state.selectedColumn);

  const [isViewProductsModalOpen, setIsViewProductsModalOpen] = useState<boolean>(false);
  const handleOnViewProductsModalClose = useCallback(() => {
    setIsViewProductsModalOpen(false);
  }, []);
  const handleOnButtonViewProductsClick = useCallback(() => {
    setIsViewProductsModalOpen(true);
  }, []);

  return (
    <div className="yaymail-editor-property yaymail-editor-property-copy-column">
      <div className="yaymail-controls-container">
        <div
          className="yaymail-title"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span>
            {__('Selecting column:', 'yaymail')} {`${currentColumn}`}
          </span>
          <Button type="primary" onClick={handleOnButtonViewProductsClick}>
            {__('Copy content', 'yaymail')}
          </Button>
          <CopyColumnModal
            currentColumn={currentColumn}
            isModalOpen={isViewProductsModalOpen}
            onClose={handleOnViewProductsModalClose}
          />
        </div>
      </div>
    </div>
  );
};

export default CopyColumn;

const CopyColumnModal = (props: {
  currentColumn: any;
  isModalOpen: boolean;
  onClose: () => void;
}) => {
  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);
  const chosenElement = useTemplateContentStore((state) => state.chosenElement);

  const getColumnData = (column: number) => {
    const elementType = chosenElement?.type;

    if (elementType === 'image_list') {
      return getValueByPath(chosenElement?.data, `image_list.column_${column}`);
    } else if (elementType === 'text_list') {
      return getValueByPath(chosenElement?.data, `text_list.column_${column}`);
    }
  };

  const Column1Data = getColumnData(1);
  const Column2Data = getColumnData(2);
  const Column3Data = getColumnData(3);

  const [copyType, setCopyType] = useState('copy_to');
  const [copyColumn, setCopyColumn] = useState(props.currentColumn != '1' ? '1' : '2');

  const handleChange = (value: string) => {
    setCopyType(value);
  };

  const handleChangeColumn = (value: string) => {
    setCopyColumn(value);
  };

  const handleCopyColumn = () => {
    const currentData =
      props.currentColumn == '1'
        ? Column1Data
        : props.currentColumn == '2'
        ? Column2Data
        : Column3Data;
    const copyData =
      copyColumn == '1' ? Column1Data : copyColumn == '2' ? Column2Data : Column3Data;
    if (copyType == 'copy_to') {
      updateChosenElementData(
        (data) => {
          if (chosenElement?.type === 'image_list') {
            setValueByPath(data, 'image_list.column_' + copyColumn, currentData);
          } else if (chosenElement?.type === 'text_list') {
            setValueByPath(data, 'text_list.column_' + copyColumn, currentData);
          }
        },
        { attribute: __('Copy column', 'yaymail') },
      );
    } else {
      updateChosenElementData(
        (data) => {
          if (chosenElement?.type === 'image_list') {
            setValueByPath(data, 'image_list.column_' + props.currentColumn, copyData);
          } else if (chosenElement?.type === 'text_list') {
            setValueByPath(data, 'text_list.column_' + props.currentColumn, copyData);
          }
        },
        { attribute: __('Copy column', 'yaymail') },
      );
    }
  };

  return (
    <Modal
      title={__('You are selecting column', 'yaymail') + ` ${props.currentColumn}`}
      open={props.isModalOpen}
      onCancel={props.onClose}
      footer={null}
      centered
      destroyOnClose
      wrapClassName="yaymail-copy-column-modal"
    >
      <table>
        <tbody>
          <tr>
            <td>
              <Button type="primary" onClick={handleCopyColumn}>
                {__('Copy content', 'yaymail')}
              </Button>
            </td>
            <td>
              <Select
                style={{ width: '120px' }}
                className="yaymail-global__select"
                defaultValue={copyType}
                onChange={handleChange}
                popupMatchSelectWidth={false}
              >
                <Option value="copy_to">
                  <span
                    style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                  >
                    {__('To', 'yaymail')}
                  </span>
                </Option>
                <Option value="copy_from">
                  <span
                    style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                  >
                    {__('From', 'yaymail')}
                  </span>
                </Option>
              </Select>
            </td>
            <td>
              <Select
                style={{ width: '170px' }}
                className="yaymail-global__select"
                defaultValue={copyColumn}
                onChange={handleChangeColumn}
                popupMatchSelectWidth={false}
              >
                <Option value="1">
                  <span
                    style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                  >
                    {__('Column 1', 'yaymail')}
                  </span>
                </Option>

                <Option value="2">
                  <span
                    style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                  >
                    {__('Column 2', 'yaymail')}
                  </span>
                </Option>

                <Option value="3">
                  <span
                    style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                  >
                    {__('Column 3', 'yaymail')}
                  </span>
                </Option>
              </Select>
            </td>
          </tr>
        </tbody>
      </table>
    </Modal>
  );
};
