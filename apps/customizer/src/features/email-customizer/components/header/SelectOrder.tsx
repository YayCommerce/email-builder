import React, { useContext, useMemo, useState } from 'react';

import { Empty, Select } from 'antd';

import { OrderDataContext } from '@src/layouts/customizer/providers/OrderDataProvider';

import useCustomizerPageStore from '@src/stores/customizerPage';

import './index.scss';

const { Option } = Select;

const SelectOrder = ({ ...restProps }) => {
  const { selectedOrderID, setSelectedOrderID, listOrders } = useContext(OrderDataContext);
  if (selectedOrderID === '') {
    return null;
  }
  const isEditable = useCustomizerPageStore(
    (s) => s.templateData?.support_status === 'already_supported',
  );

  return useMemo(
    () => (
      <Select
        className="yaymail-global__select"
        onChange={setSelectedOrderID}
        popupMatchSelectWidth={false}
        value={selectedOrderID}
        disabled={!isEditable}
        autoClearSearchValue
        notFoundContent={<Empty description="No order found" />}
        showSearch
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        options={(listOrders ?? []).map((order) => ({
          label: order.id === 'sample_order' ? order.title : `Order: #${order.title}`,
          value: order.id,
        }))}
        {...restProps}
      ></Select>
    ),
    [selectedOrderID, setSelectedOrderID, isEditable, restProps, listOrders],
  );
};

export default SelectOrder;
