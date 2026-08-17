import React, { useMemo } from 'react';

import { Badge, Select, Tooltip } from 'antd';

import useNavigationWithConfirmation from '@src/hooks/useNavigationWithConfirmation';

import useCustomizerPageStore from '@src/stores/customizerPage';
import useTemplateContentStore from '@src/stores/templateContent';

import './SelectTemplate.scss';
import { __ } from '@wordpress/i18n';

const SelectTemplate = ({ ...restProps }) => {
  const selectedTemplate = useCustomizerPageStore((state) => state.currentTemplate);
  const templateList = useCustomizerPageStore((state) => state.templates);
  const unchooseElement = useTemplateContentStore((state) => state.unchooseElement);

  const navigateWithConfirmation = useNavigationWithConfirmation();
  const handleChangeTemplate = (value: string) => {
    navigateWithConfirmation(`/customizer/?template=${value}`);
    unchooseElement();
  };

  const checkedLengthList = useMemo(
    () =>
      (templateList ?? []).map((template) => ({
        ...template,
        isTitleOversized: template.template_title.length > 33,
      })),
    [templateList],
  );

  return (
    <Select
      placeholder="Select template"
      className="yaymail-global__select header__select-template"
      value={selectedTemplate}
      onChange={handleChangeTemplate}
      popupMatchSelectWidth={false}
      popupClassName="header__select-template--popup"
      {...restProps}
    >
      {checkedLengthList.map((template) => {
        const recipient = template.recipient ? template.recipient : __('Recipient', 'yaymail');
        let badgeColor = 'cyan';
        let badgeClass = 'option-template__template-recipient--third';

        if (recipient === __('Customer', 'woocommerce')) {
          badgeColor = 'blue';
          badgeClass = 'option-template__template-recipient--primary';
        }

        const isNameOversized = recipient.length > 11;

        return (
          <Select.Option key={template.name} value={template.name} className="option-template">
            <div className="option-template__content">
              <Tooltip
                placement="right"
                title={template.isTitleOversized ? template.template_title : ''}
                overlayInnerStyle={{ fontSize: '11px', width: 'max-content' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Badge
                    status={template.status === 'active' ? 'success' : 'default'}
                    className="option-template__template-status"
                  />
                  <span className="option-template__text">{template.template_title}</span>
                </span>
              </Tooltip>
              <Tooltip
                placement="right"
                title={isNameOversized ? recipient : ''}
                overlayInnerStyle={{ width: 'max-content' }}
              >
                <Badge
                  style={{ marginLeft: 3 }}
                  count={recipient}
                  color={badgeColor}
                  className={`option-template__template-recipient ${badgeClass}`}
                />
              </Tooltip>
            </div>
          </Select.Option>
        );
      })}
    </Select>
  );
};

export default SelectTemplate;
