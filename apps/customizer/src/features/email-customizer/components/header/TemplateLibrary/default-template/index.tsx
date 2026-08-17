import useCustomizerSettingsStore from '@src/stores/customizerSettings';
import EmailRecursiveElements from '../../../email-template-container/email-recursive-element';
import { defaultTemplate } from './data';
import { __ } from '@wordpress/i18n';
import { ClockCircleOutlined } from '@ant-design/icons';

const DefaultTemplate = () => {
  const settings = useCustomizerSettingsStore((state) => state.settings);
  const containerWidth = settings?.container_width ?? 900;
  const previewScale = 220 / containerWidth;

  return (
    <div className={'yaymail-template-library__card yaymail-template-library__card--coming-soon'}>
      <div className="yaymail-template-library__card-badge yaymail-template-library__card-soon-badge">
        <ClockCircleOutlined style={{ fontSize: 12 }} />
        {__('SOON', 'yaymail')}
      </div>
      <div className="yaymail-template-library__card-preview-container">
        <div className="yaymail-template-library__card-preview">
          <div className="yaymail-template-library__card-overlay yaymail-template-library__card-overlay--coming-soon">
            <div className="yaymail-template-library__card-overlay-coming-soon-content">
              <ClockCircleOutlined className="yaymail-template-library__card-overlay-coming-soon-icon" />
              <span className="yaymail-template-library__card-overlay-coming-soon-text">
                {__('Coming Soon', 'yaymail')}
              </span>
            </div>
            <div className="yaymail-template-library__card-stripe-pattern" />
          </div>
          <div
            className="yaymail-template-library__card-preview-scale"
            style={
              {
                '--yaymail-template-preview-width': `${containerWidth}px`,
                '--yaymail-template-preview-scale': previewScale,
              } as React.CSSProperties
            }
          >
            <div className="yaymail-customizer-email-template-container yaymail-customizer-main">
              <EmailRecursiveElements list={defaultTemplate.elements} />
            </div>
          </div>
        </div>
      </div>
      <div className="yaymail-template-library__card-content">
        <div className="yaymail-template-library__card-content-title">{defaultTemplate.name}</div>
        <div className="yaymail-template-library__card-content-description">
          {defaultTemplate.description}
        </div>
      </div>
    </div>
  );
};

export default DefaultTemplate;
