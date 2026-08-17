import { useMemo, useState } from 'react';

import { HistoryOutlined } from '@ant-design/icons';
import { Button, Empty, Spin } from 'antd';

import Modal from '@src/features/email-customizer/components/sidebar/tab-content-for-revisions/Modal';

import useRevisionQueries from '@src/hooks/queries/useRevisionQueries';

import { RevisionType } from '@src/common/api/types';
import useCustomizerPageStore from '@src/stores/customizerPage';
import useTemplateContentStore from '@src/stores/templateContent';
import { pushChangeToHistory } from '@src/stores/templateContentHistory';
import { relativeTime } from '@src/utils';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import moment from 'moment';

import './index.scss';

const TabContentForRevisions = () => {
  const selectedTemplate = useCustomizerPageStore((state) => state.currentTemplate);

  const updateList = useTemplateContentStore((state) => state.updateList);

  const { data, isLoading } = useRevisionQueries({
    template_name: selectedTemplate,
    fetch: false,
  });
  console.log('data', data);
  const filteredData = useMemo(
    () => data?.filter((revision) => revision.template_elements),
    [data],
  );
  console.log('filteredData', filteredData);
  const [selectedRevision, selectRevision] = useState<string | null>(null);
  const changeRevision = (revision: RevisionType) => {
    const { revision_id, template_elements } = revision;
    if (revision_id === selectedRevision) return;
    if (template_elements) {
      updateList(template_elements);
      pushChangeToHistory({ action: 'edited', customMessage: `Back to revision #${revision_id}` });
      selectRevision(revision_id);
    }
  };

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <section className="yaymail-tab-revisions">
        {(filteredData?.length ?? 0) > 0 ? (
          <div className="yaymail-tab-revisions__btn-clear">
            <Button type="primary" onClick={handleOpenModal} className="yaymail-btn--light">
              Clear all
            </Button>
          </div>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="yaymail-tab-revisions__empty"
            description={__('You have no revision', 'yaymail')}
          />
        )}
        <div className="yaymail-list-revisions">
          {isLoading ? (
            <div style={{ textAlign: 'center', marginTop: '20vh' }}>
              <Spin />
            </div>
          ) : (
            filteredData?.map((revisionItem) => {
              const { revision_id, modified_by, modified_at, template_elements } = revisionItem;
              return (
                <div
                  className={classNames(
                    'yaymail-list-revisions__item',
                    revision_id === selectedRevision && 'yaymail-list-revisions__item__active',
                  )}
                  key={revision_id}
                  onClick={() => changeRevision(revisionItem)}
                >
                  <div>
                    <div>
                      <span className="yaymail-list-revisions__item__bold">
                        {relativeTime(modified_at)} &nbsp;
                      </span>
                      <span className="yaymail-list-revisions__item__lighter">
                        ({moment(modified_at).format('lll')})
                      </span>
                    </div>
                    <p style={{ margin: 0 }} className="yaymail-list-revisions__item__lighter">
                      <span className="yaymail-list-revisions__item__bold">
                        #{revision_id} &nbsp;
                      </span>
                      saved by
                      <span className="yaymail-list-revisions__item__bold">
                        &nbsp;{modified_by || 'Unknown'}
                      </span>
                    </p>
                  </div>
                  <HistoryOutlined />
                </div>
              );
            })
          )}
        </div>
      </section>
      <Modal isOpen={modalOpen} onOpen={handleOpenModal} onClose={handleCloseModal} />
    </>
  );
};

export default TabContentForRevisions;
