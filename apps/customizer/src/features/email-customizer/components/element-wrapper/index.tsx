import React, {
  CSSProperties,
  MouseEventHandler,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';

import { notification } from 'antd';

import ControlGroup from '@src/features/email-customizer/components/element-wrapper/control-group';
import {
  clearSelection,
  isElementInCurrentSelection,
} from '@src/features/email-customizer/components/element-wrapper/utils';
import MappingSlotPopover from '@src/features/email-customizer/components/header/TemplateLibrary/ContentMapping/MappingSlotPopover';
import { useMappingElementBridge } from '@src/features/email-customizer/components/header/TemplateLibrary/ContentMapping/useMappingElementBridge';

import { useHeightLock } from '@src/hooks/useHeightLock';
import { useOutsideClick } from '@src/hooks/useOutsideClick';

import { dismissMultiSelectNotice } from '@src/common/ajax';
import useElementContextMenuStore from '@src/stores/elementContextMenu';
import useTemplateContentStore from '@src/stores/templateContent';
import { ComponentChildren } from '@src/types';
import { __ } from '@wordpress/i18n';
import { getBorderStyle, getDimensionValue } from '@yaymail/utilities/src/functions';
import classNames from 'classnames';

import { ITemplateProps } from '../../type';
import { detectOS } from '../../utils';
import ElementExtraOptions from './extra-options/ElementExtraOptions';

import './index.scss';

type ElementWrapperPropsType = ITemplateProps & {
  children: ComponentChildren;
  className?: string;
  style?: CSSProperties;
  selectable?: boolean;
  isSidebar?: boolean;
  onMouseMove?: MouseEventHandler<HTMLDivElement>;
  onMouseUp?: MouseEventHandler<HTMLDivElement>;
  onClick?: () => void;
  isPattern?: boolean;
  [key: string]: any;
};

let showMultiSelectNotification = false;

/** When wrapper height is below this, extra-options is vertically centered (see extra-options/index.scss). */
const EXTRA_OPTIONS_COMPACT_MAX_HEIGHT_PX = 50;

const ElementWrapper = (props: ElementWrapperPropsType) => {
  const {
    children,
    className,
    selectable = true,
    element,
    isSidebar = false,
    style,
    onClick,
    isPattern = false,
    ...rest
  } = props;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const wrapperRef = useRef<HTMLDivElement | null>(
    null,
  ) as React.MutableRefObject<HTMLDivElement | null>;

  const {
    sourceId,
    mappingSlot,
    isMappingPreview,
    isMappingPopoverOpen,
    handleMappingMouseEnter,
    handleMappingMouseLeave,
    openMappingTarget,
  } = useMappingElementBridge({ element, wrapperRef });

  const chosenElementId = useTemplateContentStore((state) => state.chosenElement?.id);
  const openContextMenu = useElementContextMenuStore((state) => state.openContextMenu);
  const chooseElement = useTemplateContentStore((state) => state.chooseElement);
  const unchooseElement = useTemplateContentStore((state) => state.unchooseElement);
  const deMultiSelect = useTemplateContentStore((state) => state.deMultiSelect);
  const list = useTemplateContentStore((state) => state.list);

  const handleOnChoose = useCallback(
    (element: ElementWrapperPropsType['element']) => (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      chooseElement(element);
    },
    [chooseElement],
  );

  const isChosen = useMemo(() => element.id === chosenElementId, [element.id, chosenElementId]);

  const [api, contextHolder] = notification.useNotification();

  const userCustomClassnames = useMemo(() => {
    if (isSidebar) return '';
    return element.data?.custom_css_classes ?? '';
  }, [element.data?.custom_css_classes]);

  const multiSelectedList = useTemplateContentStore((state) => state.multiSelectedList);
  const multiSelect = useTemplateContentStore((state) => state.multiSelect);
  const setMultiSelectedList = useTemplateContentStore((state) => state.setMultiSelectedList);
  const removeElementFromMultiSelectedList = useTemplateContentStore(
    (state) => state.removeElementFromMultiSelectedList,
  );

  const isInMultiSelectedList = useMemo(
    () => multiSelectedList.length > 1 && multiSelectedList.map((e) => e.id).includes(element.id),
    [multiSelectedList, element.id],
  );

  const openMultiSelectNotification = () => {
    if (showMultiSelectNotification) {
      api.destroy();
    } else {
      api.info({
        message: __('New feature', 'yaymail'),
        description: (
          <span
            dangerouslySetInnerHTML={{
              __html: __(
                'You can now select multiple elements by holding %s key while clicking on an element',
                'yaymail',
              ).replace('%s', '<strong>SHIFT</strong>'),
            }}
          />
        ),
        duration: 0,
      });
      dismissMultiSelectNotice();
      window.yaymailData.show_multi_select_notice = 'no';
      showMultiSelectNotification = true;
    }
  };

  const currentOS = useMemo(() => {
    return detectOS();
  }, []);

  const handleOnClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      onClick?.();

      if (isMappingPreview) {
        e.stopPropagation();
        if (mappingSlot) {
          openMappingTarget();
        }
        return;
      }

      if (e.shiftKey) {
        clearSelection();
        multiSelect(element, true);

        return;
      }
      if ((currentOS === 'window' && e.ctrlKey) || (currentOS === 'mac' && e.metaKey)) {
        e.stopPropagation();
        clearSelection();
        // check if element is in multiSelectedList remove element from multiSelectedList
        if (multiSelectedList.some((i) => i.id === element.id)) {
          removeElementFromMultiSelectedList(element.id);
        } else {
          if (multiSelectedList.length > 0) {
            multiSelect(element, false);
          }
        }

        return;
      }

      if (
        (window.yaymailData.show_multi_select_notice === 'yes' ||
          queryParams.get('mode') === 'test') &&
        !showMultiSelectNotification
      ) {
        openMultiSelectNotification();
      }

      if (element.parentId) {
        // Never multi-select column's children
        // const selectedColumnLayout = findParentColumnLayout(element.parentId, elementList);
        // if (selectedColumnLayout) {
        //   setMultiSelectedList([selectedColumnLayout]);
        // }
        deMultiSelect();
      } else {
        setMultiSelectedList([element]);
      }

      if (selectable) handleOnChoose(element)(e);
    },
    [
      selectable,
      element,
      multiSelectedList,
      multiSelect,
      chooseElement,
      unchooseElement,
      deMultiSelect,
      setMultiSelectedList,
      isMappingPreview,
      mappingSlot,
      openMappingTarget,
    ],
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (isSidebar || isMappingPreview || !selectable) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const useMultiSelect =
        multiSelectedList.length > 1 &&
        isElementInCurrentSelection(element.id, null, multiSelectedList);

      openContextMenu({
        x: e.clientX,
        y: e.clientY,
        menuTargetElementId: useMultiSelect ? undefined : element.id,
        useMultiSelect,
      });
    },
    [isSidebar, isMappingPreview, selectable, element.id, multiSelectedList, openContextMenu],
  );

  const isShowingExtraOptions = useMemo(
    () =>
      !isSidebar &&
      !isMappingPreview &&
      (isChosen || (multiSelectedList.length > 1 && multiSelectedList[0].id === element.id)),
    [multiSelectedList, isChosen, isSidebar, isMappingPreview, element.id],
  );

  const [isCompactExtraOptionsHeight, setIsCompactExtraOptionsHeight] = useState(false);

  useLayoutEffect(() => {
    if (!isShowingExtraOptions) {
      setIsCompactExtraOptionsHeight(false);
      return;
    }

    const el = wrapperRef.current;
    if (!el) {
      return;
    }

    const updateCompactState = (height: number) => {
      setIsCompactExtraOptionsHeight(height < EXTRA_OPTIONS_COMPACT_MAX_HEIGHT_PX);
    };

    updateCompactState(el.getBoundingClientRect().height);

    const ro = new ResizeObserver(([entry]) => {
      updateCompactState(entry.contentRect.height);
    });

    ro.observe(el);

    return () => {
      ro.disconnect();
    };
  }, [isShowingExtraOptions, element.id]);

  const { ref: heightLockRef, lockedHeight } = useHeightLock(isMappingPopoverOpen);

  const setWrapperRef = useCallback(
    (node: HTMLDivElement | null) => {
      wrapperRef.current = node;
      (heightLockRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [heightLockRef],
  );

  useOutsideClick(
    () => {
      unchooseElement();
      deMultiSelect();
    },
    (isChosen || multiSelectedList.length > 0) && !isSidebar && !isMappingPreview,
    {
      boundaryElementSelectors: [
        '.yaymail-customizer-template-section',
        '[class^=yaymail-email-customizer__header]',
        '.yaymail-customizer-main',
      ],
      ignoredClassnames: ['yaymail-edit-zone--editing'],
    },
  );

  const multiSelectedStyle = useMemo(() => {
    if (multiSelectedList.length <= 1 || isChosen || isSidebar) return {};

    const css: CSSProperties = {};
    const isSelected = multiSelectedList.some((i) => i.id === element.id);
    if (!isSelected) return css;

    const elementIndexInList = list.findIndex((i) => i.id === element.id);
    const prevInListId = list[elementIndexInList - 1]?.id;
    const nextInListId = list[elementIndexInList + 1]?.id;
    const prevIsSelected = prevInListId
      ? multiSelectedList.some((i) => i.id === prevInListId)
      : false;
    const nextIsSelected = nextInListId
      ? multiSelectedList.some((i) => i.id === nextInListId)
      : false;

    css.borderRight = '2px solid #000000';
    css.borderLeft = '2px solid #000000';

    if (!prevIsSelected) {
      css.marginTop = '20px';
      css.borderTop = '2px solid #000000';
    }

    if (!nextIsSelected) {
      css.marginBottom = '20px';
      css.borderBottom = '2px solid #000000';
    }

    return css;
  }, [multiSelectedList, isChosen, isSidebar, element.id, list]);

  const marginStyle = useMemo((): CSSProperties => {
    if (isSidebar) {
      return {};
    }

    const margin = element.data?.margin;

    return {
      marginTop: getDimensionValue(margin?.top ?? 0),
      marginRight: getDimensionValue(margin?.right ?? 0),
      marginBottom: getDimensionValue(margin?.bottom ?? 0),
      marginLeft: getDimensionValue(margin?.left ?? 0),
    };
  }, [element.data?.margin, isSidebar]);

  const styles: CSSProperties = window.yaymailData.yaymailHooks.applyFilters(
    'yaymail-element-wrapper-styles',
    multiSelectedStyle,
    props,
    isChosen,
    isInMultiSelectedList,
  );
  const computedClass = useMemo(
    () =>
      classNames(
        'yaymail-customizer-element',
        'yaymail-element',
        'yaymail-element-' + element.id,
        isChosen && 'yaymail-chosen-element',
        isInMultiSelectedList && 'yaymail-multi-selected',
        mappingSlot && 'yaymail-content-mapping__element--slot',
        isMappingPopoverOpen && 'yaymail-content-mapping__element--active',
        isMappingPreview && !mappingSlot && 'yaymail-content-mapping__element--passive',
        isShowingExtraOptions &&
          isCompactExtraOptionsHeight &&
          'yaymail-customizer-element--compact-extra-options',
        className,
        userCustomClassnames,
      ),
    [
      isChosen,
      isInMultiSelectedList,
      className,
      userCustomClassnames,
      element,
      mappingSlot,
      isMappingPopoverOpen,
      isMappingPreview,
      isShowingExtraOptions,
      isCompactExtraOptionsHeight,
    ],
  );

  const elementWrapperClass = window.yaymailData.yaymailHooks.applyFilters(
    'yaymail-element-wrapper-class',
    computedClass,
    props,
    isChosen,
    isInMultiSelectedList,
  );

  const controlGroupSettings = useMemo(() => {
    if (isMappingPreview) {
      return { display: false, reference: 'element' };
    }

    if (isChosen)
      return {
        display: true,
        reference: 'element',
      };

    return {
      display: multiSelectedList[0]?.id === element.id,
      reference: 'group',
    };
  }, [isChosen, multiSelectedList, element.id, isMappingPreview]);

  const tableStyle = useMemo(() => {
    const baseStyle =
      'border' in element.data && element.type !== 'button'
        ? {
            ...style,
            ...getBorderStyle(element.data.border),
          }
        : style;

    return {
      ...marginStyle,
      ...baseStyle,
    };
  }, [style, element.data, marginStyle]);

  const wrapper = (
    <div
      ref={setWrapperRef}
      data-yaymail-element-id={element.id}
      data-yaymail-element-type={element.type}
      data-yaymail-element-is-pattern={isPattern}
      data-cm2-id={isMappingPreview && mappingSlot ? sourceId : undefined}
      className={elementWrapperClass}
      onClick={handleOnClick}
      onContextMenu={handleContextMenu}
      onMouseEnter={mappingSlot ? handleMappingMouseEnter : undefined}
      onMouseLeave={mappingSlot ? handleMappingMouseLeave : undefined}
      style={{
        ...styles,
        ...(lockedHeight != null ? { height: lockedHeight, boxSizing: 'border-box' as const } : {}),
      }}
      {...rest}
    >
      {contextHolder}
      {controlGroupSettings.display && <ControlGroup reference={controlGroupSettings.reference} />}
      {!isSidebar ? (
        <table
          className={classNames('yaymail-element__content')}
          style={tableStyle}
          cellPadding={0}
          cellSpacing={0}
        >
          <tbody>
            <tr>
              <td>{children}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <div className="yaymail-chosen-element__handle-drag">{children}</div>
      )}
      {isShowingExtraOptions && <ElementExtraOptions element={element} />}
    </div>
  );

  if (mappingSlot) {
    return (
      <MappingSlotPopover sourceId={sourceId} slot={mappingSlot} open={isMappingPopoverOpen}>
        {wrapper}
      </MappingSlotPopover>
    );
  }

  return wrapper;
};

export default ElementWrapper;
