import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { ComponentChildren } from '@src/types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 60 * 1000,
    },
  },
});
const CustomQueryClientProvider = (props: {
  children: ComponentChildren;
  enableDevtools?: boolean;
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
      {props.enableDevtools && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

export default CustomQueryClientProvider;
