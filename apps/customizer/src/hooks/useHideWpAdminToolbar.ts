import { useEffect } from 'react';

const useHideWpAdminToolbar = () => {
  useEffect(() => {
    const wpToolbarHtmlElement = window.jQuery('html.wp-toolbar');

    wpToolbarHtmlElement?.addClass('hidden-wp-admin-menu');

    return () => {
      wpToolbarHtmlElement?.removeClass('hidden-wp-admin-menu');
    };
  }, []);
};

export default useHideWpAdminToolbar;
