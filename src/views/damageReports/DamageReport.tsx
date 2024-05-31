import React, { useState } from 'react';
import OpenDamageReports from './OpenDamageReports';
import ClosedDamageReports from './ClosedDamageReports';
import { Tabs } from 'antd';
import { formatDate } from '@/utils/utils';

const { TabPane } = Tabs;

export const damageReportColumns = [
  {
    title: 'Gerapporteerd op',
    dataIndex: 'reportedAt',
    key: 'reportedAt',
    render: (date: string) => formatDate(date),
  },
  {
    title: 'Omschrijving',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Prijs',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: 'Gerepareerd bij',
    dataIndex: 'repairedAt',
    key: 'repairedAt',
    render: (date: string) => (date ? formatDate(date) : 'N/A'),
  },
  {
    title: 'Gebruiker',
    dataIndex: 'user',
    key: 'user',
    render: (user: any) => user.profile?.fullName || 'N/A',
  },
  {
    title: 'Auto',
    dataIndex: 'vehicle',
    key: 'vehicle',
    render: (vehicle: any) => `${vehicle.model} (${vehicle.companyName})`,
  },
];

const DamageReports = () => {
  const [activeTab, setActiveTab] = useState('1');

  const onChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <Tabs defaultActiveKey={activeTab} onChange={onChange}>
      <TabPane tab="Open schaderapporten" key="1">
        <OpenDamageReports />
      </TabPane>
      <TabPane tab="Gesloten schaderapporten" key="2">
        <ClosedDamageReports />
      </TabPane>
    </Tabs>
  );
};

export default DamageReports;
