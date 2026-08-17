const adjustElements = (elements: JQuery<HTMLElement>, property: string, factor: number) => {
  const $ = window.jQuery;

  const adjust = (el: JQuery<HTMLElement>, prop: string, fact: number) => {
    const cssValue = $(el).css(prop);

    if (cssValue.includes('%')) {
      return;
    }

    const numericValue = parseFloat($(el).css(prop));
    const adjustedValue = numericValue * fact;
    $(el).css(prop, `${adjustedValue}px`);
    $(el).addClass('adjusted');
  };

  elements.each((index, element) => {
    const _element = $(element);
    if (!_element.children().length) {
      adjust(_element, property, factor);
    } else {
      _element.children().each((i, el) => {
        $(el)
          .find('span, p')
          .each((j, e) => {
            const _e = $(e);
            if (_e.css(property) && !_e.hasClass('adjusted')) {
              adjust(_e, property, factor);
            }
          });
      });
    }
  });

  $('.adjusted').removeClass('adjusted');
};

export const handlePreview = (isMobile: boolean) => {
  const conversionRate = 0.8;
  const className = 'yaymail-template-content__mobile';

  const templateContentElement = window.jQuery(
    '.yaymail-preview-template__modal .yaymail-preview-template-content',
  );

  isMobile
    ? templateContentElement.addClass(className)
    : templateContentElement.removeClass(className);

  return;

  const elementsText = templateContentElement
    .find('table.yaymail-customizer-email-template-container')
    .find('table th, table td, h1, h2, h3, h4, a');
  const elementsImage = templateContentElement.find('img');

  const deviceFactor = isMobile ? conversionRate : 1 / conversionRate;

  adjustElements(elementsText, 'font-size', deviceFactor);
  adjustElements(elementsImage, 'width', deviceFactor);
  // adjustElements(elementsImage, 'height', deviceFactor);
};
