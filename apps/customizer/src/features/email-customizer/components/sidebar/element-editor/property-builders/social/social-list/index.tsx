/* eslint-disable no-unused-vars */
import { ChangeEvent, MouseEvent, useCallback, useMemo, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';

import { DeleteOutlined, HolderOutlined } from '@ant-design/icons';
import { Input, Select } from 'antd';

// eslint-disable-next-line no-restricted-imports
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';
import { getValueByPath, setValueByPath } from '@yaymail/utilities/src/functions';

import { PropertyBuilderComponentType } from '../../../types';
import { SocialListType } from './type';

import './index.scss';

interface IItem {
  id: number;
  icon: string;
  url: string;
}

const ALL_SOCIAL_ICONS = (window.yaymailData.builder.social_icons.images ?? []).map((iconData) => {
  return {
    name: iconData.name,
    src: iconData.data.find((data) => data.theme === 'Colorful')?.src,
  };
});

const SocialList: PropertyBuilderComponentType<SocialListType> = (props?) => {
  //TODO: do we need to reuse this?
  const { title, value_path } = props || {};

  const valuePath = value_path ?? 'icon_list';

  const displayTitle = useMemo(() => __(title ?? 'Sortable List'), []);

  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);

  const dataValue = useTemplateContentStore((state) => {
    return getValueByPath(state.chosenElement?.data, valuePath);
  });

  const handleBtnAddSocialClick = useCallback(() => {
    updateChosenElementData(
      (data) => {
        const notAddedIcons = ALL_SOCIAL_ICONS.filter((icon) =>
          ((data as any).icon_list ?? []).every((e: any) => e.icon !== icon.name),
        );
        setValueByPath(data, valuePath, [
          ...(dataValue ?? []),
          { url: '#', icon: (notAddedIcons[0] ?? ALL_SOCIAL_ICONS[0]).name ?? '' },
        ]);
      },
      { attribute: __('Add social item', 'yaymail') },
    );
  }, [dataValue, updateChosenElementData, valuePath]);

  return (
    <div className="yaymail-editor-property yaymail-editor-property-social-list">
      <div className="yaymail-title">{displayTitle}</div>
      <ListItems valuePath={valuePath} />
      <div className="yaymail-btn-add-social" onClick={handleBtnAddSocialClick}>
        + {__('Add social', 'yaymail')}
      </div>
    </div>
  );
};

function ListItems({ valuePath }: { valuePath: string }) {
  const mappedIconList = useTemplateContentStore((state) => {
    return (getValueByPath(state.chosenElement?.data, valuePath) ?? []).map(
      ({ icon, url }: { icon: string; url: string }, index: number) => ({
        id: index,
        icon,
        url: url,
      }),
    );
  });

  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);

  return (
    <ReactSortable
      list={mappedIconList}
      setList={(newState) => {
        const newValue = newState.map(({ icon, url }) => ({
          icon: icon,
          url: url,
        }));
        updateChosenElementData(
          (data) => {
            setValueByPath(data, valuePath, newValue);
          },
          { attribute: __('Add item', 'yaymail') },
        );
      }}
      handle=".yaymail-social-item__handle"
      ghostClass="yaymail-ghost-social-icons"
      group={{ name: 'yaymail-social-icons', pull: false }}
    >
      {mappedIconList.map((item: any, index: number) => (
        <Item key={item.id} item={item} position={index} valuePath={valuePath} />
      ))}
    </ReactSortable>
  );
}

function Item({ item, position, valuePath }: { item: IItem; position: number; valuePath: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);
  const handleDelete = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation();
      updateChosenElementData(
        (data) => {
          setValueByPath(
            data,
            valuePath,
            (data as any)[valuePath].filter((_: any, index: number) => index != position),
          );
        },
        { attribute: __('Delete item', 'yaymail') },
      );
    },
    [updateChosenElementData, position],
  );

  const handleChangeIcon = useCallback(
    (value: string) => {
      updateChosenElementData(
        (data) => {
          setValueByPath(
            data,
            valuePath,
            (data as any)[valuePath].map((iconData: any, index: number) =>
              index == position ? { ...iconData, icon: value } : iconData,
            ),
          );
        },
        { attribute: __('Change icon', 'yaymail') },
      );
    },
    [updateChosenElementData, position],
  );

  const handleChangeUrl = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      updateChosenElementData(
        (data) => {
          setValueByPath(
            data,
            valuePath,
            (data as any)[valuePath].map((iconData: any, index: number) =>
              index == position ? { ...iconData, url: e.target.value } : iconData,
            ),
          );
        },
        { attribute: __('Change url', 'yaymail') },
      );
    },
    [updateChosenElementData, position],
  );

  return (
    <div className={`yaymail-social-item${isEditing ? ' editing' : ''}`} key={item.id}>
      <div className="yaymail-social-item__header" onClick={() => setIsEditing((prev) => !prev)}>
        <span className="yaymail-social-item__handle">
          <HolderOutlined style={{ fontSize: 14 }} />
        </span>
        <span className="yaymail-social-item__label yaymail-capitalized">{item.icon}</span>
        <span className="yaymail-social-item__btn-delete" onClick={handleDelete}>
          <DeleteOutlined />
        </span>
      </div>
      {isEditing && (
        <div className="yaymail-social-item__edit-section">
          <Select style={{ width: '100%' }} value={item.icon} onChange={handleChangeIcon}>
            {ALL_SOCIAL_ICONS.map(({ name, src }) => (
              <Select.Option value={name} label={name} key={name}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={src} alt={name} height={12} />
                  <span style={{ textTransform: 'capitalize', marginLeft: 10 }}>{name}</span>
                </div>
              </Select.Option>
            ))}
          </Select>
          <Input className="yaymail-custom-input" value={item.url} onChange={handleChangeUrl} />
        </div>
      )}
    </div>
  );
}

export default SocialList;
