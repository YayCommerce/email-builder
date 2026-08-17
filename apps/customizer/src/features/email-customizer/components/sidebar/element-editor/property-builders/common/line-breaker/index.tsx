import { Divider } from 'antd';

const LineBreaker = () => {
  return (
    <div className="yaymail-editor-property yaymail-editor-property-line-breaker">
      <Divider
        style={{
          borderColor: 'var(--yaymail-sidebar-color-grey-light)',
          margin: 0,
        }}
      />
    </div>
  );
};

export default LineBreaker;
