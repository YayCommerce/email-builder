import { useMemo } from 'react';

import { Tooltip } from 'antd';

import NewBadge from '@src/components/new-badge';

import { isWpPlatform } from '@src/common/platform';
import { DISABLED_ELEMENT_CLASS_NAME } from '@src/features/email-customizer/constants';
import useCustomizerPageStore from '@src/stores/customizerPage';
import { __ } from '@wordpress/i18n';

import { IElement } from '../../../type';
import ElementWrapper from '../../element-wrapper';

import './index.scss';

type Props = {
  element: IElement;
  onClick?: () => void;
  className?: string;
};
const Element = ({ element, onClick, className }: Props) => {
  const { name, style, icon, available, status_info, disabled_reason } = element;
  const templateName = useCustomizerPageStore((state) => state.templateData?.name);
  const isLongName = useMemo(() => (name?.length ?? 0) >= 43, [name]);

  const hasWooCommerceTag = useMemo(() => {
    return element.tags?.includes('woocommerce');
  }, [element.tags]);

  const tooltipTitle = useMemo(() => {
    if (!isLongName && available && !templateName?.startsWith('wp-core-')) return '';
    if (!hasWooCommerceTag && available && templateName?.startsWith('wp-core-')) return '';
    return (
      <div style={{ textAlign: 'center' }}>
        {isLongName && <div>{name}</div>}
        {(!available || hasWooCommerceTag) && (
          <div
            style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 8 }}
            dangerouslySetInnerHTML={{
              __html: disabled_reason?.html ?? __('Not available in this template', 'yaymail'),
            }}
          ></div>
        )}
      </div>
    );
  }, [available, isLongName, name, disabled_reason, hasWooCommerceTag, templateName]);

  // hide if woocommerce tag but has_wc_customizer is false
  if (isWpPlatform() && hasWooCommerceTag) {
    return null;
  }

  return (
    <ElementWrapper
      element={element}
      style={style}
      selectable={false}
      isSidebar
      onClick={onClick}
      className={className}
    >
      <Tooltip
        placement="bottom"
        title={tooltipTitle}
        overlayInnerStyle={{ maxWidth: '300px', fontSize: '11px' }}
      >
        <div
          className={`yaymail-customizer-sidebar-element ${
            !available || (hasWooCommerceTag && templateName?.startsWith('wp-core-'))
              ? DISABLED_ELEMENT_CLASS_NAME
              : ''
          }`}
        >
          <div
            className="yaymail-element__icon yaymail-pointer-events-none"
            dangerouslySetInnerHTML={{ __html: icon }}
          ></div>

          <div className="yaymail-customizer-sidebar-element__name yaymail-pointer-events-none">
            {name}
          </div>
          <div className="yaymail-customizer-sidebar-element__status-info">
            {status_info !== undefined && (
              <NewBadge text={status_info.text} color={status_info.color} />
            )}
          </div>
        </div>
        <div className="yaymail-ghost-element">
          <div
            className="yaymail-element__icon yaymail-pointer-events-none"
            dangerouslySetInnerHTML={{ __html: icon }}
          ></div>
        </div>
      </Tooltip>
    </ElementWrapper>
  );
};

export default Element;
