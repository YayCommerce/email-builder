import { ComponentChildren } from '@src/types';
import classNames from 'classnames';

import './index.scss';

interface ILayoutProps {
  sectionId?: string | null;
  title?: string;
  className?: string;
  children: ComponentChildren;
}

export default function DashboardContentLayout({
  title = 'Default Title',
  sectionId = null,
  className = '',
  children,
}: ILayoutProps) {
  return (
    <section
      className={classNames('yaymail-dashboard__content', className)}
      data-section-id={sectionId}
    >
      <div style={{ display: 'flex' }}>
        <h3>{title}</h3>
      </div>
      {children}
    </section>
  );
}
