import React from 'react';

import { Radio } from 'antd';

import { __ } from '@wordpress/i18n';

import { OrphanDecision, OrphanItem } from './types';
import { getContentPreviewText } from './utils';

interface LegacySectionProps {
  orphans: OrphanItem[];
  onUpdateOrphan: (index: number, decision: OrphanDecision) => void; // eslint-disable-line no-unused-vars
  actions?: React.ReactNode;
}

const LegacySection: React.FC<LegacySectionProps> = ({ orphans, onUpdateOrphan, actions }) => {
  if (orphans.length === 0) return null;

  return (
    <div className="yaymail-template-library__legacy">
      <div className="yaymail-template-library__legacy-header">
        <div className="yaymail-template-library__legacy-header-icon">⚠️</div>
        <div className="yaymail-template-library__legacy-header-text">
          <div className="yaymail-template-library__legacy-title">
            {__('Legacy Elements', 'yaymail')}
            <span className="yaymail-template-library__legacy-count">{orphans.length}</span>
          </div>
          <p className="yaymail-template-library__legacy-description">
            {__(
              'These elements are not in the new template and will be removed by default.',
              'yaymail',
            )}
          </p>
        </div>
      </div>

      {actions}

      <div className="yaymail-template-library__legacy-list">
        {orphans.map((orphan, idx) => (
          <div key={orphan.element.id} className="yaymail-template-library__legacy-card">
            <div className="yaymail-template-library__legacy-card-info">
              <span className="yaymail-template-library__legacy-card-icon">📦</span>
              <div className="yaymail-template-library__legacy-card-content">
                <div className="yaymail-template-library__legacy-card-name">
                  {orphan.element.name || orphan.element.type}
                </div>
                <div className="yaymail-template-library__legacy-card-preview">
                  {getContentPreviewText(orphan.element)}
                </div>
              </div>
            </div>

            <Radio.Group
              className="yaymail-template-library__legacy-card-toggle"
              value={orphan.decision}
              onChange={(e) => onUpdateOrphan(idx, e.target.value as OrphanDecision)}
            >
              {(['delete', 'append'] as OrphanDecision[]).map((val) => (
                <div
                  key={val}
                  className={`yaymail-template-library__legacy-card-toggle-btn ${
                    orphan.decision === val ? 'active' : ''
                  }`}
                  onClick={() => onUpdateOrphan(idx, val)}
                >
                  <Radio value={val}>
                    {val === 'delete'
                      ? __('Remove in new template', 'yaymail')
                      : __('Keep it', 'yaymail')}
                  </Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LegacySection;
