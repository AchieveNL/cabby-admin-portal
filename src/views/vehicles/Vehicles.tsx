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
import { capitalizeFirstLetter } from '@/utils/text';

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

  const onChange = (key: string) => {
    setCurrentTab(key);
  };

  const tabs: TabsProps['items'] = Object.values(VehicleStatus)
    .filter((el) => ['PENDING', 'ACTIVE'].includes(el))
    .map((status, index) => {
      const label =
        status === 'PENDING'
          ? 'in behandeling'
          : status === 'ACTIVE'
          ? 'bevestigde'
          : status === 'REJECTED'
          ? 'afgewezen'
          : status === 'BLOCKED'
          ? 'geblokkeerde'
          : '';
      return {
        key: (index + 1).toString(),
        label: capitalizeFirstLetter(status === 'ACTIVE' ? 'bevestigd' : label),
        status,
        children: <VehiclesTab status={status} label={label} />,
      };
    });

  return (
    <div>
      <Tabs defaultActiveKey={currentTab} items={tabs} onChange={onChange} />
    </div>
  );
};

export default Vehicles;
