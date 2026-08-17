/* eslint-disable no-restricted-imports */
import { Dropdown } from 'antd';

import { ReactComponent as ExtraOptionsIcon } from '@src/assets/svgs/extra-options-icon.svg';
import YAYMAIL_TOKENS from '@src/constants/tokens';
import { IElement } from '@src/features/email-customizer/type';

import { useExtraOptionsMenuContext } from './ExtraOptionsMenuContext';

import './index.scss';

type ElementExtraOptionsProps = {
  element: IElement;
};

const ElementExtraOptions = ({ element }: ElementExtraOptionsProps) => {
  const { items, dotMenuElementId, setDotMenuElementId, closeContextMenu } =
    useExtraOptionsMenuContext();

  const isOpen = dotMenuElementId === element.id;

  return (
    <div
      className="yaymail-customizer-element__extra-options"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Dropdown
        menu={{ items }}
        open={isOpen}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            closeContextMenu();
            setDotMenuElementId(element.id);
            return;
          }

          setDotMenuElementId(null);
        }}
        trigger={['click']}
      >
        <div
          className="extra-options__activator"
          onClick={(e) => {
            e.stopPropagation();
            closeContextMenu();
            setDotMenuElementId(element.id);
          }}
        >
          <ExtraOptionsIcon style={{ fill: YAYMAIL_TOKENS.button.color.grey[200] }} />
        </div>
      </Dropdown>
    </div>
  );
};

export default ElementExtraOptions;
