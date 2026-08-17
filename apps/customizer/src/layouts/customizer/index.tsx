/* eslint-disable no-restricted-imports */
import { useCallback, useContext, useState } from 'react';

import { Spin } from 'antd';

import { Sidebar } from '@src/features/email-customizer';
import useCustomizerPageStore from '@src/stores/customizerPage';
import { ComponentChildren } from '@src/types';
import classNames from 'classnames';

import { CustomizerPageContext } from './providers/CustomizerProvider';

import './index.scss';

interface ILayoutProps {
  classNames?: string;
  children: ComponentChildren;
}

const CustomizerLayout = (props: ILayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const { isPageFetching } = useContext(CustomizerPageContext);
  const isPageLoading = useCustomizerPageStore((state) => state.isPageLoading);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  return (
    <Spin style={{ maxHeight: '100vh' }} spinning={isPageFetching || isPageLoading}>
      <main className={classNames('yaymail-customizer-layout', props.classNames)}>
        <aside className={`yaymail-customizer-sidebar ${!isSidebarOpen ? 'close' : ''}`}>
          <Sidebar onToggle={toggleSidebar}></Sidebar>
        </aside>
        <section className="yaymail-customizer-main">{props.children}</section>
      </main>
    </Spin>
  );
};

export default CustomizerLayout;
