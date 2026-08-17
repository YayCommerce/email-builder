export type RichTextEditorType = {
  value_path?: string;
  background_color_path?: string;
  text_color_path?: string;
  editor_id?: string;
  title?: string;
};

export type ICustomColorButtonProps = {
  colorType: 'ForeColor' | 'BackColor';
  initialValue?: string;
  editorId: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (editorContent: string) => void;
};
