export type BaseRichTextEditorType = {
  id?: string;
  onChange?: (editorContent: string) => void;
  title?: string;
  description?: string;
  value?: string;
  editorBackgroundColor?: string;
  editorTextColor?: string;
  className?: string;
  customButtonsRenderer?: (editor: any) => any[];
};

export type ICustomColorButtonProps = {
  colorType: 'ForeColor' | 'BackColor';
  initialValue?: string;
  editorId: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (editorContent: string) => void;
};
