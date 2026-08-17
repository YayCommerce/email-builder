import { useCallback, useMemo, useState } from 'react';

import Select, { SelectProps } from 'antd/es/select';

import { Entity, EntityType } from '@src/common/api/types';
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';
import debounce from 'lodash.debounce';

import SelectorBase from '../../base/selector-base';
import { getValueByPath, setValueByPath } from '@yaymail/utilities/src/functions';
import { useGetEntitiesInfiniteQuery } from '@src/hooks/queries/useProductQueries';
interface EntitiesSelectorProps {
  entity_type: EntityType;
  title: string;
  value_path?: string;
}

const EntitiesSelector = ({ entity_type, title, value_path }: EntitiesSelectorProps) => {
  const [searchString, setSearchString] = useState<string>('');

  if (!value_path) {
    return null;
  }

  const valuePath = useMemo(() => value_path ?? '', [value_path]);

  const {
    data: response,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isError,
  } = useGetEntitiesInfiniteQuery({ page_num: 1, search_string: searchString, type: entity_type });

  const options = useMemo(
    () => response?.pages.flatMap((group) => group.data.list),
    [response?.pages],
  );

  const optionsElement = useMemo(() => {
    if (isError) return [];
    return options?.map((option) => (
      <Select.Option value={option.id} key={option.id}>
        <span dangerouslySetInnerHTML={{ __html: option.name?.toString() ?? '' }} />
      </Select.Option>
    ));
  }, [response, isError]);

  const isSelectorLoading = useMemo(
    () => isLoading || isFetching || isFetchingNextPage,
    [isLoading, isFetching, isFetchingNextPage],
  );

  const handleOnScrollBottom = useCallback(() => {
    if (hasNextPage && !isSelectorLoading) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, isSelectorLoading]);

  const handleSearch = debounce((value: string) => {
    setSearchString(value);
    return true;
  }, 400);

  const placeHolder = useMemo(() => `${__('Select', 'yaymail')} ${title.toLowerCase()}`, [title]);

  const storedEntities = useTemplateContentStore((state) =>
    getValueByPath(state.chosenElement?.data, valuePath),
  );

  const convertEntitiesToSelectorValues = useCallback((entities: Array<Entity | undefined>) => {
    return entities
      ?.map((entity) => {
        if (!entity) return null;
        return {
          value: entity.id,
          label: <span dangerouslySetInnerHTML={{ __html: entity.name?.toString() ?? '' }} />,
          key: entity.id,
        };
      })
      .filter((entity) => entity !== null);
  }, []);

  const [values, setValues] = useState(convertEntitiesToSelectorValues(storedEntities ?? []));

  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);

  const debounceUpdateEntity = useCallback(
    debounce((toBeSavedEntities: Array<Entity | undefined>) => {
      updateChosenElementData(
        (data) => {
          setValueByPath(data, valuePath, toBeSavedEntities);
        },
        {
          attribute: title,
        },
      );
    }, 500),
    [updateChosenElementData, valuePath, title],
  );
  const handleOnChange: SelectProps['onChange'] = useCallback(
    (_values: string[]) => {
      if (!Array.isArray(_values)) return;
      const toBeSavedEntities = _values.map((value) =>
        storedEntities.concat(options ?? []).find((option: any) => option.id === value),
      );
      setValues(convertEntitiesToSelectorValues(toBeSavedEntities));
      debounceUpdateEntity(toBeSavedEntities);
    },
    [updateChosenElementData, options, storedEntities],
  );

  const handleDropdownVisibleChange = useCallback(
    (open: boolean) => {
      if (!open) setSearchString('');
    },
    [setSearchString],
  );

  return (
    <SelectorBase
      filterOption={false}
      loading={isSelectorLoading}
      mode="multiple"
      onPopupScrollBottom={handleOnScrollBottom}
      onSearch={handleSearch}
      placeholder={placeHolder}
      title={title}
      value={values}
      onChange={handleOnChange}
      onDropdownVisibleChange={handleDropdownVisibleChange}
    >
      {optionsElement}
    </SelectorBase>
  );
};

export default EntitiesSelector;
