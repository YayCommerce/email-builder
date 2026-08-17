import { useCallback, useEffect, useMemo, useState } from 'react';

import { Tour, TourProps } from 'antd';

import { changeGhfTour } from '@src/common/ajax';
import { isWpPlatform } from '@src/common/platform';
import useCustomizerPageStore from '@src/stores/customizerPage';
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';

import './tour.scss';

export default function GlobalHFtourGhfPage() {
  const isPageLoading = useCustomizerPageStore((state) => state.isPageLoading);
  const isActiveTour = useCustomizerPageStore((state) => state.isTourMode);
  const setIsActiveTour = useCustomizerPageStore((state) => state.setTourMode);
  const [currentStep, setCurrentStep] = useState(0);
  const steps = useMemo<TourProps['steps']>(
    () => [
      {
        title: __('Welcome to Global Header and Footer Guidance', 'yaymail'),
        description: __(
          'Design once, apply everywhere! Save time by setting up a global header and footer for all your emails.',
          'yaymail',
        ),
        target: null,
        nextButtonProps: {
          children: __("Let's start", 'yaymail'),
        },
      },
      {
        title: __('Open the Editor', 'yaymail'),
        description: __(
          "Here, you can access the Global Header & Footer editor. You'll see two sections: one for the header and one for the footer.",
          'yaymail',
        ),
        target: () =>
          (document.querySelector(
            '.yaymail-customizer-email-template-container [data-yaymail-element-type="heading"]',
          ) ?? null) as HTMLElement,
        nextButtonProps: {
          children: __('View footer section', 'yaymail'),
        },
      },
      {
        title: __('Footer section', 'yaymail'),
        description: __('Here, you can add your footer content.', 'yaymail'),
        target: () =>
          (document.querySelector(
            '.yaymail-customizer-email-template-container [data-yaymail-element-type="footer"]',
          ) ?? null) as HTMLElement,
        nextButtonProps: {
          children: __('Next', 'yaymail'),
        },
      },
      {
        title: __('Design Your Header', 'yaymail'),
        description: __(
          'Drag elements from the left panel into the ‘Header’ area. Add logos, menus, text, or social icons.',
          'yaymail',
        ),
        target: () =>
          (document.querySelector('.yaymail-customizer-tab-elements') ?? null) as HTMLElement,
      },
      {
        title: __('Design Your Footer', 'yaymail'),
        description: __(
          'Now do the same for the Footer area. Include company info, phone number, shop links, or anything else you need.',
          'yaymail',
        ),
        target: null,
      },
      {
        title: __('Save and Apply Globally', 'yaymail'),
        description: __(
          'Click ‘Save’ to keep your designs as the ‘Global Header’ and ‘Global Footer’. You can then add them to any email template later.',
          'yaymail',
        ),
        target: null,
      },
      {
        title: __('Turn on the Global Header and Footer', 'yaymail'),
        description: __(
          'Enable to make your Global Header and Footer visible in all email templates.',
          'yaymail',
        ),
        target: () =>
          (document.querySelector('#yaymail-global-header-footer-toggle') ?? null) as HTMLElement,
      },
      {
        title: __('All set! Your Global Header & Footer are live.', 'yaymail'),
        description: __(
          'They now inject automatically into every email template—no dragging required. Open any template to preview or start creating your next email.',
          'yaymail',
        ),
        target: null,
        nextButtonProps: {
          children: __('Got it!', 'yaymail'),
        },
        cover: (
          <img
            alt="tour-mockup"
            src={
              window.yaymailData.urls.asset_url +
              (isWpPlatform() ? 'tour-mockup-wp.png' : 'tour-mockup.png')
            }
          />
        ),
        placement: 'bottom',
      },
    ],
    [isPageLoading, currentStep],
  );

  useEffect(() => {
    if (isActiveTour) {
      setCurrentStep(0);
    }
  }, [isActiveTour]);

  const isMasking = useMemo(() => {
    return (steps ?? [])[currentStep]?.target === null;
  }, [currentStep, steps]);

  const onChangeStep = (step: number) => {
    if (step === 3) {
      useTemplateContentStore.getState().unchooseElement();
      setTimeout(() => {
        setCurrentStep(step);
      }, 100);
      return;
    }
    setCurrentStep(step);
  };

  const stopTour = useCallback(() => {
    const nextMove = 'second_move';
    window.yaymailData.ghf_tour = nextMove;
    changeGhfTour(nextMove);
    setIsActiveTour(false);
  }, [changeGhfTour, setIsActiveTour]);

  return isPageLoading ? null : (
    <Tour
      steps={steps}
      open={isActiveTour}
      onClose={stopTour}
      current={currentStep}
      onChange={onChangeStep}
      scrollIntoViewOptions={{
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      }}
      rootClassName={classNames([
        isMasking ? 'yaymail-tour-mask--masking' : '',
        currentStep === (steps ?? []).length - 1 ? 'yaymail-tour--with-cover' : '',
      ])}
      onFinish={stopTour}
      indicatorsRender={(current, total) => (
        <span>
          {current + 1} / {total}
        </span>
      )}
    />
  );
}
