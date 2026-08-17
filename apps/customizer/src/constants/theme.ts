import { ThemeConfig } from 'antd';

import { YAYMAIL_TOKENS } from './tokens';

// WordPress 7.0 admin default colors (matches --wp-admin-theme-color CSS variables)
const WP_COLORS = {
  default: '#3858e9',
  dark: '#7b90ff',
};

function getPrimaryColors(isWpOnly: boolean) {
  return isWpOnly ? WP_COLORS : YAYMAIL_TOKENS.color.wcPurple;
}

export function buildAntdTheme(isWpOnly: boolean): ThemeConfig {
  const primary = getPrimaryColors(isWpOnly);
  return {
    token: {
      colorPrimary: primary.default,
      colorPrimaryActive: primary.dark,
    },
    components: {
      Button: {
        colorPrimary: primary.default,
        colorPrimaryBorder: primary.default,
        colorPrimaryActive: primary.dark,
        colorPrimaryHover: primary.dark,
        colorText: '#333333',
        colorBgContainerDisabled: primary.default,
        colorLink: primary.default,
        colorLinkActive: primary.dark,
        colorLinkHover: primary.dark,
        colorTextDisabled: YAYMAIL_TOKENS.color.white,
        borderRadius: 4,
      },
      Table: {
        fontWeightStrong: 500,
        controlItemBgActiveHover: YAYMAIL_TOKENS.color.grey['100'],
        controlItemBgActive: YAYMAIL_TOKENS.color.grey['100'],
      },
      Tabs: {
        inkBarColor: '#333333',
        itemSelectedColor: '#333333',
        itemHoverColor: '#333333',
        itemActiveColor: '#333333',
        colorBorderSecondary: 'none',
        lineWidthBold: 3,
        margin: 0,
        verticalItemPadding: '12px 24px',
        horizontalItemPadding: '12px 20px',
        horizontalItemGutter: 0,
      },
      Select: {
        controlItemBgActive: YAYMAIL_TOKENS.color.grey['100'],
        colorPrimaryHover: '#333333',
        colorTextPlaceholder: YAYMAIL_TOKENS.color.black['700'],
      },
      Switch: {
        colorPrimary: primary.default,
        colorPrimaryHover: primary.default,
        colorPrimaryBorder: primary.default,
        lineHeight: 1.7,
      },
      Tooltip: {
        sizePopupArrow: 10,
        colorBgContainer: YAYMAIL_TOKENS.color.tooltip.bg,
      },
      Modal: {
        fontSizeLG: 20,
      },
    },
  };
}

// Kept for backward compatibility with any direct imports
export const CUSTOM_ANTD_THEME: ThemeConfig = buildAntdTheme(false);

/**
 * Nested under root AntdConfigProvider for email customizer sidebar only.
 * Drives default + solid Button via colorBgSolid* (see Ant Design Button genDefaultButtonStyle).
 */
export const SIDEBAR_ANTD_THEME: ThemeConfig = {
  token: {
    colorBgSolid: '#383a3c',
    colorBgSolidHover: '#424547',
    colorBgSolidActive: '#323436',
  },
  components: {
    Button: {
      solidTextColor: YAYMAIL_TOKENS.color.cerebralGrey,
    },
  },
};
