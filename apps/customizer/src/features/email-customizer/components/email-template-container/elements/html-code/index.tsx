import { CSSProperties, useMemo } from 'react';

import { CodeOutlined } from '@ant-design/icons';

import useShortcode from '@src/hooks/useShortcode';

// eslint-disable-next-line no-restricted-imports
import { ITemplateProps } from '../../../../type';
import ElementWrapper from '../../../element-wrapper';
import withMemo from '../with-memo';

import './index.scss';

const HtmlContent = ({ element }: ITemplateProps<'html'>) => {
  const data = element.data;

  const { doShortcode } = useShortcode();
  const richText = useMemo(() => data.rich_text, [data.rich_text]);
  const wrapperStyles: CSSProperties = useMemo(
    () => ({
      textAlign: richText.length > 0 ? 'unset' : 'center',
    }),
    [richText],
  );

  const shortcodedContent = useMemo(() => doShortcode(richText ?? ''), [richText, doShortcode]);
  return (
    <ElementWrapper
      className="yaymail-customizer-element-html"
      element={element}
      style={wrapperStyles}
    >
      {richText.length > 0 ? (
        <div dangerouslySetInnerHTML={{ __html: shortcodedContent }}></div>
      ) : (
        <CodeOutlined style={{ color: '#c2cbd2', fontSize: '22px' }} />
      )}
    </ElementWrapper>
  );
};

const Html = withMemo(HtmlContent);

export default Html;
