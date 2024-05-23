/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { Tabs } from 'antd';
import OrdersTable from '@/components/tables/orders/OrdersTab';
import { OrderStatus } from '@/api/orders/types';

const { TabPane } = Tabs;
type Keys = keyof typeof OrderStatus;

const Orders = () => {
  const [currentTab, setCurrentTab] = useState('1');
  const handleTabChange = (key: string) => {
    setCurrentTab(key);
  };

  const arr: { label: string; status: Keys }[] = [
    { status: 'PENDING', label: 'In behandeling' },
    { status: 'CONFIRMED', label: 'Bevestigd' },
    { status: 'CANCELED', label: 'Geannuleerd' },
    { status: 'REJECTED', label: 'Afgewezen' },
    { status: 'COMPLETED', label: 'Voltooid' },
    { status: 'UNPAID', label: 'Overtijd' },
  ];

  return (
    <Tabs defaultActiveKey={currentTab} onChange={handleTabChange}>
      {arr.map((el, index) => (
        <TabPane tab={el.label} key={index + 1}>
          <OrdersTable label={el.label} status={el.status} />
        </TabPane>
      ))}
    </Tabs>
  );
};

export default Orders;
