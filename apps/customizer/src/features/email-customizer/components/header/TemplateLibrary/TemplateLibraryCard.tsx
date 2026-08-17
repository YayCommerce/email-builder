import React, { useMemo } from 'react';

import { ClockCircleOutlined } from '@ant-design/icons';

import { TemplateLibrarySummary } from '@src/common/api/templateLibraryApi';
import { RenewedElementTreeProvider } from '@src/features/email-customizer/renewedElementTreeContext';
import { IElement } from '@src/features/email-customizer/type';
import { __ } from '@wordpress/i18n';

import EmailRecursiveElements from '../../email-template-container/email-recursive-element';
import { resolvePresetColorValues } from '../../sidebar/element-editor/property-builders/utils';
import { renewRootsForPreview } from './ContentMapping/previewElementTree';

const TemplatePreviewElements: React.FC<{ elements: IElement[] }> = ({ elements }) => {
  const previewElements = useMemo(() => renewRootsForPreview(elements), [elements]);
  return (
    <RenewedElementTreeProvider roots={previewElements}>
      <EmailRecursiveElements list={previewElements} />
    </RenewedElementTreeProvider>
  );
};

export interface TemplateLibraryCardProps {
  template: TemplateLibrarySummary;
  isSelected: boolean;
  containerWidth: number;
  previewScale: number;
  onSelect: (templateId: string) => void;
  onRequestDelete?: (template: TemplateLibrarySummary) => void;
}

const TemplateLibraryCard: React.FC<TemplateLibraryCardProps> = ({
  template,
  isSelected,
  containerWidth,
  previewScale,
  onSelect,
  onRequestDelete,
}) => {
  const isPro = template.access === 'pro';
  const isComingSoon = template.available !== true && !isPro;
  const isSaved = template.source === 'saved';
  const canSelect = template.available === true;

  const handleCardClick = () => {
    if (!canSelect) {
      return;
    }
    onSelect(template.id);
  };

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onRequestDelete?.(template);
  };

  return (
    <div
      className={`yaymail-template-library__card${
        isComingSoon
          ? ' yaymail-template-library__card--coming-soon'
          : isPro && template.available !== true
          ? ' yaymail-template-library__card--pro'
          : ''
      }${isSaved ? ' yaymail-template-library__card--saved' : ''}${
        isSelected ? ' yaymail-template-library__card--selected' : ''
      }`}
      onClick={handleCardClick}
    >
      {isComingSoon && (
        <div className="yaymail-template-library__card-badge yaymail-template-library__card-soon-badge">
          <ClockCircleOutlined style={{ fontSize: 12 }} />
          {__('SOON', 'yaymail')}
        </div>
      )}
      {isSaved && (
        <div className="yaymail-template-library__card-badge yaymail-template-library__card-saved-badge">
          {__('Saved', 'yaymail')}
        </div>
      )}
      {isPro && template.available !== true && (
        <div className="yaymail-template-library__card-badge yaymail-template-library__card-pro-badge">
          <span className="yaymail-template-library__card-pro-badge-icon">★</span>
          <span className="yaymail-template-library__card-pro-badge-text">
            {__('PRO', 'yaymail')}
          </span>
        </div>
      )}
      <div
        className={`yaymail-template-library__card-check${
          isSelected && canSelect ? ' is-visible' : ''
        }`}
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: 14, height: 14 }}
        >
          <polyline points="3.5,8.5 6.5,11.5 12.5,5.5"></polyline>
        </svg>
      </div>
      <div className="yaymail-template-library__card-preview-container">
        <div className="yaymail-template-library__card-preview">
          {isComingSoon && (
            <>
              <div className="yaymail-template-library__card-overlay yaymail-template-library__card-overlay--coming-soon">
                <div className="yaymail-template-library__card-overlay-coming-soon-content">
                  <ClockCircleOutlined className="yaymail-template-library__card-overlay-coming-soon-icon" />
                  <span className="yaymail-template-library__card-overlay-coming-soon-text">
                    {__('Coming Soon', 'yaymail')}
                  </span>
                </div>
                <div className="yaymail-template-library__card-stripe-pattern" />
              </div>
            </>
          )}
          <div
            className="yaymail-template-library__card-preview-scale"
            style={
              {
                '--yaymail-template-preview-width': `${containerWidth}px`,
                '--yaymail-template-preview-scale': previewScale,
                '--yaymail-template-preview-link-color': resolvePresetColorValues(
                  template.email_settings?.text_link_color ??
                    window.yaymailData.colors.default_text_link_color,
                  {},
                ),
              } as React.CSSProperties
            }
          >
            <div className="yaymail-customizer-email-template-container yaymail-customizer-main">
              <TemplatePreviewElements elements={template.elements} />
            </div>
          </div>
        </div>
      </div>
      <div className="yaymail-template-library__card-content">
        <div className="yaymail-template-library__card-content-title">{template.name}</div>
        <div className="yaymail-template-library__card-content-description">
          {template.description ?? ''}
        </div>
      </div>
      {isSaved && onRequestDelete && (
        <button
          type="button"
          className="yaymail-template-library__card-delete"
          onClick={handleDeleteClick}
        >
          {__('Delete', 'yaymail')}
        </button>
      )}
    </div>
  );
};

export default TemplateLibraryCard;
