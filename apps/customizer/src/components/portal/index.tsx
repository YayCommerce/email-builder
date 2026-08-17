import { PropsWithChildren, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children }: PropsWithChildren) => {
  const contextMenuRoot = useMemo(() => {
    return document.querySelector('#yaymail-portal-root');
  }, []);

  const elementRef = useRef<HTMLDivElement | null>(null);

  if (!elementRef.current) elementRef.current = document.createElement('div');

  useEffect(() => {
    const element = elementRef.current!;
    contextMenuRoot?.appendChild(element);
    return () => {
      contextMenuRoot?.removeChild(element);
    };
  });

  return createPortal(children, elementRef.current);
};

export default Portal;
