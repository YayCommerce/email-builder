import { CSSProperties, useCallback, useEffect, useMemo } from 'react';

import { IGlobalVariables } from '@src/features/dashboard-settings/components/global-variables/type';
import { resolvePresetColorValues } from '@src/features/email-customizer/components/sidebar/element-editor/property-builders/utils';

import { useWordpressMediaSelector } from '@src/hooks/useWordpressMediaSelector';

import { groupShortcodes } from '@src/features/email-customizer/utils';
import useCustomizerPageStore from '@src/stores/customizerPage';
import { __ } from '@wordpress/i18n';

import CustomRichTextColor from './CustomRichTextColor';
import { BaseRichTextEditorType } from './type';

import './index.scss';

const DEFAULT_EDITOR_BACKGROUND_COLOR = '#ffffff';
const DEFAULT_EDITOR_TEXT_COLOR = '#000000';

const isZeroOpacityColor = (color: string) => {
  const normalized = color.trim().toLowerCase();
  if (!normalized || normalized === 'transparent') {
    return true;
  }

  if (normalized.startsWith('rgba(') || normalized.startsWith('hsla(')) {
    const alpha = Number(normalized.split(',').at(-1)?.replace(')', '').trim());
    return !Number.isNaN(alpha) && alpha <= 0;
  }

  if (normalized.startsWith('#')) {
    if (normalized.length === 5) {
      return normalized[4] === '0';
    }
    if (normalized.length === 9) {
      return normalized.slice(7, 9) === '00';
    }
  }

  return false;
};

const resolveEditorColor = (
  color: string | undefined,
  defaultColor: string,
  globalVariables?: IGlobalVariables,
) => {
  const normalizedColor = color?.trim();
  if (!normalizedColor) {
    return defaultColor;
  }

  let resolvedColor = normalizedColor;
  if (normalizedColor.includes('presets/')) {
    const presetColor = resolvePresetColorValues(
      normalizedColor,
      globalVariables ?? { colors: {} },
    );
    if (typeof presetColor !== 'string' || !presetColor || presetColor.includes('presets/')) {
      return defaultColor;
    }
    resolvedColor = presetColor;
  }

  return isZeroOpacityColor(resolvedColor) ? defaultColor : resolvedColor;
};

const resolveEditorBackgroundColor = (color?: string, globalVariables?: IGlobalVariables) =>
  resolveEditorColor(color, DEFAULT_EDITOR_BACKGROUND_COLOR, globalVariables);

const resolveEditorTextColor = (color?: string, globalVariables?: IGlobalVariables) =>
  resolveEditorColor(color, DEFAULT_EDITOR_TEXT_COLOR, globalVariables);

const syncEditorBackgroundColor = (editor: any, backgroundColor: string, textColor: string) => {
  if (!editor) {
    return;
  }

  const body = editor.getBody?.();
  if (body) {
    body.style.backgroundColor = backgroundColor;
    body.style.color = textColor;
  }

  const editArea = editor.getContainer?.()?.querySelector('.mce-edit-area') as
    | HTMLElement
    | undefined;
  if (editArea) {
    editArea.style.backgroundColor = backgroundColor;
  }
};

const BaseRichTextEditor = (props: BaseRichTextEditorType) => {
  const ID = useMemo(() => props.id, [props.id]);

  const title = useMemo(() => props?.title ?? __('Content', 'yaymail'), [props?.title]);
  const description = useMemo(() => (props as any)?.description, [(props as any)?.description]);

  const value = useMemo(() => props?.value, [props?.value]);
  const globalVariables = useCustomizerPageStore((state) => state.globalVariables);
  const editorBackgroundColor = useMemo(
    () => resolveEditorBackgroundColor(props?.editorBackgroundColor, globalVariables),
    [props?.editorBackgroundColor, globalVariables],
  );
  const editorTextColor = useMemo(
    () => resolveEditorTextColor(props?.editorTextColor, globalVariables),
    [props?.editorTextColor, globalVariables],
  );

  const shortcodes = useCustomizerPageStore((state) => state.shortcodes);

  const handleOnChange = useCallback(
    (content: string) => {
      return props.onChange?.(content);
    },
    [props.onChange],
  );

  const handleImageUpload = useCallback(
    (imgUrl: string, uploadedMedia: any) => {
      const editor = window.tinymce.get(ID);
      if (imgUrl && uploadedMedia?.attributes) {
        const { width, height, alt } = uploadedMedia.attributes;
        const imgHtml = `<img src="${imgUrl}" style="max-width: 100%" width="${width}px" height="${height}px" alt="${alt}" />`;
        editor.execCommand('mceInsertContent', false, imgHtml);
      }
    },
    [ID],
  );
  const { mediaUploader } = useWordpressMediaSelector(
    'yaymail-rich-text-editor-image-uploader',
    handleImageUpload,
  );

  const customButtonsRenderer =
    props.customButtonsRenderer ??
    useCallback(
      (editor: any) => [
        {
          id: 'shortcodeList',
          type: 'menubutton',
          text: __('Shortcode', 'yaymail'),
          icon: false,
          menu: Object.values(groupShortcodes(shortcodes))
            .filter((group) => group.groupLabel !== 'none')
            .map((group) => ({
              text: group.groupLabel,
              menu: group.shortcodes.map((shortcode) => ({
                text: shortcode.description,
                onclick: function () {
                  const shortcodeText = `[${shortcode.name}]`;
                  editor.insertContent(shortcodeText);
                  handleOnChange(editor.getContent());
                },
              })),
            })),
        },
      ],
      [shortcodes, handleOnChange],
    );

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    window.wp.editor.initialize(ID, {
      tinymce: {
        toolbar1:
          'undo redo | styleselect | bold italic underline fontsizeselect | customforecolor custombackcolor hr alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link | mediaImageLibrary  | mediaimagelibrary fullscreen shortcodeList',
        style_formats_merge: true,
        style_formats: [
          {
            title: 'Font Weights',
            items: [
              { title: 'Light (300)', inline: 'span', styles: { 'font-weight': '300' } },
              { title: 'Normal (400)', inline: 'span', styles: { 'font-weight': '400' } },
              { title: 'Medium (500)', inline: 'span', styles: { 'font-weight': '500' } },
              { title: 'Semi Bold (600)', inline: 'span', styles: { 'font-weight': '600' } },
              { title: 'Bold (700)', inline: 'span', styles: { 'font-weight': '700' } },
              { title: 'Extra Bold (800)', inline: 'span', styles: { 'font-weight': '800' } },
            ],
          },
        ],
        forced_root_block: 'div',
        plugins: [
          'searchreplace',
          'code',
          'visualblocks',
          'fullscreen',
          'image',
          'link',
          'table',
          'charmap',
          'hr',
          'insertdatetime',
          'textcolor',
          'lists',
        ],
        menu: {
          file: { title: 'File', items: 'newdocument' },
          edit: {
            title: 'Edit',
            items: 'undo redo | cut copy paste pastetext | selectall | searchreplace',
          },
          view: { title: 'View', items: 'code | visualaid visualblocks | fullscreen' },
          insert: {
            title: 'Insert',
            items: 'image link inserttable | charmap hr | insertdatetime',
          },
          format: {
            title: 'Format',
            items:
              'bold italic underline strikethrough superscript subscript codeformat | blockformats align | removeformat',
          },
          tools: { title: 'Tools', items: 'code' },
          table: { title: 'Table', items: 'inserttable tableprops deletetable row column | cell' },
        },
        menubar: 'file edit view insert format tools table',
        directionality: window.yaymailData.is_rtl ? 'rtl' : 'ltr',
        fontsize_formats:
          '8px 9px 10px 11px 12px 13px 14px 15px 16px 18px 20px 24px 30px 36px 40px 44px 48px 56px 64px 72px 80px 96px 120px',
        /** Set default font-side */
        content_style: `body {
          font-size: 14px;
          font-family: "Helvetica Neue",Helvetica,Roboto,Arial,sans-serif ;
          background-color: ${editorBackgroundColor};
          color: ${editorTextColor};
        }
        p {
          margin: 0px;
        }`,
        setup: (editor: any) => {
          editor.on('init', () => {
            syncEditorBackgroundColor(editor, editorBackgroundColor, editorTextColor);
          });
          editor.on('change', (event: any) => {
            if (event.originalEvent) {
              return;
            }
            handleOnChange(editor.getContent());
          });
          editor.on('input execCommand', (event: any) => {
            if (event?.type == 'execcommand' && event.command == 'SelectAll') {
              return;
            }
            handleOnChange(editor.getContent());
          });
          editor.addButton('mediaimagelibrary', {
            text: __('Media Image Library', 'yaymail'),
            onclick: () => {
              mediaUploader?.open();
            },
          });
          customButtonsRenderer(editor).forEach((button) => {
            editor.addButton(button.id, button);
          });
          editor.addButton('customforecolor', {
            id: `yaymail-editor-custom-fore-color_${ID}`,
            tooltip: 'Text color',
          });
          editor.addButton('custombackcolor', {
            id: `yaymail-editor-custom-back-color_${ID}`,
            tooltip: 'Background color',
          });

          timeoutId = setTimeout(() => {
            const renderCustomColorPicker = (containerId: string, component: JSX.Element) => {
              const container = document.getElementById(containerId);
              if (container) {
                window.ReactDOM.render(component, container);
              }
            };
            if (ID) {
              renderCustomColorPicker(
                `yaymail-editor-custom-fore-color_${ID}`,
                <CustomRichTextColor
                  colorType="ForeColor"
                  initialValue="#636363"
                  editorId={ID}
                  onChange={handleOnChange}
                />,
              );
              renderCustomColorPicker(
                `yaymail-editor-custom-back-color_${ID}`,
                <CustomRichTextColor
                  colorType="BackColor"
                  initialValue="#636363"
                  editorId={ID}
                  onChange={handleOnChange}
                />,
              );
            }
          }, 100);
        },
      },
    });
    return () => {
      window.wp.editor.remove(ID);
      clearTimeout(timeoutId);
    };
  }, [mediaUploader, handleOnChange, customButtonsRenderer, ID]);

  useEffect(() => {
    if (value !== undefined && ID) {
      const editor = window.tinymce.get(ID);
      if (editor && editor.getContent() !== value) {
        editor.setContent(value);
      }
    }
  }, [value, ID]);

  useEffect(() => {
    if (!ID) {
      return;
    }

    const editor = window.tinymce.get(ID);
    syncEditorBackgroundColor(editor, editorBackgroundColor, editorTextColor);
  }, [ID, editorBackgroundColor, editorTextColor]);

  return (
    <div
      className={
        props.className
          ? props.className
          : 'yaymail-editor-property yaymail-editor-property-rich-text'
      }
      style={{ '--yaymail-rich-editor-bg-color': editorBackgroundColor } as CSSProperties}
      key={ID}
    >
      {title && <div className="yaymail-title">{title}</div>}
      {description && (
        <div
          className="yaymail-editor-property-description"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
      <textarea id={ID} defaultValue={value} style={{ fontSize: '14px' }} />
    </div>
  );
};
export default BaseRichTextEditor;
