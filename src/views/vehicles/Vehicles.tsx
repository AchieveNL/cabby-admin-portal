import React, { useState } from 'react';
import { TableColumnsType, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { PendingVehiclesTable } from '@/components/tables/vehicles/PendingVehiclesTable';
import { Vehicle, VehicleStatus } from '@/api/vehicles/types';
import { ActiveVehiclesTable } from '@/components/tables/vehicles/ActiveVehiclesTable';
import { RejectedVehiclesTable } from '@/components/tables/vehicles/RejectedVehiclesTable';
import { BlockedVehiclesTable } from '@/components/tables/vehicles/BlockedVehiclesTable';
import Link from 'next/link';
import { VehiclesTab } from '@/components/tables/vehicles/VehiclesTab';

export const vehiclesColumns = (action?: any): TableColumnsType<Vehicle> => [
  {
    title: 'Company',
    dataIndex: 'companyName',
    key: 'companyName',
  },
  { title: 'Model Name', dataIndex: 'model', key: 'model' },
  { title: 'Plate Number', dataIndex: 'licensePlate', key: 'licensePlate' },
  { title: 'Year', dataIndex: 'manufactureYear', key: 'manufactureYear' },
  { title: 'Engine', dataIndex: 'engineType', key: 'engineType' },
  {
    title: 'Total Seats',
    dataIndex: 'seatingCapacity',
    key: 'seatingCapacity',
  },
  {
    title: 'Battery Capacity',
    dataIndex: 'batteryCapacity',
    key: 'batteryCapacity',
  },
  { title: 'Price Per Day', dataIndex: 'pricePerDay', key: 'pricePerDay' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  ...(!action
    ? [
        {
          title: 'Action',
          render: (value: any, record: any) => (
            <Link href={`/dashboard/vehicles/${record.id}`}>Details</Link>
          ),
        },
      ]
    : []),
];

const Vehicles = () => {
  const [currentTab, setCurrentTab] = useState('1');
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Pending',
      children: <PendingVehiclesTable />,
    },
    {
      key: '2',
      label: 'Active',
      children: <ActiveVehiclesTable />,
    },
    {
      key: '3',
      label: 'Rejected',
      children: <RejectedVehiclesTable />,
    },
    {
      key: '4',
      label: 'Blocked',
      children: <BlockedVehiclesTable />,
    },
  ];

  const onChange = (key: string) => {
    setCurrentTab(key);
  };

  const tabs: TabsProps['items'] = Object.values(VehicleStatus).map(
    (status, index) => ({
      key: (index + 1).toString(),
      label:
        status === 'PENDING'
          ? 'In behandeling'
          : status === 'ACTIVE'
          ? 'Actief'
          : status === 'REJECTED'
          ? 'Afgewezen'
          : status === 'BLOCKED'
          ? 'Geblokkeerd'
          : '',
      status,
      children: <VehiclesTab status={status} />,
    }),
  );

  return (
    <div>
      <Tabs defaultActiveKey={currentTab} items={tabs} onChange={onChange} />
    </div>
  );
};

export default Vehicles;
