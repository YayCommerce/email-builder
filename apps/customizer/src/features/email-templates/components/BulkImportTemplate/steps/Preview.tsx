import React from 'react';

import PreviewStep, {
  type PreviewDeviceType,
} from '@src/features/email-customizer/components/header/TemplateLibrary/ContentMapping/PreviewStep';

import { IElement } from '@src/features/email-customizer/type';
import { ITemplate } from '@src/features/email-templates';
import { __ } from '@wordpress/i18n';

interface Step4Props {
  templates: ITemplate[];
  previewEmailIdx: number;
  onSelectEmail: (idx: number) => void; // eslint-disable-line no-unused-vars
  getFinalElements: (idx: number) => IElement[]; // eslint-disable-line no-unused-vars
  reviewedEmailIndices: Set<number>;
  device: PreviewDeviceType;
  onDeviceChange: (device: PreviewDeviceType) => void; // eslint-disable-line no-unused-vars
}

const Preview: React.FC<Step4Props> = ({
  templates,
  previewEmailIdx,
  onSelectEmail,
  getFinalElements,
  reviewedEmailIndices,
  device,
  onDeviceChange,
}) => {
  const finalElements = getFinalElements(previewEmailIdx);

  return (
    <div className="yaymail-bulk-import__step4">
      {/* Left: email list */}
      <div className="yaymail-bulk-import__step4-list">
        <div className="yaymail-bulk-import__step4-list-title">{__('Email Types', 'yaymail')}</div>
        {templates.map((template, idx) => (
          <button
            key={template.name}
            className={`yaymail-bulk-import__step4-list-item${
              idx === previewEmailIdx ? ' is-active' : ''
            }`}
            onClick={() => onSelectEmail(idx)}
          >
            <span className="yaymail-bulk-import__step4-list-item-status">
              {reviewedEmailIndices.has(idx) ? '✅' : '⚠️'}
            </span>
            <span className="yaymail-bulk-import__step4-list-item-title">
              {template.template_title}
            </span>
          </button>
        ))}
      </div>

      {/* Right: preview */}
      <div className="yaymail-bulk-import__step4-preview">
        <PreviewStep
          finalElements={finalElements}
          device={device}
          onDeviceChange={onDeviceChange}
        />
      </div>
    </div>
  );
};

export default Preview;
