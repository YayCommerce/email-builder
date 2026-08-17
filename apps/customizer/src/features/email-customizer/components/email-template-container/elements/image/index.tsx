import { CSSProperties, useMemo } from 'react';

// eslint-disable-next-line no-restricted-imports
import { getDimensionValue } from '@src/features/email-customizer/utils';
import { __ } from '@wordpress/i18n';

import { ITemplateProps } from '../../../../type';
import ElementWrapper from '../../../element-wrapper';
import withMemo from '../with-memo';

import './index.scss';

const DEFAULT_WIDTH = 172;
const ImageContent = ({ element }: ITemplateProps<'image'>) => {
  const data = element.data;

  const wrapperStyles: CSSProperties = useMemo(
    () => ({
      textAlign: data.align ?? 'center',
      paddingTop: getDimensionValue(data.padding.top),
      paddingRight: getDimensionValue(data.padding.right),
      paddingBottom: getDimensionValue(data.padding.bottom),
      paddingLeft: getDimensionValue(data.padding.left),
      backgroundColor: data.background_color || 'transparent',
    }),
    [data],
  );

  const imgStyles: CSSProperties = useMemo(
    () => ({
      width: data.full_width ? '100%' : getDimensionValue(data.width ?? DEFAULT_WIDTH),
    }),
    [data.width, data.full_width],
  );
  return (
    <ElementWrapper
      className="yaymail-customizer-element-image"
      element={element}
      style={wrapperStyles}
    >
      <a
        className="yaymail-customizer-element-image__anchor"
        href={data.url}
        target="_blank"
        rel="noreferrer"
      >
        <img src={data.src} style={imgStyles} alt={data.alt ?? ''} />
      </a>
    </ElementWrapper>
  );
};

const Image = withMemo(ImageContent);

export default Image;
