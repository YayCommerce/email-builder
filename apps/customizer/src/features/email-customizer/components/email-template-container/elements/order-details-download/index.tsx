import { CSSProperties, useMemo } from 'react';

import { useDirection } from '@src/hooks/useDirection';
import useShortcode from '@src/hooks/useShortcode';

import YAYMAIL_TOKENS from '@src/constants/tokens';
import { ITemplateProps } from '@src/features/email-customizer/type';
import useCustomizerSettingsStore from '@src/stores/customizerSettings';
import { getDimensionValue, replacePlaceholders } from '@yaymail/utilities/src/functions';

import ElementWrapper from '../../../element-wrapper';
import withMemo from '../with-memo';

import './index.scss';

const OrderDetailsDownloadContent = ({ element }: ITemplateProps<'order_details_download'>) => {
  const data = element.data;

  const { doShortcode } = useShortcode();
  const direction = useDirection();

  const settings = useCustomizerSettingsStore((state) => state.settings);

  const showProductImage = useMemo(
    () => settings?.show_product_image ?? false,
    [settings?.show_product_image],
  );

  const productImagePosition = useMemo(
    () => settings?.product_image_position ?? 'top',
    [settings?.product_image_position],
  );

  const wrapperStyles: CSSProperties = useMemo(
    () => ({
      paddingTop: getDimensionValue(data.padding.top),
      paddingRight: getDimensionValue(data.padding.right),
      paddingBottom: getDimensionValue(data.padding.bottom),
      paddingLeft: getDimensionValue(data.padding.left),

      backgroundColor: data.background_color || 'transparent',
      fontFamily: data.font_family ?? 'initial',
    }),
    [data.padding, data.background_color, data.font_family],
  );

  const titleStyles: CSSProperties = useMemo(
    () => ({
      color: data.title_color ?? YAYMAIL_TOKENS.color.black[700],
      marginTop: getDimensionValue(0),
      fontFamily: data.font_family ?? 'initial',
      marginBottom: getDimensionValue(7),
    }),
    [data.title_color, data.font_family, getDimensionValue],
  );

  const tableStyles: CSSProperties = useMemo(
    () => ({
      border: `1px solid ${data.border_color}`,
      fontFamily: data.font_family ?? 'initial',
      color: data.text_color ?? YAYMAIL_TOKENS.color.black[700],
      width: '100%',
    }),
    [data.font_family, data.text_color, data.border_color],
  );

  const isLayoutTypeModern = useMemo(() => data.layout_type === 'modern', [data.layout_type]);

  const tableData = useMemo(
    () => ({
      ...(showProductImage
        ? {
            'product-image-position':
              direction === 'rtl' && productImagePosition === 'left'
                ? 'right'
                : productImagePosition,
          }
        : {}),
      ...(isLayoutTypeModern ? { 'data-layout-type-modern': true } : {}),
    }),
    [showProductImage, productImagePosition, isLayoutTypeModern, direction],
  );

  const shortcodedTitle = useMemo(
    () => doShortcode(data.title ?? ''),
    [element.data.title, doShortcode],
  );

  const shortcodedContent = useMemo(
    () => doShortcode(data.rich_text ?? ''),
    [element.data.rich_text, doShortcode],
  );

  const placeHoldersReplacedContent = useMemo(() => {
    const product_title = data.product_title;
    const expires_title = data.expires_title;
    const download_title = data.download_title;

    let baseContent = shortcodedContent;
    if (direction === 'rtl') {
      baseContent = baseContent.replaceAll(/text-align:left/g, 'text-align:right');
    }
    if (direction === 'ltr') {
      baseContent = baseContent.replaceAll(/text-align:right/g, 'text-align:left');
    }

    return replacePlaceholders(baseContent, {
      product_title,
      expires_title,
      download_title,
      ...(settings as any),
    });
  }, [
    shortcodedContent,
    data.product_title,
    data.expires_title,
    data.download_title,
    settings,
    direction,
  ]);

  const elementSpecificStyles = useMemo(
    () => `
      .yaymail-element-${
        element.id
      } .yaymail-order-details-download-content[data-layout-type-modern] {
        border: 0 !important;
      }

      .yaymail-element-${
        element.id
      } .yaymail-order-details-download-content[data-layout-type-modern] th,
      .yaymail-element-${
        element.id
      } .yaymail-order-details-download-content[data-layout-type-modern] td {
        border: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }

      .yaymail-element-${
        element.id
      } .yaymail-order-details-download-content[data-layout-type-modern] .yaymail-order-details-download-title--download,
      .yaymail-element-${
        element.id
      } .yaymail-order-details-download-content[data-layout-type-modern] .yaymail-order-details-download-content--download {
        text-align: right !important;
      }

      .yaymail-element-${element.id} .yaymail-order-details-download-content td {
        font-size: ${data.table_content_font_size ?? 14}px !important;
      }

      .yaymail-element-${element.id} .yaymail-order-details-download-content th {
        font-size: ${data.table_heading_font_size ?? 14}px !important;
      }
    `,
    [element.id, data.title_color, data.table_content_font_size, data.table_heading_font_size],
  );

  console.log(data.table_content_font_size, data.table_heading_font_size);

  return (
    <ElementWrapper
      className="yaymail-customizer-element-order-details-download"
      element={element}
      style={wrapperStyles}
    >
      <style>{elementSpecificStyles}</style>
      {placeHoldersReplacedContent !== '' && (
        <>
          <div
            className="yaymail-order-details-download-title"
            style={titleStyles}
            dangerouslySetInnerHTML={{ __html: shortcodedTitle }}
          />
          <table
            {...tableData}
            className="yaymail-order-details-download-content"
            cellSpacing="0"
            cellPadding="6"
            style={tableStyles}
            border={1}
            dangerouslySetInnerHTML={{ __html: placeHoldersReplacedContent }}
          />
        </>
      )}
    </ElementWrapper>
  );
};

const OrderDetailsDownload = withMemo(OrderDetailsDownloadContent);

export default OrderDetailsDownload;
