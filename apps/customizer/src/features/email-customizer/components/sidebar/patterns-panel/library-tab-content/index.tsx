import UpgradeNotice from '@src/components/upgrade/upgrade-notice';

import { __ } from '@wordpress/i18n';

const LibraryTabContent = () => {
  // TODO: focus pattern name after open save to library modal
  return (
    <div className="yaymail-patterns-panel__tab-content" style={{ height: '100%' }}>
      <div
        className="yaymail-library-tab-content__container"
        style={{
          minHeight: 200,
          position: 'relative',
        }}
      >
        <div
          className="yaymail-pattern-list"
          style={{ opacity: 0.1, pointerEvents: 'none', userSelect: 'none' }}
        >
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="yaymail-pattern-item-wrapper">
                <div
                  className="yaymail-customizer-sidebar-element yaymail-pattern-item"
                  style={{ marginBottom: 10 }}
                >
                  <div
                    style={{ width: '100%', background: '#b8b8b8', height: 70, borderRadius: 7 }}
                  ></div>
                  <div>
                    {__('Pattern', 'yaymail')} {index + 1}
                  </div>
                </div>
              </div>
            ))}
        </div>
        <UpgradeNotice />
      </div>
    </div>
  );
};

export default LibraryTabContent;
