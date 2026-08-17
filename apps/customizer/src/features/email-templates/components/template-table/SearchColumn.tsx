import { RefObject } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Input, InputRef, TableColumnType } from 'antd';

import { __ } from '@wordpress/i18n';

import { ITemplate } from '../../types';

type DataIndex = keyof ITemplate;

export const getColumnSearchProps = (
  dataIndex: DataIndex,
  searchInput: RefObject<InputRef>,
): TableColumnType<ITemplate> => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
    <div onKeyDown={(e) => e.stopPropagation()} className="yaymail-templates-filter-wrapper">
      <Input
        ref={searchInput}
        placeholder={__('Search template name', 'yaymail')}
        value={selectedKeys[0]}
        onChange={(e) => {
          setSelectedKeys(e.target.value ? [e.target.value] : []);
          confirm({ closeDropdown: false });
        }}
        allowClear
        onPressEnter={() => confirm()}
        className="yaymail-templates-filter-search"
      />
    </div>
  ),
  filterIcon: () => <SearchOutlined style={{ fontSize: 15 }} />,
  onFilter: (value, record) =>
    Boolean(
      record?.[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    ),
  render: (text) => text,
});
