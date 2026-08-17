import React from 'react';

import { CheckCircleFilled, CloseCircleFilled, LoadingOutlined } from '@ant-design/icons';

import { __ } from '@wordpress/i18n';

export type ApplyStatus = 'pending' | 'loading' | 'success' | 'error';

export interface ApplyResult {
  templateTitle: string;
  status: ApplyStatus;
  error?: string;
}

interface Step5Props {
  results: ApplyResult[];
}

const Finish: React.FC<Step5Props> = ({ results }) => {
  const successCount = results.filter((r) => r.status === 'success').length;
  const errorCount = results.filter((r) => r.status === 'error').length;
  const isAllDone = results.every((r) => r.status === 'success' || r.status === 'error');

  return (
    <div className="yaymail-bulk-import__step5">
      {isAllDone && (
        <div
          className={`yaymail-bulk-import__step5-summary ${
            errorCount > 0 ? 'has-errors' : 'all-success'
          }`}
        >
          {errorCount === 0 ? (
            <>
              <CheckCircleFilled className="yaymail-bulk-import__step5-summary-icon success" />
              <span>
                {__('Applied successfully to', 'yaymail')} {successCount}{' '}
                {__('email types.', 'yaymail')}
              </span>
            </>
          ) : (
            <>
              <span>
                ✅ {successCount} {__('succeeded', 'yaymail')}, ❌ {errorCount}{' '}
                {__('failed.', 'yaymail')}
              </span>
            </>
          )}
        </div>
      )}

      <div className="yaymail-bulk-import__step5-list">
        {results.map((result, idx) => (
          <div key={idx} className="yaymail-bulk-import__step5-item">
            <span className="yaymail-bulk-import__step5-item-title">{result.templateTitle}</span>
            <span className="yaymail-bulk-import__step5-item-status">
              {result.status === 'loading' && (
                <LoadingOutlined className="yaymail-bulk-import__step5-icon loading" />
              )}
              {result.status === 'success' && (
                <CheckCircleFilled className="yaymail-bulk-import__step5-icon success" />
              )}
              {result.status === 'error' && (
                <CloseCircleFilled
                  className="yaymail-bulk-import__step5-icon error"
                  title={result.error}
                />
              )}
              {result.status === 'pending' && (
                <span className="yaymail-bulk-import__step5-icon pending">—</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Finish;
