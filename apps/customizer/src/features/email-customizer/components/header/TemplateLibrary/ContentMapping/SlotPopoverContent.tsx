import React from 'react';

import { __, sprintf } from '@wordpress/i18n';
import classNames from 'classnames';

import { MappingDecision, MappingSlotItem } from './types';
import { getContentPreviewText } from './utils';

export interface SlotPopoverContentProps {
  slot: MappingSlotItem;
  newTemplateName: string;
  // eslint-disable-next-line no-unused-vars -- callback type parameters
  onPreview: (decision: MappingDecision, idx: number) => void;
  // eslint-disable-next-line no-unused-vars -- callback type parameters
  onConfirm: (decision: MappingDecision, idx: number) => void;
  onResetPreview: () => void;
}

const SlotPopoverContent: React.FC<SlotPopoverContentProps> = ({
  slot,
  newTemplateName,
  onPreview,
  onConfirm,
  onResetPreview,
}) => {
  const multipleOld = slot.oldMatches.length > 1;
  const fromNewTemplateCaption =
    newTemplateName.trim() !== ''
      ? sprintf(
          /* translators: %s: name of the template design being applied. */
          __('Default text as in "%s"', 'yaymail'),
          newTemplateName,
        )
      : __('Default text in this design', 'yaymail');

  return (
    <div className="yaymail-content-mapping__popover" onMouseLeave={onResetPreview}>
      <div className="yaymail-content-mapping__popover-title">
        {__('Choose content for', 'yaymail')} <strong>{slot.newEl.name || slot.newEl.type}</strong>
      </div>
      <div className="yaymail-content-mapping__popover-options">
        {slot.oldMatches.map((oldEl, idx) => {
          const active = slot.decision === 'use_old' && slot.chosenOldIndex === idx;
          return (
            <div
              key={oldEl.id}
              className={classNames('yaymail-content-mapping__popover-option', active && 'active')}
              onMouseEnter={() => onPreview('use_old', idx)}
              onClick={() => onConfirm('use_old', idx)}
            >
              <div className="yaymail-content-mapping__popover-option-label">
                {__('From your email', 'yaymail')}
                {multipleOld && (
                  <span className="yaymail-content-mapping__popover-option-idx"> #{idx + 1}</span>
                )}
              </div>
              <div className="yaymail-content-mapping__popover-option-text">
                {getContentPreviewText(oldEl)}
              </div>
            </div>
          );
        })}
        <div
          className={classNames(
            'yaymail-content-mapping__popover-option',
            slot.decision === 'use_new' && 'active',
          )}
          onMouseEnter={() => onPreview('use_new', 0)}
          onClick={() => onConfirm('use_new', 0)}
        >
          <div className="yaymail-content-mapping__popover-option-label yaymail-content-mapping__popover-option-label--proposed">
            {__('From new template', 'yaymail')}
          </div>
          <div className="yaymail-content-mapping__popover-option-text">
            {fromNewTemplateCaption}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotPopoverContent;
