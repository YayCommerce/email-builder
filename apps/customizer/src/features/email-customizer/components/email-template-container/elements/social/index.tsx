import { CSSProperties, useMemo } from 'react';

import { getDimensionValue } from '@yaymail/utilities/src/functions';

import { ITemplateProps } from '../../../../type';
import ElementWrapper from '../../../element-wrapper';
import withMemo from '../with-memo';

import './index.scss';

type DisplayIconType = {
  src?: string;
  name?: string;
  theme?: string;
  iconName?: string;
} | null;

const SocialContent = ({ element }: ITemplateProps<'social_icon'>) => {
  const data = element.data;
  const isCustomTheme = data.theme === 'Custom';
  // Lite has no global palette presets — icon_color is a plain hex.
  const iconColor = data.icon_color ?? '#333333';

  const displayIcons: DisplayIconType[] | undefined = useMemo(() => {
    const icon_list = data.icon_list;
    return icon_list.map(({ icon: iconName }: { icon: string }) => {
      const icon = (window.yaymailData.builder.social_icons.images ?? []).find(
        (e) => e.name === iconName,
      );
      // Custom theme uses static custom.png as CSS mask (instant recolor, no HTTP).
      const themeKey = isCustomTheme ? 'Custom' : data.theme;
      const _data = icon?.data.find((e) => e.theme === themeKey);

      return {
        iconName,
        ..._data,
      };
    });
  }, [data.icon_list, data.theme, isCustomTheme]);

  const wrapperStyles: CSSProperties = useMemo(
    () => ({
      backgroundColor: data.background_color ?? 'transparent',

      paddingTop: getDimensionValue(data.padding.top),
      paddingRight: getDimensionValue(data.padding.right),
      paddingBottom: getDimensionValue(data.padding.bottom),
      paddingLeft: getDimensionValue(data.padding.right),
    }),
    [data.padding, data.background_color],
  );

  const tableStyles: CSSProperties = useMemo(
    () => ({
      borderCollapse: 'collapse',
      margin: data.align === 'center' ? '0 auto' : data.align === 'right' ? '0 0 0 auto' : '0',
      width: 'auto',
    }),
    [data.align],
  );

  const iconSize = getDimensionValue(data.width_icon ?? 0);

  const imgStyles: CSSProperties = useMemo(
    () => ({
      width: iconSize,
      height: iconSize,
      display: 'block',
      border: 0,
      margin: 0,
      padding: 0,
      outline: 'none',
    }),
    [iconSize],
  );

  const maskBaseStyles = useMemo(() => {
    const styles: CSSProperties & {
      WebkitMaskMode?: string;
      maskMode?: string;
    } = {
      width: iconSize,
      height: iconSize,
      display: 'block',
      backgroundColor: iconColor,
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
      WebkitMaskMode: 'alpha',
      maskMode: 'alpha',
    };
    return styles;
  }, [iconSize, iconColor]);

  return (
    <ElementWrapper
      className="yaymail-customizer-element-social"
      element={element}
      style={wrapperStyles}
    >
      <table cellPadding="0" cellSpacing="0" role="presentation" style={tableStyles}>
        <tbody>
          <tr>
            <td style={{ textAlign: data.align ?? 'center', verticalAlign: 'top', padding: 0 }}>
              {displayIcons?.map((icon, index) => (
                <span
                  key={icon?.iconName ?? icon?.name ?? index}
                  style={{
                    paddingLeft: getDimensionValue((data.spacing ?? 0) / 2),
                    paddingRight: getDimensionValue((data.spacing ?? 0) / 2),
                    paddingTop: 0,
                    paddingBottom: 0,
                    verticalAlign: 'top',
                    textAlign: 'center',
                    margin: '5px 0',
                    display: 'inline-block',
                  }}
                  className="yaymail-social-icon-item"
                >
                  <a
                    style={{
                      border: 'none',
                      textDecoration: 'none',
                      display: 'inline-block',
                    }}
                  >
                    {isCustomTheme ? (
                      <span
                        role="img"
                        aria-label={icon?.iconName ?? icon?.name ?? ''}
                        style={{
                          ...maskBaseStyles,
                          WebkitMaskImage: icon?.src ? `url(${icon.src})` : undefined,
                          maskImage: icon?.src ? `url(${icon.src})` : undefined,
                        }}
                      />
                    ) : (
                      <img
                        src={icon?.src}
                        alt={icon?.iconName ?? icon?.name ?? ''}
                        style={imgStyles}
                      />
                    )}
                  </a>
                </span>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
    </ElementWrapper>
  );
};

const Social = withMemo(SocialContent);

export default Social;
