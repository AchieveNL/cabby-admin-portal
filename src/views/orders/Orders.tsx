/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { TableColumnsType, Tabs } from 'antd';
import ActiveOrdersTab from '../../components/tables/orders/ActiveOrdersTab';
import { Order, UserProfile } from '@/api/orders/types';
import { currencyFormatter } from '@/common/utits';
import dayjs from 'dayjs';
import Countdown from '@/components/CountDown/Countdown';
import Link from 'next/link';
import PendingOrdersTable from '@/components/tables/orders/PendingOrdersTab';
import CompletedOrdersTab from '@/components/tables/orders/CompletedOrdersTab';
import CanceledOrdersTab from '@/components/tables/orders/CanceledOrdersTab';
import { Vehicle } from '@/api/vehicles/types';
import RejectedOrdersTab from '@/components/tables/orders/RejectedOrdersTab';

export const getOrderColumns = (action?: boolean): TableColumnsType<Order> => [
  {
    title: 'Driver',
    dataIndex: 'user',
    key: 'user',
    className: 'table-bg-primary',
    render: (user: { profile: UserProfile }) => <a>{user.profile.fullName}</a>,
  },
  {
    title: 'Vehicle',
    dataIndex: 'vehicle',
    className: 'table-bg-primary',
    key: 'vehicle',
    render: (vehicle: Vehicle) => (
      <div>
        <div>
          <img src={vehicle.images?.[0]} alt={vehicle.companyName} />
        </div>
        <div>{vehicle.companyName}</div>
      </div>
    ),
  },
  {
    title: 'Rental Period',
    dataIndex: 'rentalStartDate',
    className: 'table-bg-primary',
    key: 'rentalStartDate',
    render: (value: string, row: Order) => (
      <>
        <div>
          From: {dayjs(row.rentalStartDate).format('DD/MM/YYYY • hh:mm')}
        </div>
        <div>to: {dayjs(row.rentalEndDate).format('DD/MM/YYYY • hh:mm')}</div>
      </>
    ),
  },
  {
    title: 'Price',
    dataIndex: 'totalAmount',
    className: 'table-bg-primary',
    key: 'totalAmount',
    render: (value: number) => currencyFormatter.format(value),
  },
  {
    title: 'Countdown',
    dataIndex: 'rentalStartDate',
    className: 'table-bg-primary',
    key: 'countdown',
    render: (value: string) => <Countdown targetDate={value} />,
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    className: 'table-bg-primary',
    render: (date: string) => dayjs(date).format('DD/MM/YYYY • hh:mm'),
  },
  {
    title: 'Note',
    dataIndex: 'note',
    key: 'note',
    className: 'table-bg-primary',
    render: (note?: string) => note || 'N/A',
  },
  ...(!action
    ? [
        {
          title: 'Action',
          render: (value: any, record: Order) => (
            <Link href={`/dashboard/orders/${record.id}`}>Details</Link>
          ),
        },
      ]
    : []),
];

const { TabPane } = Tabs;

const Orders = () => {
  const [currentTab, setCurrentTab] = useState('1');
  const handleTabChange = (key: string) => {
    setCurrentTab(key);
  };

  return (
    <Tabs defaultActiveKey={currentTab} onChange={handleTabChange}>
      <TabPane tab="Pending" key="1">
        <PendingOrdersTable />
      </TabPane>
      <TabPane tab="Active" key="2">
        <ActiveOrdersTab />
      </TabPane>
      <TabPane tab="Completed" key="3">
        <CompletedOrdersTab />
      </TabPane>
      <TabPane tab="Rejected" key="4">
        <RejectedOrdersTab />
      </TabPane>
      <TabPane tab="Cancelation Request" key="5">
        <CanceledOrdersTab />
      </TabPane>
    </Tabs>
  );
};

export default Orders;
