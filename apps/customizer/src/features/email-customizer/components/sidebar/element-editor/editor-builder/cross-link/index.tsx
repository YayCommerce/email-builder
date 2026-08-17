import { Button, Divider, Modal } from 'antd';

import { ReactComponent as CrossSaleIcon } from '@src/assets/svgs/cross-sale.svg';
import { ReactComponent as CrossSaleTooltipIcon } from '@src/assets/svgs/cross-sale-tooltip.svg';
import { __ } from '@wordpress/i18n';

import './style.scss';
import { useState } from 'react';

const CrossLink = () => {
  const [openModal, setOpenModal] = useState(false)
  const handleClick = () => {
    window.open(
      'https://yaycommerce.com/yaymail-addons/conditional-logic-addon-for-yaymail/',
      '_blank',
    );
  };
  return (
    <>
      <div className="yaymail-editor-property yaymail-editor-property-line-breaker">
        <Divider
          style={{
            borderColor: 'var(--yaymail-sidebar-color-grey-light)',
            margin: 0,
          }}
        />
      </div>
      <div className="yaymail-editor-property yaymail-editor-property-group-definition">
        <div className="yaymail-editor-property-group-definition__title">Conditional Logic</div>
        <div className='yaymail-cross-sell-cta-1'>
          <img className='yaymail-cross-sell-cta-1__img' src="#" />
          <p className='yaymail-cross-sell-cta-1__title' >YayMail Conditional Logic</p>
          <p className='yaymail-cross-sell-cta-1__description'>Personalize your emails based on customizer data and behavior</p>
          <Button variant='solid' className='yaymail-cross-sell-cta-1__button' onClick={handleClick}><Crown /> Unlock Personalization</Button>
          <p className='yaymail-cross-sell-cta-1__link' onClick={() => { setOpenModal(true) }}>View Example</p>
        </div>
      </div>
      <Modal open={openModal} footer={false} width={1180} onCancel={() => { setOpenModal(false) }} className='yaymail-cross-sell-modal'>
        <img src="#" style={{ maxWidth: '100%' }} />
        <div className='yaymail-cross-sell-modal__content'>
          <h3 className='yaymail-cross-sell-modal__title'>YayMail Conditional Logic</h3>
          <p className='yaymail-cross-sell-modal__description'>Personalize your emails based on customer data and behavior to make your messages more relevant, engaging, and effective.</p>
          <Button className='yaymail-cross-sell-modal__button' onClick={handleClick}><Crown /> Unlock Personalization</Button>
        </div>
      </Modal>
    </>
  );
};

export default CrossLink;

const Crown = () => <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13.0211 1.14023C12.7586 1.03633 12.4605 1.10469 12.2691 1.30977L9.58398 4.74141L7.31445 0.336328C7.19141 0.128516 6.96992 0 6.72656 0C6.4832 0 6.25898 0.128516 6.13867 0.336328L3.86914 4.74141L1.18398 1.3125C0.992578 1.10742 0.694531 1.03906 0.432031 1.14297C0.172266 1.24414 0 1.4957 0 1.77734V10.8828C0 11.8617 0.798438 12.6602 1.77734 12.6602H11.6758C12.6547 12.6602 13.4531 11.8617 13.4531 10.8828V1.77734C13.4531 1.4957 13.2809 1.24414 13.0211 1.14023Z" fill="black" />
</svg>
