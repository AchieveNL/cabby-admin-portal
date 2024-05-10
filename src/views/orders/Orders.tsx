/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { Tabs } from 'antd';
import OrdersTable from '@/components/tables/orders/OrdersTab';

const { TabPane } = Tabs;

const Orders = () => {
  const [currentTab, setCurrentTab] = useState('1');
  const handleTabChange = (key: string) => {
    setCurrentTab(key);
  };

  return (
    <Tabs defaultActiveKey={currentTab} onChange={handleTabChange}>
      <TabPane tab="In behandeling" key="1">
        <OrdersTable status="PENDING" />
      </TabPane>
      <TabPane tab="Bevestigd" key="2">
        <OrdersTable status="CONFIRMED" />
      </TabPane>
      <TabPane tab="Geannuleerd" key="3">
        <OrdersTable status="CANCELED" />
      </TabPane>
      <TabPane tab="Afgewezen" key="4">
        <OrdersTable status="REJECTED" />
      </TabPane>
      <TabPane tab="Voltooid" key="5">
        <OrdersTable status="COMPLETED" />
      </TabPane>
      <TabPane tab="Overtijd" key="6">
        <OrdersTable status="UNPAID" />
      </TabPane>
    </Tabs>
  );
};

export default Orders;
