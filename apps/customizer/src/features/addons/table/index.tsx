import { __ } from '@wordpress/i18n';
import { Empty, Spin } from 'antd';
import { useContext } from 'react';
import { AddonsContext } from '../addons-provider';
import AddonsFilters from './filters';
import AddonsTableGrid from './grid';
import AddonsTableNavigation from './navigation';
import './index.scss';

export default function AddonsTable() {
  const { isFetching, listingAddons } = useContext(AddonsContext);
  return (
    <div className="yaymail-addons-table">
      <AddonsFilters />
      {isFetching ? (
        <div className="yaymail-addons-table__loading">
          <Spin />
        </div>
      ) : listingAddons.length > 0 ? (
        <>
          <AddonsTableGrid />
          <AddonsTableNavigation />
        </>
      ) : (
        <Empty description={__('No addons found', 'yaymail')} />
      )}
    </div>
  );
}
