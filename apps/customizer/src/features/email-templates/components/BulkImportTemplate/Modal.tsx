import React, { useMemo, useRef, useState } from 'react';

import { Button, Modal as AntModal, Select } from 'antd';

import { ModalFooter, ModalHeader } from '@src/components/modal-header-footer';
import CMContentMapping, {
  ContentMappingRef,
} from '@src/features/email-customizer/components/header/TemplateLibrary/ContentMapping';
import type { PreviewDeviceType } from '@src/features/email-customizer/components/header/TemplateLibrary/ContentMapping/PreviewStep';

import { useTemplateLibraryList } from '@src/hooks/queries/useTemplateLibraryQueries';

import { getTemplateByName, updateTemplate } from '@src/common/api/templateApi';
import { IElement } from '@src/features/email-customizer/type';
import { removeIconFromElements } from '@src/features/email-customizer/utils';
import { ITemplate } from '@src/features/email-templates';
import DeviceSwitcher from '@src/features/preview-email/device-switcher';
import useCustomizerPageStore from '@src/stores/customizerPage';
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';

import ChooseEmailTypes from './steps/ChooseEmailTypes';
import ChooseTemplate from './steps/ChooseTemplate';
import Finish, { ApplyResult } from './steps/Finish';
import Preview from './steps/Preview';

import './index.scss';
import styles from '@src/components/modal-header-footer/styles.module.scss';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedTemplateNames?: string[];
  skipEmailTypes?: boolean;
}

type BulkStep = 'select' | 'email-types' | 'mapping' | 'preview' | 'finish';

const getStepTitle = (step: BulkStep): string => {
  const titles: Record<BulkStep, string> = {
    select: __('Choose a Template', 'yaymail'),
    'email-types': __('Choose Email Types', 'yaymail'),
    mapping: __('Map Your Content', 'yaymail'),
    preview: __('Preview', 'yaymail'),
    finish: __('Done', 'yaymail'),
  };
  return titles[step];
};

const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  preSelectedTemplateNames,
  skipEmailTypes,
}) => {
  const allTemplates = useCustomizerPageStore((state) => state.templates);
  const currentTemplate = useCustomizerPageStore((state) => state.currentTemplate);
  const updateTemplateData = useCustomizerPageStore((state) => state.updateTemplateData);
  const templateData = useCustomizerPageStore((state) => state.templateData);
  const setCustomizerContent = useTemplateContentStore((state) => state.updateList);
  const changeContentStatus = useTemplateContentStore((state) => state.changeContentStatus);

  const { data: preDesignedTemplates = [], isLoading } = useTemplateLibraryList({
    email_type: 'all',
    isEnabled: isOpen,
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedTemplateNames, setSelectedTemplateNames] = useState<string[]>(
    preSelectedTemplateNames ?? [],
  );
  const [step, setStep] = useState<BulkStep>('select');
  const [activeEmailIdx, setActiveEmailIdx] = useState(0);
  const [previewEmailIdx, setPreviewEmailIdx] = useState(0);
  const [previewDevice, setPreviewDevice] = useState<PreviewDeviceType>('desktop');
  const [applyResults, setApplyResults] = useState<ApplyResult[]>([]);
  const [isLoadingMapping, setIsLoadingMapping] = useState(false);
  const [reviewedEmailIndices, setReviewedEmailIndices] = useState<Set<number>>(new Set());

  // Full template data fetched when entering the mapping step
  const [mappingTemplates, setMappingTemplates] = useState<ITemplate[]>([]);

  // One ref per email type — used to call getFinalElements() on each ContentMapping instance
  const contentMappingRefs = useRef<(ContentMappingRef | null)[]>([]);

  const selectedDesign = useMemo(
    () => preDesignedTemplates.find((t) => t.id === selectedTemplateId) ?? null,
    [preDesignedTemplates, selectedTemplateId],
  );

  const selectedTemplates = useMemo(
    () => allTemplates.filter((t) => selectedTemplateNames.includes(t.name)),
    [allTemplates, selectedTemplateNames],
  );

  const dropdownOptions = useMemo(
    () =>
      mappingTemplates.map((template, idx) => ({
        value: idx,
        label: reviewedEmailIndices.has(idx)
          ? `✅ ${template.template_title}`
          : `⚠️ ${template.template_title}`,
      })),
    [mappingTemplates, reviewedEmailIndices],
  );

  const goToMapping = async () => {
    setIsLoadingMapping(true);
    try {
      const fullTemplates = await Promise.all(
        selectedTemplates.map(async (t) => {
          const res = await getTemplateByName(t.name);
          return { ...t, elements: (res.data?.elements ?? t.elements) as IElement[] };
        }),
      );
      contentMappingRefs.current = new Array(fullTemplates.length).fill(null);
      setMappingTemplates(fullTemplates);
    } finally {
      setIsLoadingMapping(false);
    }
    setActiveEmailIdx(0);
    setReviewedEmailIndices(new Set([0]));
    setStep('mapping');
  };

  const resetState = () => {
    setSelectedTemplateId(null);
    setSelectedTemplateNames(preSelectedTemplateNames ?? []);
    setStep('select');
    setActiveEmailIdx(0);
    setPreviewEmailIdx(0);
    setApplyResults([]);
    setMappingTemplates([]);
    contentMappingRefs.current = [];
    setReviewedEmailIndices(new Set());
    setPreviewDevice('desktop');
  };

  const handleCancel = () => {
    resetState();
    onClose();
  };

  const toggleEmailType = (name: string) => {
    setSelectedTemplateNames((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  };
  const selectAll = () => setSelectedTemplateNames(allTemplates.map((t) => t.name));
  const deselectAll = () => setSelectedTemplateNames([]);

  const markReviewed = (idx: number) => {
    setReviewedEmailIndices((prev) => {
      if (prev.has(idx)) return prev;
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
  };

  const getFinalElements = (idx: number): IElement[] =>
    contentMappingRefs.current[idx]?.getFinalElements() ?? [];

  const handleApplyAll = async () => {
    const initialResults: ApplyResult[] = mappingTemplates.map((t) => ({
      templateTitle: t.template_title,
      status: 'loading',
    }));
    setApplyResults(initialResults);
    setStep('finish');

    await Promise.allSettled(
      mappingTemplates.map(async (template, idx) => {
        try {
          const cleaned = removeIconFromElements(getFinalElements(idx));

          await updateTemplate({
            template_id: template.id,
            template_elements: cleaned,
            background_color: template.background_color,
            text_link_color: template.text_link_color,
            content_background_color: template.content_background_color,
            content_text_color: template.content_text_color,
            title_color: template.title_color,
            global_header_settings: template.global_header_settings,
            global_footer_settings: template.global_footer_settings,
          });

          if (template.name === currentTemplate) {
            setCustomizerContent(cleaned);
            updateTemplateData({ ...templateData, ...template, elements: cleaned } as any);
            changeContentStatus(true);
          }

          setApplyResults((prev) =>
            prev.map((r, i) => (i === idx ? { ...r, status: 'success' } : r)),
          );
        } catch (err: any) {
          setApplyResults((prev) =>
            prev.map((r, i) =>
              i === idx ? { ...r, status: 'error', error: err?.message ?? 'Unknown error' } : r,
            ),
          );
        }
      }),
    );
  };

  const renderFooter = () => {
    if (step === 'select') {
      return (
        <ModalFooter
          onOk={() => (skipEmailTypes ? goToMapping() : setStep('email-types'))}
          onCancel={handleCancel}
          okText={isLoadingMapping ? __('Loading…', 'yaymail') : __('Next →', 'yaymail')}
          isButtonOkDisabled={
            !selectedTemplateId || selectedDesign?.available === false || isLoadingMapping
          }
        />
      );
    }
    if (step === 'email-types') {
      return (
        <div className="modal__footer">
          <Button
            type="primary"
            onClick={goToMapping}
            disabled={selectedTemplateNames.length === 0 || isLoadingMapping}
            loading={isLoadingMapping}
          >
            {__('Next →', 'yaymail')}
          </Button>
          <Button onClick={() => setStep('select')}>{__('← Back', 'yaymail')}</Button>
          <Button onClick={handleCancel}>{__('Cancel', 'yaymail')}</Button>
        </div>
      );
    }
    if (step === 'mapping') {
      return (
        <div className="modal__footer">
          <Button
            type="primary"
            onClick={() => {
              setPreviewEmailIdx(0);
              setPreviewDevice('desktop');
              setStep('preview');
            }}
          >
            {__('Next →', 'yaymail')}
          </Button>
          <Button onClick={() => setStep(skipEmailTypes ? 'select' : 'email-types')}>
            {__('← Back', 'yaymail')}
          </Button>
          <Button onClick={handleCancel}>{__('Cancel', 'yaymail')}</Button>
        </div>
      );
    }
    if (step === 'preview') {
      return (
        <div className="modal__footer">
          <Button type="primary" onClick={handleApplyAll}>
            {__('Apply All', 'yaymail')}
          </Button>
          <Button
            onClick={() => {
              setPreviewDevice('desktop');
              setActiveEmailIdx(previewEmailIdx);
              setStep('mapping');
            }}
          >
            {__('← Back', 'yaymail')}
          </Button>
          <Button onClick={handleCancel}>{__('Cancel', 'yaymail')}</Button>
        </div>
      );
    }
    if (step === 'finish') {
      const isDone = applyResults.every((r) => r.status === 'success' || r.status === 'error');
      return (
        <div className="modal__footer">
          <Button type="primary" onClick={handleCancel} disabled={!isDone}>
            {__('Close', 'yaymail')}
          </Button>
        </div>
      );
    }
    return null;
  };

  return (
    <AntModal
      title={
        <ModalHeader
          content={
            step === 'preview' ? (
              <>
                <div className="yaymail-template-library__header-content">
                  <h4 className="yaymail-template-library__header-content-title">
                    {getStepTitle('preview')}
                  </h4>
                  {selectedDesign && (
                    <p className="yaymail-template-library__header-template-title">
                      <span className="yaymail-template-library__header-template-title-dot-icon" />
                      {selectedDesign.name}
                    </p>
                  )}
                </div>
                <div className={styles['modal-header-right']}>
                  <DeviceSwitcher onChange={setPreviewDevice} currentDevice={previewDevice} />
                </div>
              </>
            ) : (
              <div className="yaymail-template-library__header-content">
                <h4 className="yaymail-template-library__header-content-title">
                  {getStepTitle(step)}
                </h4>
                {selectedDesign && step !== 'select' && (
                  <p className="yaymail-template-library__header-template-title">
                    <span className="yaymail-template-library__header-template-title-dot-icon" />
                    {selectedDesign.name}
                  </p>
                )}
              </div>
            )
          }
        />
      }
      wrapClassName="yaymail-bulk-import__modal-wrap"
      className={`yaymail-global__modal yaymail-template-library__modal yaymail-bulk-import__modal${
        step === 'preview' ? ' yaymail-template-library__modal--fixed-body' : ''
      }`}
      open={isOpen}
      onCancel={handleCancel}
      centered
      width={step === 'preview' ? '85%' : '70%'}
      footer={renderFooter()}
    >
      {step === 'select' && (
        <>
          <p className="modal__content yaymail-template-library__description">
            {__('Select a template design to apply across multiple email types.', 'yaymail')}
          </p>
          <ChooseTemplate
            templates={preDesignedTemplates}
            isLoading={isLoading}
            selectedTemplateId={selectedTemplateId}
            onSelect={setSelectedTemplateId}
          />
        </>
      )}

      {step === 'email-types' && (
        <ChooseEmailTypes
          templates={allTemplates}
          selectedNames={selectedTemplateNames}
          templateTitle={selectedDesign?.name ?? ''}
          onToggle={toggleEmailType}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
        />
      )}

      {/* Mapping step: keep all instances mounted (CSS show/hide) to preserve per-email state */}
      {(step === 'mapping' || step === 'preview') && mappingTemplates.length > 0 && (
        <div style={{ display: step === 'mapping' ? undefined : 'none' }}>
          <div className="yaymail-bulk-import__step3-switcher">
            <span className="yaymail-bulk-import__step3-switcher-label">
              {__('Email:', 'yaymail')}
            </span>
            <Select
              value={activeEmailIdx}
              onChange={(idx) => {
                markReviewed(idx);
                setActiveEmailIdx(idx);
              }}
              options={dropdownOptions}
              style={{ minWidth: 260 }}
            />
          </div>

          {mappingTemplates.map((template, idx) => (
            <div
              key={template.name}
              style={{ display: activeEmailIdx === idx ? undefined : 'none' }}
            >
              <CMContentMapping
                ref={(el) => {
                  contentMappingRefs.current[idx] = el;
                }}
                newTemplate={selectedDesign?.elements ?? []}
                oldElements={(template.elements ?? []) as IElement[]}
                newTemplateName={selectedDesign?.name ?? ''}
                oldTemplateName={template.template_title}
              />
            </div>
          ))}
        </div>
      )}

      {step === 'preview' && (
        <div className="yaymail-template-library__mapping-preview-wrap">
          <Preview
            templates={mappingTemplates}
            previewEmailIdx={previewEmailIdx}
            onSelectEmail={setPreviewEmailIdx}
            getFinalElements={getFinalElements}
            reviewedEmailIndices={reviewedEmailIndices}
            device={previewDevice}
            onDeviceChange={setPreviewDevice}
          />
        </div>
      )}

      {step === 'finish' && <Finish results={applyResults} />}
    </AntModal>
  );
};

export default BulkImportModal;
