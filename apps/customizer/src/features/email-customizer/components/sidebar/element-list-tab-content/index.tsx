/* eslint-disable no-unused-vars */
import React, { ChangeEvent, ReactNode, useContext, useMemo, useState } from 'react';

import { CloseCircleFilled, SearchOutlined } from '@ant-design/icons';
import { Badge, CollapseProps, Empty, Input, Space } from 'antd';

import { ElementCollapseContext } from '@src/features/email-customizer/components/sidebar';
import CustomCollapse from '@src/features/email-customizer/components/sidebar/custom-collapse';
import ElementList from '@src/features/email-customizer/components/sidebar/element-list';
import {
  getPatternSectionKeyFromCollapseKey,
  selectPatternCollapseItem,
} from '@src/features/email-customizer/components/sidebar/patterns-panel/collapse-selection';

import { isWpPlatform } from '@src/common/platform';
import { ElementType, IElement } from '@src/features/email-customizer/type';
import useCustomizerPageStore from '@src/stores/customizerPage';
import usePatternPanelStore from '@src/stores/patternPanelStore';
import { toKebabCase } from '@src/utils';
import { __ } from '@wordpress/i18n';

import './index.scss';

type Props = {
  allSearchableElements: IElement<ElementType>[];
  groups: Array<{
    key: string;
    label: string | React.ReactNode;
  }>;
  tabFor?: 'elements' | 'patterns' | 'library';
  isDragdropEnabled?: boolean;
  itemClass?: string;
  onSearch?: (element: IElement | unknown, searchText: string) => boolean;
  renderElementList?: (elements: Array<IElement | unknown>) => ReactNode;
  emptyText?: string;
  searchBoxPlaceholder?: string;
};
const ElementListTabContent = (props: Props) => {
  const {
    allSearchableElements: allElements,
    groups,
    tabFor,
    isDragdropEnabled,
    itemClass,
    onSearch,
    renderElementList,
    emptyText = __('No element found.', 'yaymail'),
    searchBoxPlaceholder = __('Search elements', 'yaymail'),
  } = props;
  const templateData = useCustomizerPageStore((state) => state.templateData);
  const templateName = templateData?.name;
  const [searchText, setSearchText] = useState<string>('');
  const [viewedNewElements, setViewedNewElements] = useState<string[]>(
    Array.isArray(window.yaymailData.viewed_new_elements)
      ? window.yaymailData.viewed_new_elements
      : [],
  );
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };
  const handleClear = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    event.stopPropagation();
    setSearchText('');
  };

  const isSearching = useMemo(() => Boolean(searchText), [searchText]);

  const searchingResult: IElement[] = useMemo(() => {
    if (onSearch) return allElements.filter((element) => onSearch(element, searchText));

    const lowerCaseSearchText = searchText.toLowerCase();

    return allElements.filter(
      (element) =>
        element.group !== 'hidden' &&
        (element.name?.toLowerCase().includes(lowerCaseSearchText) ||
          element.type.toLowerCase().includes(lowerCaseSearchText)),
    );
  }, [searchText, allElements, onSearch]);

  /** Keep expanded panels open after comming back from searching */
  const { elementCollapseActiveKeys: activeKeys, setElementCollapseActiveKeys: setActiveKeys } =
    useContext(ElementCollapseContext) ?? {};

  const openSectionTemplate = usePatternPanelStore((state) => state.openSectionTemplate);

  const onCollapseChange: CollapseProps['onChange'] = (key: string | string[]) => {
    setActiveKeys?.(key);

    const unviewedNewElements: IElement[] = allElements.filter((element) => {
      return (
        key.includes(toKebabCase(element.group)) &&
        element.status_info?.text.includes(__('New', 'yaymail')) &&
        !(viewedNewElements && viewedNewElements.includes(element.type))
      );
    });

    if (unviewedNewElements.length > 0) {
      window.jQuery.ajax({
        method: 'POST',
        url: window.yaymailData.admin_ajax.url,
        data: {
          action: 'yaymail_dismiss_new_element_notification',
          nonce: window.yaymailData.admin_ajax.nonce,
          elements: unviewedNewElements.map((element) => element.type),
        },
      });

      setViewedNewElements(
        Array.from(
          new Set([
            ...(viewedNewElements || []),
            ...unviewedNewElements.map((element) => element.type),
          ]),
        ),
      );
    }

    if (tabFor === 'patterns') {
      const sectionKey = getPatternSectionKeyFromCollapseKey(key);

      if (sectionKey) {
        openSectionTemplate(sectionKey);
        selectPatternCollapseItem(sectionKey);
      }
    }
  };

  const filteredGroups = useMemo(() => {
    if (isWpPlatform()) {
      return groups.filter((group) => group.key !== 'woocommerce');
    }
    return groups;
  }, [groups]);

  const items = useMemo((): CollapseProps['items'] => {
    const sortedElements = allElements.sort(
      (elementA, elementB) => (elementA.position ?? 0) - (elementB.position ?? 0),
    );

    return (
      filteredGroups?.map(({ key, label }) => {
        const groupedElements: React.ComponentProps<typeof ElementList>['elements'] =
          sortedElements.filter((element) => toKebabCase(element.group) === key);

        const unviewedNewElementsCount = groupedElements.filter(
          (element) =>
            element.status_info?.text.includes(__('New', 'yaymail')) &&
            !(viewedNewElements && viewedNewElements.includes(element.type)),
        ).length;

        return {
          key,
          label:
            unviewedNewElementsCount > 0 && key !== 'block' ? (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 5,
                }}
              >
                <span>{label}</span>
                <Badge dot color="#CD9F35" />
              </span>
            ) : (
              label
            ),
          children: renderElementList ? (
            renderElementList(groupedElements)
          ) : (
            <ElementList
              isDragdropEnabled={isDragdropEnabled}
              elements={groupedElements}
              itemClass={itemClass}
            />
          ),
        };
      }) ?? []
    );
  }, [allElements, viewedNewElements, filteredGroups]);

  const isTabForPattern = useMemo(() => tabFor === 'patterns', [tabFor]);
  const isTabForLibrary = useMemo(() => tabFor === 'library', [tabFor]);

  return (
    <Space
      direction="vertical"
      className="yaymail-customizer-tab-content yaymail-customizer-tab-elements"
    >
      {tabFor !== 'patterns' && (
        <Input
          className="yaymail-custom-search"
          placeholder={searchBoxPlaceholder}
          onChange={handleSearch}
          size="small"
          value={searchText}
          suffix={
            isSearching ? (
              <CloseCircleFilled onClick={(event) => handleClear(event)} />
            ) : (
              <SearchOutlined />
            )
          }
        />
      )}
      {isSearching && searchingResult.length > 0 && (
        <CustomCollapse
          className="search-result"
          items={[
            {
              key: 'search-result',
              children: renderElementList ? (
                renderElementList(searchingResult)
              ) : (
                <ElementList elements={searchingResult} />
              ),
            },
          ]}
          activeKey="search-result"
        />
      )}
      {isSearching && searchingResult.length === 0 && (
        <Empty
          className="empty-search-result"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<span className="empty-search-result__message">{emptyText}</span>}
        />
      )}
      {!isSearching && (
        <CustomCollapse
          items={items}
          onChange={onCollapseChange}
          // Single group should always be open
          activeKey={isTabForLibrary ? 'user_saved_patterns' : isTabForPattern ? [] : activeKeys}
          className={isTabForPattern ? 'yaymail-pattern-collapses' : ''}
        />
      )}
    </Space>
  );
};

export default ElementListTabContent;
