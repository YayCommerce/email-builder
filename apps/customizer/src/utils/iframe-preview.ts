export const MOBILE_PREVIEW_ZOOM = 0.64;

/** Same mobile rules as injected by buildIframePreviewHtml — keep Template Library preview in sync with Preview modal. */
export const MOBILE_PREVIEW_HEAD_STYLE = `<style>html,body{overflow-x:hidden!important}body{zoom:${MOBILE_PREVIEW_ZOOM}}</style>`;

const BASE_FRAME_STYLE = `html,body{margin:0;padding:0}body,p,td{line-height:22px!important}`;
const BASE_FRAME_BLOCK = `<style>${BASE_FRAME_STYLE}</style>`;
const VIEWPORT_META = '<meta name="viewport" content="width=device-width, initial-scale=1" />';

/** Collect stylesheets and inline styles from the host document for iframe preview. */
export function collectHostStyles(): string {
  const parts: string[] = [];

  const rootStyle = document.documentElement.style.cssText;
  if (rootStyle) {
    parts.push(`<style>:root{${rootStyle}}</style>`);
  }

  document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]').forEach((link) => {
    parts.push(`<link rel="stylesheet" href="${link.href}" />`);
  });

  document.querySelectorAll<HTMLStyleElement>('style').forEach((style) => {
    if (style.getAttribute('data-css-hash') || style.id?.startsWith('rc-')) return;
    parts.push(`<style>${style.textContent}</style>`);
  });

  return parts.join('\n');
}

const TEMPLATE_LIBRARY_PREVIEW_MAX_WIDTH_PX = 678;

export interface TemplateLibraryPreviewDocOptions {
  isMobile: boolean;
  maxWidth?: number;
}

/** Full iframe document for Template Library preview step (host CSS + read-only interaction lock). */
export function buildTemplateLibraryPreviewDoc(
  innerHtml: string,
  { isMobile, maxWidth = TEMPLATE_LIBRARY_PREVIEW_MAX_WIDTH_PX }: TemplateLibraryPreviewDocOptions,
): string {
  const hostStyles = collectHostStyles();
  const mobileStyle = isMobile ? MOBILE_PREVIEW_HEAD_STYLE : '';
  const previewReset = `<style data-yaymail="preview-step-reset">html,body{height:auto!important;min-height:0!important}.yaymail-customizer-template-section{min-height:0!important;height:auto!important}</style>`;
  const previewContainerStyle = `<style data-yaymail="preview-container">.yaymail-customizer-email-template-container{max-width:${maxWidth}px;margin:0 auto;box-sizing:border-box;width:100%}</style>`;
  const interactionLock = `<style>*{pointer-events:none!important;cursor:default!important;user-select:none!important}</style>`;

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  ${BASE_FRAME_BLOCK}
  ${interactionLock}
  ${hostStyles}
  ${mobileStyle}
  ${previewReset}
  ${previewContainerStyle}
</head>
<body>
  <div class="yaymail-customizer-email-template-container yaymail-customizer-main">
    ${innerHtml}
  </div>
</body>
</html>`;
}

export function buildIframePreviewHtml(rawHtml: string, isMobile: boolean): string {
  if (!rawHtml) return '';

  const mobileBlock = isMobile ? MOBILE_PREVIEW_HEAD_STYLE : '';
  const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(rawHtml);
  const viewportBlock = hasViewport ? '' : VIEWPORT_META;

  if (/<head[\s>]/i.test(rawHtml)) {
    return rawHtml.replace(
      /<head(\s[^>]*)?>/i,
      (m) => `${m}${viewportBlock}${BASE_FRAME_BLOCK}${mobileBlock}`,
    );
  }

  if (/<html[\s>]/i.test(rawHtml)) {
    return rawHtml.replace(
      /<html(\s[^>]*)?>/i,
      `$&<head>${viewportBlock}${BASE_FRAME_BLOCK}${mobileBlock}</head>`,
    );
  }

  return `<!doctype html><html><head><meta charset="utf-8"/>${VIEWPORT_META}${BASE_FRAME_BLOCK}${mobileBlock}</head><body>${rawHtml}</body></html>`;
}

/**
 * Parse CSS zoom on body (used for mobile email preview). Returns 1 if unsupported / normal.
 */
function getBodyZoom(doc: Document): number {
  const body = doc.body;
  if (!body) {
    return 1;
  }
  const raw = getComputedStyle(body).zoom;
  if (!raw || raw === 'normal') {
    return 1;
  }
  const n = parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

/**
 * Height for sizing the preview iframe. When body uses CSS zoom, scrollHeight reflects unscaled
 * layout — multiply by zoom so iframe height matches on-screen content (Chromium).
 */
export function measureIframeContentHeight(doc: Document): number {
  const html = doc.documentElement;
  const body = doc.body;
  if (!html || !body) {
    return 0;
  }

  const scrollH = Math.max(html.scrollHeight, body.scrollHeight);
  const zoom = getBodyZoom(doc);

  let height: number;
  if (zoom !== 1) {
    // Chromium: with body { zoom }, scrollHeight / layout metrics often reflect the unscaled
    // layout box while the visible email is shorter — scale by zoom to match on-screen height.
    height = Math.ceil(scrollH * zoom);
  } else {
    // Do not mix in html.offsetHeight: inside an iframe it tracks the iframe's assigned height,
    // so Math.min(scrollHeight, offsetHeight) collapses to a thin strip and clips the email.
    height = scrollH;
  }

  return Math.max(height, 0);
}

export function adjustIframeHeightToContent(iframe: HTMLIFrameElement | null, minHeight = 0): void {
  if (!iframe) return;

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) return;

  const contentHeight = measureIframeContentHeight(doc);

  iframe.style.height = `${Math.max(contentHeight, minHeight)}px`;
}
