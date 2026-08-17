/** Highlight the active section in the Patterns tab collapse list (visual only; panels stay collapsed). */
export const selectPatternCollapseItem = (sectionKey: string) => {
  document.querySelectorAll('.yaymail-pattern-collapses .is-selected').forEach((element) => {
    element.classList.remove('yaymail-collapse-item-active', 'is-selected');
  });

  document
    .querySelector(`.yaymail-collapse-${sectionKey}-item`)
    ?.classList.add('yaymail-collapse-item-active', 'is-selected');
};

/** Parse Ant Design Collapse onChange key into a single section key (e.g. "header"). */
export const getPatternSectionKeyFromCollapseKey = (key: string | string[]): string => {
  if (Array.isArray(key)) {
    return key.length > 0 ? String(key[key.length - 1]) : '';
  }

  return String(key);
};
