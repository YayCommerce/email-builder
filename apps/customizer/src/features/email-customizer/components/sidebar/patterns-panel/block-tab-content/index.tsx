import { ChangeEvent, useMemo, useState } from 'react';

import { CloseCircleFilled, SearchOutlined } from '@ant-design/icons';
import { Empty, Input } from 'antd';

import CustomScrollbar from '@src/features/email-customizer/components/sidebar/custom-scrollbar';

import usePatternPanelStore from '@src/stores/patternPanelStore';
import { __ } from '@wordpress/i18n';

import PatternList from '../pattern-list';

import './index.scss';

const PatternTabContent = () => {
  const currentSectionTemplate = usePatternPanelStore((state) => state.currentSectionTemplate);

  const [searchText, setSearchText] = useState<string>('');
  const isSearching = useMemo(() => Boolean(searchText), [searchText]);

  const patterns = useMemo(() => {
    const sortedPatterns = currentSectionTemplate?.patterns?.sort(
      (a, b) => a.position - b.position,
    );

    if (!searchText) {
      return sortedPatterns;
    }

    const searchedPatterns = sortedPatterns?.filter((pattern) =>
      pattern.name?.toLowerCase().includes(searchText.toLowerCase()),
    );

    return searchedPatterns;
  }, [currentSectionTemplate?.patterns, searchText]);

  const onChangeSearchInput = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const onClickClearSearchInput = () => {
    setSearchText('');
  };

  return (
    <div className="yaymail-patterns-panel__tab-content" style={{ height: '100%' }}>
      {/* <DarkModeSwitch /> */}
      <Input
        className="yaymail-custom-search"
        placeholder={__('Search patterns', 'yaymail')}
        onChange={onChangeSearchInput}
        size="small"
        value={searchText}
        suffix={
          isSearching ? (
            <CloseCircleFilled
              className="yaymail-close-circle-filled-icon"
              onClick={onClickClearSearchInput}
            />
          ) : (
            <SearchOutlined />
          )
        }
      />
      <CustomScrollbar>
        {patterns?.length === 0 && (
          <Empty
            className="empty-pattern-search-result"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="empty-pattern-search-result__message">
                {__('No pattern found.', 'yaymail')}
              </span>
            }
          />
        )}
        <PatternList patterns={patterns ?? []} />
      </CustomScrollbar>
    </div>
  );
};

export default PatternTabContent;
