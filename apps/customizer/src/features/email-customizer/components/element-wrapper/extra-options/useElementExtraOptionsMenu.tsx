/* eslint-disable no-restricted-imports */
import { useCallback, useMemo, useState } from 'react';

import {
  BranchesOutlined,
  CopyOutlined,
  DeleteOutlined,
  DiffOutlined,
  FolderAddOutlined,
  FormOutlined,
  HighlightOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { message, Tooltip } from 'antd';

import { ReactComponent as GlobalHeaderFooterIcon } from '@src/assets/svgs/global-header-footer-icon.svg';
import { IElement } from '@src/features/email-customizer/type';
import { duplicateObjectByIds, pasteObjectById } from '@src/features/email-customizer/utils';
import useCustomizerPageStore from '@src/stores/customizerPage';
import useTemplateContentStore from '@src/stores/templateContent';
import { pushChangeToHistory } from '@src/stores/templateContentHistory';
import { __ } from '@wordpress/i18n';

import { isConsecutive, isElementAvailable, isElementPasteStyleAvailable } from '../utils';
import MarkGlobalHeaderFooterModal from './MarkGlobalHeaderFooterModal';
import RemoveElementModal from './RemoveElementModal';

import './index.scss';
import { GLOBAL_HEADER_FOOTER_TEMPLATE_IDS } from '@src/constants/global-header-footer';
type ActiveModal =
  | { type: 'remove'; elementIds: IElement['id'][] }
  | { type: 'markGlobal'; elementIds: IElement['id'][] };

type UseElementExtraOptionsMenuOptions = {
  onCloseMenu?: () => void;
  isContextMenuOpen?: boolean;
  isDotMenuOpen?: boolean;
};

const useElementExtraOptionsMenu = (
  element: IElement | null,
  {
    onCloseMenu,
    isContextMenuOpen = false,
    isDotMenuOpen = false,
  }: UseElementExtraOptionsMenuOptions = {},
) => {
  const elements = useCustomizerPageStore((state) => state.elements);
  const copiedElement = useTemplateContentStore((state) => state.copiedElement);
  const copiedStylesElement = useTemplateContentStore((state) => state.copiedStylesElement);
  const multiSelectedIds = useTemplateContentStore((state) =>
    state.multiSelectedList.map((i) => i.id),
  );
  const currentTemplate = useCustomizerPageStore((state) => state.currentTemplate);

  const multiSelectedList = useTemplateContentStore((state) => state.multiSelectedList);
  const list = useTemplateContentStore((state) => state.list);

  const isMultiSelect = useMemo(
    () =>
      multiSelectedList.length > 1 &&
      element != null &&
      multiSelectedList.some((el) => el.id === element.id),
    [multiSelectedList, element],
  );

  const copyElement = useTemplateContentStore((state) => state.copyElement);
  const copyStylesElement = useTemplateContentStore((state) => state.copyStylesElement);
  const pasteStylesElement = useTemplateContentStore((state) => state.pasteStylesElement);

  const [activeModal, setActiveModal] = useState<ActiveModal | null>(null);

  const [messageApi, contextHolder] = message.useMessage({
    top: 30,
    duration: 1,
  });

  const closeMenu = useCallback(() => {
    onCloseMenu?.();
  }, [onCloseMenu]);

  const wrapAction = useCallback(
    (action: () => void) => () => {
      closeMenu();
      action();
    },
    [closeMenu],
  );

  const getTargetElementIds = useCallback((): IElement['id'][] => {
    if (isMultiSelect) return multiSelectedIds;
    return element?.id != null ? [element.id] : [];
  }, [isMultiSelect, multiSelectedIds, element]);

  const openModal = useCallback(
    (type: ActiveModal['type']) => {
      setActiveModal({ type, elementIds: getTargetElementIds() });
      closeMenu();
    },
    [closeMenu, getTargetElementIds],
  );

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const handleCopyElement = () => {
    if (!element) return;
    copyElement(element);
    messageApi.success(__('Element copied', 'yaymail'));
  };

  const handlePasteElement = () => {
    if (!element || !copiedElement) return;

    const cloneList = structuredClone(list);
    const isPastedElementSucceeded = pasteObjectById(element.id, cloneList, copiedElement);
    if (!isPastedElementSucceeded) return;

    useTemplateContentStore.setState((state) => {
      state.list = cloneList;
    });
    pushChangeToHistory({ action: 'pasted', elementName: copiedElement.name });
    messageApi.success(__('Element pasted', 'yaymail'));
  };

  const handleDuplicateElement = () => {
    if (!element) return;

    const ids = isMultiSelect ? multiSelectedList.map((item) => item.id) : [element.id];
    const cloneList = duplicateObjectByIds(ids, list);

    useTemplateContentStore.setState((state) => {
      state.list = cloneList;
    });
    pushChangeToHistory({
      action: 'duplicated',
      elementName: isMultiSelect ? 'Pattern' : element.name ?? 'Element',
    });
  };

  const selectParentColumnElement = useTemplateContentStore(
    (state) => state.selectParentColumnElement,
  );

  const isDisablePasteElement = useMemo(() => {
    return copiedElement === null || !isElementAvailable(elements, copiedElement);
  }, [copiedElement, elements]);

  const isDisablePasteStyles = useMemo(() => {
    return (
      copiedStylesElement === null || !isElementPasteStyleAvailable(element, copiedStylesElement)
    );
  }, [element, copiedStylesElement]);

  const handleCopyStyles = () => {
    if (!element) return;
    copyStylesElement(element);
    messageApi.success(__('Styles copied', 'yaymail'));
  };

  const handlePasteStyles = () => {
    if (!element) return;
    pasteStylesElement(element);
    messageApi.success(__('Styles pasted', 'yaymail'));
  };

  const isConsecutiveMultiSelectedList = useMemo(() => {
    return isConsecutive(list, multiSelectedList);
  }, [list, multiSelectedList]);

  const hasChildElement = multiSelectedList.some((el) => !!el.parentId);
  const canCreatePattern = !isMultiSelect || (isConsecutiveMultiSelectedList && !hasChildElement);

  const { canMarkAsGlobalHeaderFooter, shouldShowMarkAsGlobalHeaderFooterItem } = useMemo(() => {
    const ghfDisallowedTypes = window.yaymailData?.ghf_disallowed_element_types ?? [];
    const markTargets = isMultiSelect ? multiSelectedList : element ? [element] : [];
    const canMark =
      markTargets.length > 0 &&
      markTargets.every((el) => el?.type && !ghfDisallowedTypes.includes(el.type));

    const shouldShow =
      canCreatePattern &&
      !currentTemplate?.startsWith('pattern_') &&
      currentTemplate !== 'yaymail_global_header_footer' &&
      !GLOBAL_HEADER_FOOTER_TEMPLATE_IDS.includes(currentTemplate || '') &&
      (isMultiSelect || canMark);

    return {
      canMarkAsGlobalHeaderFooter: canMark,
      shouldShowMarkAsGlobalHeaderFooterItem: shouldShow,
    };
  }, [canCreatePattern, currentTemplate, isMultiSelect, multiSelectedList, element]);

  const items: MenuProps['items'] = useMemo(() => {
    if (!element) return [];

    const initialItems = [
      ...(isMultiSelect && !isConsecutiveMultiSelectedList
        ? []
        : [
            {
              label: __('Duplicate', 'yaymail'),
              key: 'duplicate',
              icon: <CopyOutlined />,
              onClick: wrapAction(handleDuplicateElement),
            },
          ]),
      ...(isMultiSelect
        ? []
        : [
            {
              label: __('Copy this element', 'yaymail'),
              key: 'copy_element',
              icon: <DiffOutlined />,
              onClick: wrapAction(handleCopyElement),
            },
            {
              label: __('Paste element', 'yaymail'),
              key: 'pasteElement',
              icon: <FormOutlined />,
              disabled: isDisablePasteElement,
              onClick: wrapAction(handlePasteElement),
            },
            {
              label: __('Copy styles', 'yaymail'),
              key: 'copy_styles',
              icon: <HighlightOutlined />,
              onClick: wrapAction(handleCopyStyles),
            },
            {
              label: __('Paste styles', 'yaymail'),
              key: 'pasteStyles',
              icon: <FormOutlined />,
              disabled: isDisablePasteStyles,
              onClick: wrapAction(handlePasteStyles),
            },
          ]),
      ...(canCreatePattern
        ? [
            {
              label: (
                <Tooltip title={__('This feature is available in the PRO version', 'yaymail')}>
                  <span>{__('Create pattern', 'yaymail')}</span>
                </Tooltip>
              ),
              key: 'create_pattern',
              icon: <FolderAddOutlined />,
              disabled: true,
            },
          ]
        : []),
      ...(shouldShowMarkAsGlobalHeaderFooterItem
        ? [
            {
              label: isMultiSelect ? (
                <Tooltip
                  title={
                    !canMarkAsGlobalHeaderFooter
                      ? __(
                          'Some selected elements cannot be used in global header/footer',
                          'yaymail',
                        )
                      : ''
                  }
                >
                  <span className="yaymail-menu-item-with-tooltip">
                    {__('Mark as global header/footer', 'yaymail')}
                  </span>
                </Tooltip>
              ) : (
                __('Mark as global header/footer', 'yaymail')
              ),
              key: 'mark_as_global_header_footer',
              disabled: isMultiSelect && !canMarkAsGlobalHeaderFooter,
              icon: (
                <GlobalHeaderFooterIcon
                  style={{
                    width: 12,
                    height: 12,
                  }}
                />
              ),
              onClick: () => {
                if (isMultiSelect && !canMarkAsGlobalHeaderFooter) {
                  return;
                }
                openModal('markGlobal');
              },
            },
          ]
        : []),
      {
        label: !isMultiSelect
          ? __('Remove', 'yaymail')
          : `${__('Remove', 'yaymail')} (${multiSelectedList.length} ${__('items', 'yaymail')})`,
        key: 'remove',
        icon: <DeleteOutlined />,
        onClick: () => openModal('remove'),
      },
    ];

    if (element.parentId && !isMultiSelect) {
      initialItems.push({
        label: __('Select parent', 'yaymail'),
        key: 'selectParent',
        icon: <BranchesOutlined />,
        onClick: wrapAction(() => {
          selectParentColumnElement(element.parentId);
        }),
      });
    }

    return initialItems;
  }, [
    element,
    isDisablePasteElement,
    isDisablePasteStyles,
    isMultiSelect,
    multiSelectedList,
    isConsecutiveMultiSelectedList,
    canCreatePattern,
    openModal,
    currentTemplate,
    wrapAction,
    selectParentColumnElement,
    shouldShowMarkAsGlobalHeaderFooterItem,
    canMarkAsGlobalHeaderFooter,
  ]);

  const shouldRenderModals = !!element || activeModal != null || isContextMenuOpen || isDotMenuOpen;

  const modals = shouldRenderModals ? (
    <>
      <RemoveElementModal
        elementIds={activeModal?.type === 'remove' ? activeModal.elementIds : []}
        isOpen={activeModal?.type === 'remove'}
        onClose={closeModal}
      />
      {activeModal?.type === 'markGlobal' && (
        <MarkGlobalHeaderFooterModal
          isOpen
          elementIds={activeModal.elementIds}
          onClose={closeModal}
        />
      )}
    </>
  ) : null;

  return {
    items,
    modals,
    messageContextHolder: contextHolder,
  };
};

export default useElementExtraOptionsMenu;
