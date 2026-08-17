import React from 'react';

import { Button, Checkbox } from 'antd';

import { ITemplate } from '@src/features/email-templates';
import { __ } from '@wordpress/i18n';

interface Step2Props {
  templates: ITemplate[];
  selectedNames: string[];
  templateTitle: string;
  onToggle: (name: string) => void; // eslint-disable-line no-unused-vars
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const ChooseEmailTypes: React.FC<Step2Props> = ({
  templates,
  selectedNames,
  templateTitle,
  onToggle,
  onSelectAll,
  onDeselectAll,
}) => {
  const allSelected = templates.length > 0 && selectedNames.length === templates.length;

  return (
    <div className="yaymail-bulk-import__step2">
      <p className="yaymail-bulk-import__step2-description">
        {__('Choose which email types will use', 'yaymail')}{' '}
        <strong>&ldquo;{templateTitle}&rdquo;</strong>.
      </p>

      <div className="yaymail-bulk-import__step2-toolbar">
        <div className="yaymail-bulk-import__step2-actions">
          <Button size="small" onClick={onSelectAll} disabled={allSelected}>
            {__('Select All', 'yaymail')}
          </Button>
          <Button size="small" onClick={onDeselectAll} disabled={selectedNames.length === 0}>
            {__('Deselect All', 'yaymail')}
          </Button>
        </div>
        <span className="yaymail-bulk-import__step2-count">
          {selectedNames.length} {__('selected', 'yaymail')}
        </span>
      </div>

      <div className="yaymail-bulk-import__step2-list">
        {templates.map((template) => (
          <label key={template.name} className="yaymail-bulk-import__step2-item">
            <Checkbox
              checked={selectedNames.includes(template.name)}
              onChange={() => onToggle(template.name)}
            />
            <div className="yaymail-bulk-import__step2-item-info">
              <span className="yaymail-bulk-import__step2-item-title">
                {template.template_title}
              </span>
              <span className="yaymail-bulk-import__step2-item-name">{template.name}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ChooseEmailTypes;
