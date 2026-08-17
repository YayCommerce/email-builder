import React, { useEffect, useMemo } from 'react';

import { Button, Tooltip } from 'antd';

import { ReactComponent as RedoIcon } from '@src/assets/svgs/redo-icon.svg';
import { ReactComponent as UndoIcon } from '@src/assets/svgs/undo-icon.svg';
import useCustomizerPageStore from '@src/stores/customizerPage';
import useTemplateContentHistoryStore from '@src/stores/templateContentHistory';
import { __ } from '@wordpress/i18n';

const detectOS = () => {
  const userAgent = window.navigator.userAgent;
  let os = 'window';
  if (userAgent.indexOf('Mac') != -1) os = 'mac';
  return os;
};

interface UndoRedoProps {
  enableKeyboard?: boolean;
}

const UndoRedo: React.FC<UndoRedoProps> = ({ enableKeyboard = false }) => {
  const hasUndo = useTemplateContentHistoryStore((state) => state.hasUndo);
  const hasRedo = useTemplateContentHistoryStore((state) => state.hasRedo);

  const undo = useTemplateContentHistoryStore((state) => state.undo);
  const redo = useTemplateContentHistoryStore((state) => state.redo);

  const currentOS = useMemo(() => {
    return detectOS();
  }, []);

  useEffect(() => {
    if (!enableKeyboard) return;
    const undoRedoByKeyBoard = (e: KeyboardEvent) => {
      let action: null | string = null;

      const hasMetaKey =
        (currentOS === 'window' && e.ctrlKey) || (currentOS === 'mac' && e.metaKey);

      if (hasMetaKey) {
        if (e.key.toLowerCase() === 'z' && !e.shiftKey) {
          action = 'undo';
        }
        if (e.key.toLowerCase() === 'z' && e.shiftKey) {
          action = 'redo';
        }
      }

      if (action == null) {
        return;
      }

      if (action == 'undo') {
        undo();
      }

      if (action == 'redo') {
        redo();
      }
    };
    window.addEventListener('keydown', undoRedoByKeyBoard);
    return () => {
      window.removeEventListener('keydown', undoRedoByKeyBoard);
    };
  }, [enableKeyboard, undo, redo, currentOS]);

  const undoTitle = useMemo(() => {
    let shortcut = '(Ctrl + Z)';
    if (currentOS === 'mac') shortcut = '(⌘ + Z)';
    return `${__('Undo', 'yaymail')} ${shortcut}`;
  }, [currentOS]);

  const redoTitle = useMemo(() => {
    let shortcut = '(Ctrl + Shift + Z)';
    if (currentOS === 'mac') shortcut = '(⌘ + Shift + Z)';
    return `${__('Redo', 'yaymail')} ${shortcut}`;
  }, [currentOS]);

  const isEditable = useCustomizerPageStore(
    (s) => s.templateData?.support_status === 'already_supported',
  );

  return (
    <>
      <div className="header__btn--action">
        <Tooltip placement="bottom" title={undoTitle}>
          <Button
            disabled={!hasUndo || !isEditable}
            onClick={undo}
            className="yaymail-btn--icon-only"
          >
            <span className="anticon" style={{ display: 'flex' }}>
              <UndoIcon />
            </span>
          </Button>
        </Tooltip>
      </div>
      <div className="header__btn--action">
        <Tooltip placement="bottom" title={redoTitle}>
          <Button
            disabled={!hasRedo || !isEditable}
            onClick={redo}
            className="yaymail-btn--icon-only"
          >
            <span className="anticon" style={{ display: 'flex' }}>
              <RedoIcon />
            </span>
          </Button>
        </Tooltip>
      </div>
    </>
  );
};

export default UndoRedo;
