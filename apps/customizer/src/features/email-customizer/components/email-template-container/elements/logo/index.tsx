import { CSSProperties, useMemo } from 'react';

import ElementWrapper from '@src/features/email-customizer/components/element-wrapper';

import { ITemplateProps } from '@src/features/email-customizer/type';
import { __ } from '@wordpress/i18n';
import { getDimensionValue } from '@yaymail/utilities/src/functions';

import withMemo from '../with-memo';

import './index.scss';

const DEFAULT_WIDTH = 172;
const LogoContent = ({ element }: ITemplateProps<'logo'>) => {
  const data = element.data;

  const wrapperStyles: CSSProperties = useMemo(
    () => ({
      textAlign: data.align ?? 'center',
      paddingTop: getDimensionValue(data.padding.top ?? 0),
      paddingRight: getDimensionValue(data.padding.right ?? 0),
      paddingBottom: getDimensionValue(data.padding.bottom ?? 0),
      paddingLeft: getDimensionValue(data.padding.left ?? 0),
      backgroundColor: data.background_color || 'transparent',
    }),
    [data],
  );

  const imgStyles: CSSProperties = useMemo(
    () => ({
      width: getDimensionValue(data.width) ?? DEFAULT_WIDTH,
    }),
    [data.width],
  );
  return (
    <ElementWrapper
      className="yaymail-customizer-element-logo"
      element={element}
      style={wrapperStyles}
    >
      <a
        className="yaymail-customizer-element-logo__anchor"
        href={data.url}
        target="_blank"
        rel="noreferrer"
      >
        <img src={data.src} style={imgStyles} alt={data.alt ?? ''} />
      </a>
    </ElementWrapper>
  );
};

const Logo = withMemo(LogoContent);

export default Logo;
