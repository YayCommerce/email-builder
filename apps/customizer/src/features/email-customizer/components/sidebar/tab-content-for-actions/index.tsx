import { useCallback } from 'react';

import { CheckOutlined } from '@ant-design/icons';

import useTemplateContentHistoryStore, { IChangeInfo } from '@src/stores/templateContentHistory';

import './index.scss';

const TabContentForActions = () => {
  const changes = useTemplateContentHistoryStore((state) => state.changes);

  const timeTravelingIndex = useTemplateContentHistoryStore((state) => state.timeTravelingIndex);
  const jumpToChange = useTemplateContentHistoryStore((state) => state.jumpToChange);

  const checkIsActive = useCallback(
    (index: number) => index === timeTravelingIndex,
    [timeTravelingIndex],
  );

  const getContent = useCallback((info: IChangeInfo | null) => {
    if (!info) return null;

    if (info.action === 'initialized') {
      return <span className="yaymail-item-name-element">Customizing started</span>;
    }

    if (info.customMessage) {
      return <span className="yaymail-item-name-element">{info.customMessage}</span>;
    }

    return (
      <div style={{ margin: '0 20px 0 0' }}>
        {info?.elementName && <span className="yaymail-item-name-element">{info.elementName}</span>}
        {info?.attribute && <span className="yaymail-item-attribute"> - {info.attribute}</span>}
        {info?.action && (
          <span className="yaymail-item-type">
            {' '}
            - <span className="yaymail-item-type-content">{info.action}</span>
          </span>
        )}
      </div>
    );
  }, []);

  return (
    <section className="yaymail-list-actions">
      {changes.map(({ info }, index) => {
        return (
          <div
            className={`yaymail-list-actions__item ${
              checkIsActive(index) ? 'yaymail-list-actions__item__active' : ''
            }`}
            key={index}
            onClick={() => jumpToChange(index)}
          >
            {getContent(info)}
            {checkIsActive(index) ? <CheckOutlined /> : ''}
          </div>
        );
      })}
    </section>
  );
};

export default TabContentForActions;
