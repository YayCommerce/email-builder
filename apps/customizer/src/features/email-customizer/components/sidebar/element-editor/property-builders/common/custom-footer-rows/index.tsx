import { useCallback, useMemo, useState } from 'react';

import { Button, Input, Select, Switch } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';

import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';
import { getValueByPath, setValueByPath } from '@yaymail/utilities/src/functions';

import { PropertyBuilderComponentType } from '../../../types';

import './index.scss';

const { Option } = Select;
const { TextArea } = Input;

interface CustomFooterRow {
  id: string;
  label: string;
  value: string;
  zone: 'before_all' | 'after_subtotal' | 'before_total' | 'after_total';
  order: number;
  enabled: boolean;
}

interface CustomFooterRowsType {
  value_path?: string;
  default_value?: CustomFooterRow[];
  title?: string;
}

const ZONE_OPTIONS = [
  {
    value: 'before_all',
    label: 'Top of footer',
  },
  {
    value: 'after_subtotal',
    label: 'After subtotal',
  },
  {
    value: 'before_total',
    label: 'Before total',
  },
  {
    value: 'after_total',
    label: 'After total',
  },
];

const CustomFooterRowsEditor: PropertyBuilderComponentType<CustomFooterRowsType> = (props) => {
  const { value_path = 'custom_footer_rows', default_value = [], title } = props || {};

  const rows = useTemplateContentStore((state) => {
    return getValueByPath(state.chosenElement?.data, value_path) ?? default_value;
  });

  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);

  const handleAddRow = useCallback(() => {
    const newRow: CustomFooterRow = {
      id: `custom_row_${Date.now()}`,
      label: 'Custom Label:',
      value: 'Custom Value',
      zone: 'before_total',
      order: rows.length,
      enabled: true,
    };
    updateChosenElementData(
      (data) => {
        const currentRows = getValueByPath(data, value_path) ?? [];
        setValueByPath(data, value_path, [...currentRows, newRow]);
      },
      { attribute: title },
    );
  }, [updateChosenElementData, value_path, title, rows.length]);

  const handleUpdateRow = useCallback(
    (id: string, updates: Partial<CustomFooterRow>) => {
      updateChosenElementData(
        (data) => {
          const currentRows = (getValueByPath(data, value_path) ?? []) as CustomFooterRow[];
          const updatedRows = currentRows.map((row) =>
            row.id === id ? { ...row, ...updates } : row,
          );
          setValueByPath(data, value_path, updatedRows);
        },
        { attribute: title },
      );
    },
    [updateChosenElementData, value_path, title],
  );

  const handleDeleteRow = useCallback(
    (id: string) => {
      updateChosenElementData(
        (data) => {
          const currentRows = (getValueByPath(data, value_path) ?? []) as CustomFooterRow[];
          const filteredRows = currentRows.filter((row) => row.id !== id);
          setValueByPath(data, value_path, filteredRows);
        },
        { attribute: title },
      );
    },
    [updateChosenElementData, value_path, title],
  );

  const confirmDeleteRow = useCallback(
    (id: string) => {
      handleDeleteRow(id);
    },
    [handleDeleteRow],
  );

  const handleMoveRow = useCallback(
    (id: string, direction: 'up' | 'down') => {
      updateChosenElementData(
        (data) => {
          const currentRows = (getValueByPath(data, value_path) ?? []) as CustomFooterRow[];
          const index = currentRows.findIndex((row) => row.id === id);
          if (index === -1) return;

          const newIndex = direction === 'up' ? index - 1 : index + 1;
          if (newIndex < 0 || newIndex >= currentRows.length) return;

          const newRows = [...currentRows];
          [newRows[index], newRows[newIndex]] = [newRows[newIndex], newRows[index]];

          // Update order values
          newRows.forEach((row, i) => {
            row.order = i;
          });

          setValueByPath(data, value_path, newRows);
        },
        { attribute: title },
      );
    },
    [updateChosenElementData, value_path, title],
  );

  return (
    <div className="yaymail-editor-property yaymail-editor-property-custom-footer-rows">
      <div className="custom-footer-rows-header">
        <div className="yaymail-title">{__(title ?? 'Custom Footer Rows', 'yaymail')}</div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRow} size="small">
          {__('Add Row', 'yaymail')}
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="custom-footer-rows-empty">
          <p>{__('No custom rows added yet.', 'yaymail')}</p>
          <p>{__('Click "Add Row" to create a custom footer row.', 'yaymail')}</p>
        </div>
      ) : (
        <div className="custom-footer-rows-list">
          {(rows as CustomFooterRow[]).map((row, index) => {
            const canMoveUp = index > 0;
            const canMoveDown = index < rows.length - 1;

            return (
              <div key={row.id} className="custom-row-item">
                <div className="row-header">
                  <span className="row-title">
                    {__('Row', 'yaymail')} {index + 1}
                  </span>
                  <div className="row-action">
                    <Button
                      type="text"
                      icon={<ArrowUpOutlined />}
                      onClick={() => handleMoveRow(row.id, 'up')}
                      disabled={!canMoveUp}
                      size="small"
                      title={__('Move up', 'yaymail')}
                    />
                    <Button
                      type="text"
                      icon={<ArrowDownOutlined />}
                      onClick={() => handleMoveRow(row.id, 'down')}
                      disabled={!canMoveDown}
                      size="small"
                      title={__('Move down', 'yaymail')}
                    />
                    <DeleteOutlined
                      className="delete-icon"
                      onClick={() => confirmDeleteRow(row.id)}
                      title={__('Delete this row', 'yaymail')}
                    />
                  </div>
                </div>

                {row.enabled && (
                  <div className="row-content">
                    <div className="form-group">
                      <label>{__('Title', 'yaymail')}</label>
                      <TextArea
                        value={row.label}
                        onChange={(e) => handleUpdateRow(row.id, { label: e.target.value })}
                        placeholder={__('e.g., Processing Fee:', 'yaymail')}
                        rows={2}
                        autoSize={{ minRows: 1, maxRows: 3 }}
                      />
                    </div>

                    <div className="form-group">
                      <label>{__('Value', 'yaymail')}</label>
                      <TextArea
                        value={row.value}
                        onChange={(e) => handleUpdateRow(row.id, { value: e.target.value })}
                        placeholder={__('e.g., $5.00', 'yaymail')}
                        rows={2}
                        autoSize={{ minRows: 1, maxRows: 3 }}
                      />
                    </div>

                    <div className="form-group">
                      <label>{__('Position in footer:', 'yaymail')}</label>
                      <Select
                        value={row.zone}
                        onChange={(val) => handleUpdateRow(row.id, { zone: val })}
                        style={{ width: '100%' }}
                      >
                        {ZONE_OPTIONS.map((opt) => (
                          <Option key={opt.value} value={opt.value}>
                            <div className="zone-option">
                              <div>
                                <div className="zone-label">{opt.label}</div>
                              </div>
                            </div>
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomFooterRowsEditor;
