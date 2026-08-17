import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { Spin } from 'antd';

import { RenewedElementTreeProvider } from '@src/features/email-customizer/renewedElementTreeContext';
import { IElement } from '@src/features/email-customizer/type';
import DeviceSwitcher from '@src/features/preview-email/device-switcher';
import {
  adjustIframeHeightToContent,
  buildTemplateLibraryPreviewDoc,
} from '@src/utils/iframe-preview';
import { __ } from '@wordpress/i18n';

import EmailRecursiveElements from '../../../email-template-container/email-recursive-element';
import { renewRootsForPreview } from './previewElementTree';

export type PreviewDeviceType = 'desktop' | 'mobile';

interface PreviewStepProps {
  finalElements: IElement[];
  /** When set with onDeviceChange, device toggle is shown in parent header (Template Library). */
  device?: PreviewDeviceType;
  onDeviceChange?: React.ComponentProps<typeof DeviceSwitcher>['onChange'];
}

const PreviewStep: React.FC<PreviewStepProps> = ({
  finalElements,
  device: deviceProp,
  onDeviceChange,
}) => {
  const [internalDevice, setInternalDevice] = useState<PreviewDeviceType>('desktop');
  const isDeviceControlled = deviceProp !== undefined && onDeviceChange !== undefined;
  const device = isDeviceControlled ? deviceProp : internalDevice;
  const setDevice = isDeviceControlled ? onDeviceChange : setInternalDevice;

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const hiddenRef = useRef<HTMLDivElement | null>(null);
  const [srcDoc, setSrcDoc] = useState('');
  const [loading, setLoading] = useState(true);

  const previewElements = useMemo(() => renewRootsForPreview(finalElements), [finalElements]);

  useEffect(() => {
    adjustIframeHeightToContent(iframeRef.current);
  }, [device, srcDoc]);

  useLayoutEffect(() => {
    const el = hiddenRef.current;
    if (!el) return;
    setLoading(true);
    const rafId = requestAnimationFrame(() => {
      setSrcDoc(buildTemplateLibraryPreviewDoc(el.innerHTML, { isMobile: device === 'mobile' }));
    });
    const timerId = setTimeout(() => setLoading(false), 200);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
    };
  }, [previewElements, device]);

  return (
    <div className="yaymail-template-library__preview-step">
      <div
        className={`yaymail-template-library__preview-step-top${
          isDeviceControlled ? ' yaymail-template-library__preview-step-top--no-switcher' : ''
        }`}
      >
        {!isDeviceControlled && <DeviceSwitcher onChange={setDevice} currentDevice={device} />}
      </div>

      <div
        ref={hiddenRef}
        style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none', zIndex: -1 }}
        aria-hidden="true"
      >
        <RenewedElementTreeProvider roots={previewElements}>
          <EmailRecursiveElements list={previewElements} />
        </RenewedElementTreeProvider>
      </div>

      <div
        className="yaymail-template-library__preview-step-container"
        style={{ position: 'relative' }}
      >
        {loading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.75)',
              zIndex: 10,
            }}
          >
            <Spin />
          </div>
        )}
        <div className={`yaymail-preview-template-content yaymail-template-content__${device}`}>
          <div className={`modal__content modal__content--${device}`} style={{ overflow: 'auto' }}>
            <iframe
              ref={iframeRef}
              className={`yaymail-preview-iframe yaymail-preview-iframe--${device}`}
              srcDoc={srcDoc}
              scrolling="no"
              onLoad={() => {
                const iframe = iframeRef.current;
                const sync = () => adjustIframeHeightToContent(iframe);
                sync();
                requestAnimationFrame(() => {
                  sync();
                  requestAnimationFrame(sync);
                });
                window.setTimeout(sync, 150);
              }}
              style={{ border: 'none', width: '100%', display: 'block' }}
              title={__('Email preview', 'yaymail')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewStep;
