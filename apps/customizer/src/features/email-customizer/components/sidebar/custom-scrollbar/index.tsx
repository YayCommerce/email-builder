import { forwardRef, Ref, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

import { ComponentChildren } from '@src/types';
import classNames from 'classnames';

import './index.scss';
import { useDirection } from '@src/hooks/useDirection';

interface IScrollbarProps {
  children: ComponentChildren;
}

const renderThumbVertical = ({ style, ...props }: any) => (
  <div
    {...props}
    style={{
      ...style,
      cursor: 'pointer',
      borderRadius: 'inherit',
      width: '3px',
    }}
  ></div>
);

const CustomScrollbarContent = ({ children }: IScrollbarProps, ref: Ref<Scrollbars>) => {
  const [isScrolling, setIsScrolling] = useState<boolean>(false);

  return (
    <Scrollbars
      ref={ref}
      renderThumbVertical={renderThumbVertical}
      className={classNames('yaymail-custom-scrollbar', isScrolling && 'yaymail-scrolling')}
      onScrollStart={() => setIsScrolling(true)}
      onScrollStop={() => setIsScrolling(false)}
      {...(window.yaymailData.is_rtl
        ? {
            renderView: (props) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  marginLeft: props.style.marginRight,
                  marginRight: 0,
                  overflowX: 'hidden',
                }}
              />
            ),
          }
        : {})}
    >
      <div className="yaymail-customizer-scroll-content">{children}</div>
    </Scrollbars>
  );
};

const CustomScrollbar = forwardRef<Scrollbars, IScrollbarProps>(CustomScrollbarContent);

export default CustomScrollbar;
