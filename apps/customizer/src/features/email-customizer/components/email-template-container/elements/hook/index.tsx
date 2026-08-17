import { CSSProperties, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { Spin } from 'antd';

import { OrderDataContext } from '@src/layouts/customizer/providers/OrderDataProvider';

import { getShortcodeAttributes } from '@src/hooks/useShortcode';

import { getCustomHookHtmlRequest } from '@src/common/ajax';
import YAYMAIL_TOKENS from '@src/constants/tokens';
import useCustomizerPageStore from '@src/stores/customizerPage';
import { getDimensionValue } from '@yaymail/utilities/src/functions';
import debounce from 'lodash.debounce';

import { ITemplateProps } from '../../../../type';
import ElementWrapper from '../../../element-wrapper';
import withMemo from '../with-memo';

const HookContent = ({ element }: ITemplateProps<'hook'>) => {
  const data = element.data;

  const { selectedOrderID } = useContext(OrderDataContext);
  const templateData = useCustomizerPageStore((state) => state.templateData);

  const wrapperStyles: CSSProperties = useMemo(
    () => ({
      paddingTop: getDimensionValue(data.padding.top),
      paddingRight: getDimensionValue(data.padding.right),
      paddingBottom: getDimensionValue(data.padding.bottom),
      paddingLeft: getDimensionValue(data.padding.left),
      backgroundColor: data.background_color || 'transparent',
    }),
    [data],
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const contentStyles: CSSProperties = useMemo(
    () => ({
      fontFamily: data.font_family || 'initial',
      color: data.text_color || YAYMAIL_TOKENS.color.black[700],
    }),
    [data.font_family, data.text_color, isLoading],
  );

  const [htmlContent, setHtmlContent] = useState<string>('');

  const syncHtmlContent = useCallback(
    debounce(async (shortcode: string) => {
      const attributes = getShortcodeAttributes(shortcode);

      if (!Object.keys(attributes).some((e) => e === 'hook')) return;

      try {
        const request = getCustomHookHtmlRequest({
          template_data: templateData,
          order_id: selectedOrderID,
          attributes,
        });
        setIsLoading(true);
        const response = await request.promise();
        setIsLoading(false);

        setHtmlContent(response.data.html || shortcode);
      } catch (error) {
        setHtmlContent(shortcode);
      }
    }, 400),
    [selectedOrderID, templateData],
  );

  useEffect(() => {
    syncHtmlContent(data.hook_shortcode);
  }, [data.hook_shortcode, selectedOrderID, syncHtmlContent]);

  return (
    <ElementWrapper
      className="yaymail-customizer-element-hook"
      element={element}
      style={wrapperStyles}
    >
      {isLoading ? (
        <div style={{ ...contentStyles, textAlign: 'center' }}>
          <Spin />
        </div>
      ) : (
        <div style={contentStyles} dangerouslySetInnerHTML={{ __html: htmlContent }} />
      )}
    </ElementWrapper>
  );
};
const Hook = withMemo(HookContent);

export default Hook;
