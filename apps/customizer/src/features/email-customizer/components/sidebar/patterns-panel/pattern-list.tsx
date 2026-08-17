import { useEffect, useRef } from 'react';

import { PatternType } from '@src/features/email-customizer/type';
import { getDuplicatedObjectByIds } from '@src/features/email-customizer/utils';
import useCustomizerSettingsStore from '@src/stores/customizerSettings';

import EmailRecursiveElements from '../../email-template-container/email-recursive-element';
import ElementList from '../element-list';

import './pattern-list.scss';

export default function PatternList(props: { patterns: PatternType[] }) {
  const settings = useCustomizerSettingsStore((state) => state.settings);
  const { patterns } = props;
  useEffect(() => {
    let count = 0;
    function resizePatternItemPreview() {
      window.jQuery('.yaymail-pattern-item').each((index, itemElement) => {
        const previewElement = window.jQuery(itemElement).find('.yaymail-pattern-item__preview');
        previewElement.css('height', '');
        const previewElementHeight = previewElement.height() ?? 0;

        let scale = 276 / (settings?.container_width ?? 900);

        previewElement.css('height', `${previewElementHeight * scale}px`);
      });
    }

    resizePatternItemPreview();
    /** Trick to resize the pattern item preview after height change */
    let interval = setInterval(() => {
      resizePatternItemPreview();
      count++;
      if (count > 10) {
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [patterns]);

  return (
    <ElementList
      elements={(patterns as any[]).map((p) => p.elements)}
      className="yaymail-pattern-list"
    >
      {patterns.map((pattern) => {
        pattern.elements = getDuplicatedObjectByIds(
          pattern.elements.map((element) => element.id),
          pattern.elements,
        );
        return (
          <Item
            key={pattern.id}
            pattern={pattern}
            containerWidth={settings?.container_width ?? 900}
          />
        );
      })}
    </ElementList>
  );
}

function Item(props: { pattern: PatternType; containerWidth: number }) {
  const { pattern, containerWidth } = props;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current == null) {
      return;
    }
    const itemElement = window.jQuery(ref.current).find('.yaymail-pattern-item').get(0);

    if (!itemElement) {
      return;
    }

    const previewElement = window.jQuery(ref.current).find('.yaymail-pattern-item__preview');
    const previewElementHeight = previewElement.height() ?? 0;

    const computedStyle = window.getComputedStyle(itemElement);

    let scale = parseFloat(
      computedStyle.getPropertyValue('--yaymail-pattern-preview-iframe-scale').trim(),
    );

    previewElement.css('height', `${previewElementHeight * scale}px`);
  }, [ref.current, pattern.id]);

  return (
    <div
      className="yaymail-pattern-item-wrapper yaymail-customizer-main"
      data-yaymail-element-is-pattern
      data-yaymail-element-type={(pattern as any).type ?? ''}
      data-yaymail-element-id={pattern.id}
    >
      <div
        className="yaymail-customizer-sidebar-element yaymail-pattern-item"
        style={
          {
            '--yaymail-pattern-preview-iframe-width': containerWidth + 'px',
            '--yaymail-pattern-preview-iframe-scale': `${276 / containerWidth}`,
          } as any
        }
      >
        <div className="yaymail-pattern-item__preview">
          <div className="yaymail-pattern-item__preview__container">
            <div className="yaymail-pattern-item__preview__scale-container">
              <div className="yaymail-customizer-email-template-container">
                <EmailRecursiveElements list={pattern.elements} />
              </div>
            </div>
          </div>
        </div>
        <span className="yaymail-pattern-item__name"> {pattern.name}</span>
      </div>
      <div
        className="yaymail-ghost-element yaymail-ghost-pattern-element"
        style={{
          width: containerWidth + 'px',
        }}
      >
        <div className="yaymail-pattern-ghost-list">
          <EmailRecursiveElements list={pattern.elements} />
        </div>
      </div>
    </div>
  );
}
