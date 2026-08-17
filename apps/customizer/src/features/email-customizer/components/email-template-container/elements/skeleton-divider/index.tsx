import { Skeleton } from 'antd';

import './index.scss';

const SkeletonDivider = () => {
  return (
    <div className="yaymail-skeleton-divider">
      <Skeleton
        title={false}
        round
        paragraph={{ rows: 1, width: '30%' }}
        style={{ marginBottom: 10 }}
      />
      <Skeleton
        title={false}
        round
        paragraph={{ rows: 1, width: '100%' }}
        className="yaymail-skeleton-divider__image"
        style={{ marginBottom: 10 }}
      />
      <Skeleton title={false} round paragraph={{ rows: 1, width: '70%' }} />
      <Skeleton title={false} round paragraph={{ rows: 1, width: '100%' }} />
      <Skeleton title={false} round paragraph={{ rows: 1, width: '100%' }} />
    </div>
  );
};

export default SkeletonDivider;
