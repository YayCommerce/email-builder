import { ItemInterface, ReactSortableProps } from 'react-sortablejs';

export type SocialListType = {
  title?: string;
  value_path?: string;
} & ReactSortableProps<ItemInterface>;
