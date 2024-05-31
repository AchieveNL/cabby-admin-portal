/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { Tabs } from 'antd';
import OrdersTable from '@/components/tables/orders/OrdersTab';
import { OrderStatus } from '@/api/orders/types';
import { capitalizeFirstLetter } from '@/utils/text';

const { TabPane } = Tabs;
type Keys = keyof typeof OrderStatus;

const Orders = () => {
  const [currentTab, setCurrentTab] = useState('1');
  const handleTabChange = (key: string) => {
    setCurrentTab(key);
  };

  const arr: { label: string; status: Keys }[] = [
    { status: 'PENDING', label: 'in behandeling' },
    { status: 'CONFIRMED', label: 'bevestigde' },
    { status: 'CANCELED', label: 'geannuleerd' },
    { status: 'REJECTED', label: 'afgewezen' },
    { status: 'COMPLETED', label: 'voltooid' },
    { status: 'UNPAID', label: 'overtijd' },
  ];

  return (
    <Tabs defaultActiveKey={currentTab} onChange={handleTabChange}>
      {arr.map((el, index) => (
        <TabPane tab={capitalizeFirstLetter(el.label)} key={index + 1}>
          <OrdersTable label={el.label} status={el.status} />
        </TabPane>
      ))}
    </Tabs>
  );
};

export default Orders;
