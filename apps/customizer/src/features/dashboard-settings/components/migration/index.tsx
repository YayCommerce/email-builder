import { Spin } from 'antd';

import MigrationContent from '@src/features/dashboard-settings/components/migration/MigrationContent';

import useMigrationQueries from '@src/hooks/queries/useMigrationQueries';

import './index.scss';

const Migration = () => {
  const { isLoading, data, isFetching } = useMigrationQueries();

  return isLoading ? (
    <div className="yaymail-migration__spin-wrapper">
      <Spin size="large" />
    </div>
  ) : data ? (
    <MigrationContent onloadData={data} isButtonDisabled={isFetching} />
  ) : null;
};

export default Migration;
