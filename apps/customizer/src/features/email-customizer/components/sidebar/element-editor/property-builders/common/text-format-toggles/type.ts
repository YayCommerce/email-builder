export type TextFormatTogglesFormatDefaults = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

export type TextFormatTogglesType = {
  /** Group root: paths become `{value_path}.bold` / `.italic` / `.underline` */
  value_path?: string;
  bold_value_path?: string;
  italic_value_path?: string;
  underline_value_path?: string;
  /** Schema defaults when keys are unset (from PHP get_text_format_toggles / element get_data). */
  default_value?: TextFormatTogglesFormatDefaults;
};
