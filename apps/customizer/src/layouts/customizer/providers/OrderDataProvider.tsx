import { createContext, memo, ReactNode, useMemo, useState } from 'react';

interface IOrderDataProviderProps {
  children: ReactNode;
}

interface IOrder {
  id: string;
  order_number: string;
  email: string | '';
  first_name: string | '';
  last_name: string | '';
  title: string;
}

interface IOrderDataContext {
  selectedOrderID: string;
  // eslint-disable-next-line no-unused-vars
  setSelectedOrderID: (orderID: string) => void;
  listOrders: IOrder[];
}

export const OrderDataContext = createContext<IOrderDataContext>({} as IOrderDataContext);

const listOrders = window.yaymailData.list_orders;

function OrderDataProviderContent(props: IOrderDataProviderProps) {
  const [selectedOrderID, setSelectedOrderID] = useState<IOrderDataContext['selectedOrderID']>(
    listOrders[0]?.id ?? null,
  );
  const orderDataContextValue = useMemo(
    () => ({ selectedOrderID, setSelectedOrderID, listOrders }),
    [selectedOrderID, setSelectedOrderID],
  );
  return (
    <OrderDataContext.Provider value={orderDataContextValue}>
      {props.children}
    </OrderDataContext.Provider>
  );
}

const OrderDataProvider = memo(OrderDataProviderContent);

export default OrderDataProvider;
