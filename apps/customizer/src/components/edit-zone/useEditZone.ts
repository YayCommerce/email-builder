import { KeyboardEvent, MouseEvent, useCallback, useEffect, useLayoutEffect, useRef } from 'react';

import useCustomizerPageStore from '@src/stores/customizerPage';
import useTemplateContentStore from '@src/stores/templateContent';
import { getValueByPath, setValueByPath } from '@yaymail/utilities/src/functions';

import useEditZoneStore from './store';
import { EditZoneProps } from './types';
import { placeCaretAtPoint, prepareContentForSave } from './utils';

export function useEditZone(props: EditZoneProps) {
  const { element, valuePath, attributeLabel, contentType = 'html', disabled = false } = props;

  const elementId = element.id;
  const editHtml = (getValueByPath(element.data, valuePath) as string | undefined) ?? '';

  const editorRef = useRef<HTMLDivElement | null>(null);
  const clickPointRef = useRef<{ x: number; y: number } | null>(null);
  const isSavingRef = useRef(false);

  const chosenElementId = useTemplateContentStore((state) => state.chosenElement?.id);
  const multiSelectedCount = useTemplateContentStore((state) => state.multiSelectedList.length);
  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);

  const supportStatus = useCustomizerPageStore((state) => state.templateData?.support_status);

  const activeZone = useEditZoneStore((state) => state.activeZone);
  const enterEditMode = useEditZoneStore((state) => state.enterEditMode);
  const exitEditMode = useEditZoneStore((state) => state.exitEditMode);
  const registerSaveCallback = useEditZoneStore((state) => state.registerSaveCallback);

  const isAllowed = !disabled && multiSelectedCount <= 1 && supportStatus === 'already_supported';

  const resolvedAttributeLabel = attributeLabel ?? valuePath;

  const isElementSelected = chosenElementId === elementId;
  const isEditing =
    isAllowed && activeZone?.elementId === elementId && activeZone?.valuePath === valuePath;

  const save = useCallback(() => {
    if (isSavingRef.current) return;
    const el = editorRef.current;
    if (!el) {
      exitEditMode();
      return;
    }

    isSavingRef.current = true;
    const raw = el.innerHTML;
    const next = prepareContentForSave(raw, contentType);

    if (next !== editHtml) {
      updateChosenElementData(
        (data) => {
          setValueByPath(data, valuePath, next);
        },
        { attribute: resolvedAttributeLabel },
      );
    }

    exitEditMode();
    isSavingRef.current = false;
  }, [
    contentType,
    editHtml,
    exitEditMode,
    resolvedAttributeLabel,
    updateChosenElementData,
    valuePath,
  ]);

  useEffect(() => {
    if (!isEditing) return;
    registerSaveCallback(save);
    return () => registerSaveCallback(null);
  }, [isEditing, registerSaveCallback, save]);

  useEffect(() => {
    if (isEditing && !isElementSelected) {
      save();
    }
  }, [isEditing, isElementSelected, save]);

  useLayoutEffect(() => {
    if (!isEditing || !editorRef.current) return;

    const el = editorRef.current;
    if (el.innerHTML !== editHtml) {
      el.innerHTML = editHtml;
    }

    el.focus();

    const point = clickPointRef.current;
    if (point) {
      placeCaretAtPoint(point.x, point.y);
      clickPointRef.current = null;
    }
  }, [isEditing, editHtml]);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (!isAllowed) return;

      // Always block default (e.g. <a> navigation); only stop bubble when entering edit.
      e.preventDefault();

      if (!isElementSelected) return;

      e.stopPropagation();
      clickPointRef.current = { x: e.clientX, y: e.clientY };
      enterEditMode({ elementId, valuePath });
    },
    [elementId, enterEditMode, isAllowed, isElementSelected, valuePath],
  );

  const handleBlur = useCallback(() => {
    save();
  }, [save]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        save();
      }
    },
    [save],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      if (contentType !== 'plain_text') return;
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
    },
    [contentType],
  );

  return {
    editorRef,
    isAllowed,
    isEditing,
    handleClick,
    handleBlur,
    handleKeyDown,
    handlePaste,
    save,
  };
}
