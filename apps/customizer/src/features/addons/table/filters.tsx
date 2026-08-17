import { useContext, useEffect, useRef, useState } from 'react';

import { isWpPlatform } from '@src/common/platform';
import { __ } from '@wordpress/i18n';

import { AddonsContext } from '../addons-provider';

import './filters.scss';

type CategoryTab = { label: string; value: string };

/** WooCommerce-oriented category tabs (excludes All + WordPress). */
const WOO_CATEGORY_TABS: CategoryTab[] = [
  {
    label: __('Marketing', 'yaymail'),
    value: 'marketing',
  },
  {
    label: __('Payments', 'yaymail'),
    value: 'payments',
  },
  {
    label: __('Membership', 'yaymail'),
    value: 'membership',
  },
  {
    label: __('Multivendor', 'yaymail'),
    value: 'multivendor',
  },
  {
    label: __('Subscription', 'yaymail'),
    value: 'subscription',
  },
  {
    label: __('Order status', 'yaymail'),
    value: 'order-status',
  },
  {
    label: __('Booking', 'yaymail'),
    value: 'booking',
  },
  {
    label: __('Wholesale', 'yaymail'),
    value: 'wholesale',
  },
  {
    label: __('Shipment', 'yaymail'),
    value: 'shipment',
  },
  {
    label: __('Others', 'yaymail'),
    value: 'others',
  },
];

const statuses = [
  {
    label: __('All', 'yaymail'),
    value: 'all',
  },
  {
    label: __('Active', 'yaymail'),
    value: 'active',
  },
  {
    label: __('Inactive', 'yaymail'),
    value: 'inactive',
  },
];

const visibleCategories: CategoryTab[] = [
  { label: __('All addons', 'yaymail'), value: 'all' },
  ...(isWpPlatform() ? [{ label: __('WordPress', 'yaymail'), value: 'wordpress' }] : WOO_CATEGORY_TABS),
];

const showCategoryRow = visibleCategories.length > 2;

export default function AddonsFilters() {
  const { category, status, setCategory, setStatus, isFetching } = useContext(AddonsContext);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Function to check scroll position and update arrow visibility
  const updateArrowVisibility = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
  };

  // Function to scroll the container
  const scrollContainer = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 200;
    const newScrollLeft =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (!showCategoryRow) return;

    const scrollableContainer = scrollContainerRef.current;
    if (!scrollableContainer) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // stop the normal vertical scroll
      scrollableContainer.scrollLeft += e.deltaY; // deltaY is positive = scroll down
    };

    const handleScroll = () => {
      updateArrowVisibility();
    };

    scrollableContainer.addEventListener('wheel', handleWheel, { passive: false });
    scrollableContainer.addEventListener('scroll', handleScroll);

    updateArrowVisibility();

    return () => {
      scrollableContainer.removeEventListener('wheel', handleWheel);
      scrollableContainer.removeEventListener('scroll', handleScroll);
    };
  }, [category, showCategoryRow]);

  // Update arrows on window resize
  useEffect(() => {
    if (!showCategoryRow) return;

    const handleResize = () => {
      updateArrowVisibility();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showCategoryRow]);

  return (
    <div
      className={`yaymail-addons-filters${
        !showCategoryRow ? ' yaymail-addons-filters--no-categories' : ''
      }`}
    >
      {showCategoryRow && (
        <div className="yaymail-addons-filters__categories-wrapper">
          {showLeftArrow && (
            <button
              className="yaymail-addons-filters__arrow yaymail-addons-filters__arrow--left"
              onClick={() => scrollContainer('left')}
              aria-label={__('Scroll left', 'yaymail')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" version="1.1" aria-hidden="false">
                <path d="M15.5 18.5 14 20l-8-8 8-8 1.5 1.5L9 12l6.5 6.5Z"></path>
              </svg>
            </button>
          )}
          <div className="yaymail-addons-filters__categories" ref={scrollContainerRef}>
            {visibleCategories.map((catItem) => (
              <div
                key={catItem.value}
                className={`yaymail-addons-filters__categories-item ${
                  catItem.value === category ? 'active' : ''
                }`}
                onClick={(e) => {
                  if (isFetching) {
                    return;
                  }
                  e.preventDefault();
                  e.stopPropagation;
                  setCategory(catItem.value);
                }}
              >
                {catItem.label}
              </div>
            ))}
          </div>
          {showRightArrow && (
            <button
              className="yaymail-addons-filters__arrow yaymail-addons-filters__arrow--right"
              onClick={() => scrollContainer('right')}
              aria-label={__('Scroll right', 'yaymail')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" version="1.1" aria-hidden="false">
                <path d="M8.5 5.5 10 4l8 8-8 8-1.5-1.5L15 12 8.5 5.5Z"></path>
              </svg>
            </button>
          )}
        </div>
      )}
      <div className="yaymail-addons-filters__statuses">
        {statuses.map((statusItem) => (
          <div
            key={statusItem.value}
            className={`yaymail-addons-filters__statuses-item ${
              statusItem.value === status ? 'active' : ''
            }`}
            onClick={(e) => {
              if (isFetching) {
                return;
              }
              e.preventDefault();
              e.stopPropagation;
              setStatus(statusItem.value);
            }}
          >
            {statusItem.label}
          </div>
        ))}
      </div>
    </div>
  );
}
