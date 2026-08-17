import { UIEventHandler, useCallback } from 'react';

import { Select } from 'antd';

import { isDefined } from '@src/utils';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';

import { PropertyBuilderComponentType } from '../../../types';
import { SelectorType } from './type';

const SelectorBase: PropertyBuilderComponentType<SelectorType> = (props?) => {
  const {
    title,
    children,
    options,
    defaultValue,
    onChange,
    value,
    onPopupScroll,
    onPopupScrollBottom,
    style,
    className,
    ...rest
  } = props || {};

  const handleOnPopupScroll: UIEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (onPopupScroll) {
        onPopupScroll(e);
      }

      /**
       * Handle onPopupScrollBottom
       */
      if (!onPopupScrollBottom) return;
      const target = e.target as HTMLElement;
      if (target.scrollTop + target.offsetHeight !== target.scrollHeight) return;
      onPopupScrollBottom();
    },
    [onPopupScrollBottom, onPopupScroll],
  );

  return (
    <div className={classNames('yaymail-editor-property', 'yaymail-editor-selector', className)}>
      {title !== '' && <div className="yaymail-title">{__(title ?? 'Select')}</div>}
      <Select
        style={{ width: '100%', ...style }}
        options={!isDefined(children) ? options : undefined}
        value={value || defaultValue || options?.[0]?.value}
        onChange={onChange}
        onPopupScroll={handleOnPopupScroll}
        {...rest}
      >
        {children}
      </Select>
    </div>
  );
};

export default SelectorBase;
