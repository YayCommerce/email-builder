import classNames from 'classnames';

import { EditZoneProps } from './types';
import { useEditZone } from './useEditZone';

import './index.scss';

const EditZone = (props: EditZoneProps) => {
  const { displayHtml, className, style, valuePath } = props;

  const { editorRef, isAllowed, isEditing, handleClick, handleBlur, handleKeyDown, handlePaste } =
    useEditZone(props);

  if (isEditing) {
    return (
      <div
        ref={editorRef}
        className={classNames('yaymail-edit-zone', 'yaymail-edit-zone--editing', className)}
        style={style}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        data-yaymail-edit-zone={valuePath}
      />
    );
  }

  return (
    <div
      className={classNames(
        'yaymail-edit-zone',
        isAllowed && 'yaymail-edit-zone--allowed',
        className,
      )}
      style={style}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: displayHtml }}
      data-yaymail-edit-zone={valuePath}
    />
  );
};

export default EditZone;
