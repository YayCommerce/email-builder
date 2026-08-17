import React from 'react';

import { IElement } from '@src/features/email-customizer/type';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';

import { ElementId, MappingSlotItem } from './types';
import { getContentPreviewText } from './utils';

interface ElementRowProps {
  element: IElement;
  slot: MappingSlotItem;
  isActive: boolean;
  onClick: () => void;
}

const ElementRow: React.FC<ElementRowProps> = ({ element, slot, isActive, onClick }) => {
  const chosenLabel =
    slot.decision === 'use_old'
      ? getContentPreviewText(slot.oldMatches[slot.chosenOldIndex])
      : __('New template', 'yaymail');

  return (
    <div
      className={classNames(
        'yaymail-content-mapping__row',
        'yaymail-content-mapping__row--slot',
        isActive && 'yaymail-content-mapping__row--active',
      )}
      onClick={onClick}
    >
      <div className="yaymail-content-mapping__row-dot" />
      <div className="yaymail-content-mapping__row-info">
        <span className="yaymail-content-mapping__row-name">{element.name || element.type}</span>
        <span className="yaymail-content-mapping__row-value">{chosenLabel}</span>
      </div>
      <span className="yaymail-content-mapping__row-badge">{slot.oldMatches.length}</span>
    </div>
  );
};

interface MappingElementListProps {
  slots: MappingSlotItem[];
  activeTargetId: ElementId | null;
  // eslint-disable-next-line no-unused-vars -- callback type parameter
  onSelectSlot: (sourceId: ElementId) => void;
}

const MappingElementList: React.FC<MappingElementListProps> = ({
  slots,
  activeTargetId,
  onSelectSlot,
}) => (
  <div className="yaymail-content-mapping__list">
    <div className="yaymail-content-mapping__list-header">
      <div className="yaymail-content-mapping__list-header-top">
        <span className="yaymail-content-mapping__list-title">{__('ELEMENTS', 'yaymail')}</span>
        <span className="yaymail-content-mapping__list-badge">
          {slots.length} {__('replaceable', 'yaymail')}
        </span>
      </div>
      <p className="yaymail-content-mapping__list-hint">
        {__('Hover preview element or click list item to replace content', 'yaymail')}
      </p>
    </div>

    <div className="yaymail-content-mapping__list-body">
      {slots.map((slot) => (
        <ElementRow
          key={slot.newEl.id}
          element={slot.newEl}
          slot={slot}
          isActive={activeTargetId === slot.newEl.id}
          onClick={() => onSelectSlot(slot.newEl.id)}
        />
      ))}
    </div>
  </div>
);

export default MappingElementList;
