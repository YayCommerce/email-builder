/* eslint-disable no-unused-vars */
import { ComponentType, memo } from 'react';

import { compareObjects } from '@src/utils';

const withMemo = <P,>(
  WrappedComponent: ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean,
) => memo(WrappedComponent, areEqual ?? compareObjects);

export default withMemo;
