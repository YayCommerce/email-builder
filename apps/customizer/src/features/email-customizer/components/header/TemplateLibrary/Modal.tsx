import React, { useMemo, useRef, useState } from 'react';

import { Button, Card, Modal as AntModal, Skeleton } from 'antd';

import { ModalFooter, ModalHeader } from '@src/components/modal-header-footer';

import { useTemplateLibraryList } from '@src/hooks/queries/useTemplateLibraryQueries';

import { TemplateLibrarySummary } from '@src/common/api/templateLibraryApi';
import { IElement } from '@src/features/email-customizer/type';
import DeviceSwitcher from '@src/features/preview-email/device-switcher';
import useCustomizerPageStore from '@src/stores/customizerPage';
import useCustomizerSettingsStore from '@src/stores/customizerSettings';
import useTemplateContentStore from '@src/stores/templateContent';
import { pushChangeToHistory } from '@src/stores/templateContentHistory';
import { getDefaultTemplateName } from '@src/utils';
import { __ } from '@wordpress/i18n';

import { resolvePresetColorValues } from '../../sidebar/element-editor/property-builders/utils';
import ContentMapping, { ContentMappingRef } from './ContentMapping';
import { buildFinalElements, computeMapping } from './ContentMapping/mappingCore';
import PreviewStep, { PreviewDeviceType } from './ContentMapping/PreviewStep';
import DefaultTemplate from './default-template';
import DeleteSavedTemplateModal from './DeleteSavedTemplateModal';
import TemplateLibraryCard from './TemplateLibraryCard';

import '../index.scss';
import styles from '@src/components/modal-header-footer/styles.module.scss';

interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalStep = 'select' | 'mapping' | 'preview';

const STEP_TITLES: Record<ModalStep, string> = {
  select: 'Choose a template',
  mapping: 'Map Your Content',
  preview: 'Preview Template',
};

const HeaderContent = ({
  templateTitle,
  step,
  previewDevice,
  onPreviewDeviceChange,
}: {
  templateTitle: string;
  step: ModalStep;
  previewDevice: PreviewDeviceType;
  onPreviewDeviceChange: React.ComponentProps<typeof DeviceSwitcher>['onChange'];
}) => {
  if (step === 'preview') {
    return (
      <>
        <h4 className={styles['modal_header_title']}>{__('Email preview', 'yaymail')}</h4>
        <div className={styles['modal-header-right']}>
          <DeviceSwitcher onChange={onPreviewDeviceChange} currentDevice={previewDevice} />
        </div>
      </>
    );
  }
  return (
    <div className="yaymail-template-library__header-content">
      <h4 className="yaymail-template-library__header-content-title">
        {__(STEP_TITLES[step], 'yaymail')}
      </h4>
      {templateTitle && (
        <p className="yaymail-template-library__header-template-title">
          <span className="yaymail-template-library__header-template-title-dot-icon"></span>
          {templateTitle}
        </p>
      )}
    </div>
  );
};

const Modal: React.FC<IModalProps> = ({ isOpen, onClose }) => {
  //Email type of the current template, example: new_order, customer_on_hold_order, etc.
  const emailType = useCustomizerPageStore((state) => state.currentTemplate);

  const resolvedEmailType = emailType ?? getDefaultTemplateName();

  const { data: preDesignedTemplates = [], isLoading } = useTemplateLibraryList({
    email_type: resolvedEmailType,
    isEnabled: isOpen,
  });

  //ID of the selected pre-designed email template
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TemplateLibrarySummary | null>(null);
  const [step, setStep] = useState<ModalStep>('select');
  const [finalElements, setFinalElements] = useState<IElement[] | null>(null);
  const [skippedMapping, setSkippedMapping] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<PreviewDeviceType>('desktop');
  const mappingRef = useRef<ContentMappingRef>(null);

  const templateData = useCustomizerPageStore((state) => state.templateData);
  const templateList = useCustomizerPageStore((state) => state.templates);
  const updateTemplateData = useCustomizerPageStore((state) => state.updateTemplateData);
  const hideTemplateGlobalHeader = useCustomizerPageStore(
    (state) => state.hideTemplateGlobalHeader,
  );
  const hideTemplateGlobalFooter = useCustomizerPageStore(
    (state) => state.hideTemplateGlobalFooter,
  );
  const changeContentStatus = useTemplateContentStore((state) => state.changeContentStatus);
  const setCustomizerContent = useTemplateContentStore((state) => state.updateList);
  const currentElements = useTemplateContentStore((state) => state.list);

  const settings = useCustomizerSettingsStore((state) => state.settings);
  const containerWidth = settings?.container_width ?? 900;
  const previewScale = 220 / containerWidth;

  const templateTitle = useMemo(() => {
    return (
      templateList.find((template) => templateData?.name === template.name)?.template_title ?? ''
    );
  }, [templateData, templateList]);

  const selectedTemplate = useMemo(
    () => preDesignedTemplates.find((template) => template.id === selectedTemplateId) ?? null,
    [preDesignedTemplates, selectedTemplateId],
  );

  const canApplySelectedTemplate = !!selectedTemplate && selectedTemplate.available === true;

  const handleNext = () => {
    if (!selectedTemplateId || !canApplySelectedTemplate || !selectedTemplate) return;
    const oldElements = currentElements;
    const newElements = selectedTemplate.elements ?? [];
    const mapping = computeMapping(oldElements, newElements);
    const isEmpty = mapping.slots.length === 0 && mapping.orphans.length === 0;
    if (isEmpty) {
      const elements = buildFinalElements(newElements, mapping.slots, mapping.orphans);
      setFinalElements(elements);
      setSkippedMapping(true);
      setStep('preview');
    } else {
      setSkippedMapping(false);
      setStep('mapping');
    }
  };

  const handleBack = () => {
    if (step === 'preview') {
      setPreviewDevice('desktop');
      if (skippedMapping) {
        setStep('select');
        setFinalElements(null);
        setSkippedMapping(false);
      } else {
        setStep('mapping');
      }
    } else {
      setStep('select');
      setFinalElements(null);
    }
  };

  const handleNextToPreview = () => {
    const elements = mappingRef.current?.getFinalElements();
    if (!elements) return;
    setFinalElements(elements);
    setStep('preview');
  };

  const handleRequestApply = () => {
    if (step === 'select') handleNext();
  };

  const handleApply = () => {
    if (!finalElements) return;

    const rawLink = selectedTemplate?.email_settings?.text_link_color;
    const resolvedLink = rawLink !== undefined ? resolvePresetColorValues(rawLink, {}) : undefined;

    setCustomizerContent(finalElements);
    updateTemplateData({
      ...templateData,
      elements: finalElements,
      ...(resolvedLink !== undefined ? { text_link_color: resolvedLink } : {}),
    } as any);
    hideTemplateGlobalHeader(true);
    hideTemplateGlobalFooter(true);
    changeContentStatus(true);
    pushChangeToHistory({
      action: 'edited',
      elementName: 'Template',
    });
    setPreviewDevice('desktop');
    setSelectedTemplateId(null);
    setStep('select');
    setFinalElements(null);
    setSkippedMapping(false);
    onClose();
  };

  const handleCancel = () => {
    setPreviewDevice('desktop');
    setSelectedTemplateId(null);
    setStep('select');
    setFinalElements(null);
    setSkippedMapping(false);
    onClose();
  };

  return (
    <>
      <AntModal
        title={
          <ModalHeader
            content={
              <HeaderContent
                templateTitle={templateTitle}
                step={step}
                previewDevice={previewDevice}
                onPreviewDeviceChange={setPreviewDevice}
              />
            }
          />
        }
        wrapClassName="yaymail-template-library__modal-wrap"
        className={`yaymail-global__modal yaymail-template-library__modal${
          step !== 'select' ? ' yaymail-template-library__modal--fixed-body' : ''
        }`}
        open={isOpen}
        onCancel={handleCancel}
        centered
        width={'70%'}
        footer={
          step === 'select' ? (
            <ModalFooter
              onOk={handleRequestApply}
              onCancel={handleCancel}
              okText={__('Next', 'yaymail')}
              isButtonOkDisabled={!selectedTemplateId || !canApplySelectedTemplate}
            />
          ) : step === 'mapping' ? (
            <div className="modal__footer">
              <Button type="primary" onClick={handleNextToPreview}>
                {__('Next', 'yaymail')}
              </Button>
              <Button onClick={handleBack}>{__('← Back', 'yaymail')}</Button>
            </div>
          ) : (
            <div className="modal__footer">
              <Button type="primary" onClick={handleApply}>
                {__('Apply Template', 'yaymail')}
              </Button>
              <Button onClick={handleBack}>{__('← Back', 'yaymail')}</Button>
              <Button onClick={handleCancel}>{__('Cancel', 'yaymail')}</Button>
            </div>
          )
        }
      >
        {step === 'select' ? (
          <>
            <p className="modal__content yaymail-template-library__description">
              {__(
                'Select a premade template for this email. You can customize it further after applying.',
                'yaymail',
              )}
            </p>
            <div className="modal__content yaymail-template-library__content">
              {isLoading ? (
                <div className="yaymail-template-library__grid">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} style={{ minHeight: 180 }}>
                      <Skeleton active />
                    </Card>
                  ))}
                </div>
              ) : (
                <>
                  <div className="yaymail-template-library__grid">
                    {preDesignedTemplates.map((template) => (
                      <TemplateLibraryCard
                        key={template.id}
                        template={template}
                        isSelected={selectedTemplateId === template.id}
                        containerWidth={containerWidth}
                        previewScale={previewScale}
                        onSelect={setSelectedTemplateId}
                        onRequestDelete={setDeleteTarget}
                      />
                    ))}
                    <DefaultTemplate />
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="yaymail-template-library__mapping-preview-wrap">
            {/* Keep ContentMapping mounted during preview so selections are preserved on Back */}
            <div style={{ display: step === 'mapping' ? undefined : 'none' }}>
              <ContentMapping
                ref={mappingRef}
                newTemplate={selectedTemplate?.elements ?? []}
                oldElements={currentElements}
                newTemplateName={selectedTemplate?.name ?? ''}
                oldTemplateName={templateTitle}
              />
            </div>
            {step === 'preview' && finalElements && (
              <PreviewStep
                finalElements={finalElements}
                device={previewDevice}
                onDeviceChange={setPreviewDevice}
              />
            )}
          </div>
        )}
      </AntModal>
      <DeleteSavedTemplateModal
        template={deleteTarget}
        emailType={resolvedEmailType}
        isOpen={deleteTarget != null}
        onClose={() => setDeleteTarget(null)}
        onDeleted={(templateId) => {
          if (selectedTemplateId === templateId) {
            setSelectedTemplateId(null);
          }
        }}
      />
    </>
  );
};

export default Modal;
