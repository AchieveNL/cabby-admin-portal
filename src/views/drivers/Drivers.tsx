import React from 'react';
import RejectedDriversTable from '@/components/tables/drivers/RejectedDriversTable';
import ActiveDriversTable from '@/components/tables/drivers/ActiveDriversTable';
import { Tabs, TabsProps } from 'antd';
import Link from 'next/link';
import PendingDriversTable from '@/components/tables/drivers/PendingDriversTable';
import BlockedDriversTable from '@/components/tables/drivers/BlockedDriversTable';
import Moment from 'moment';
import { DriverLicense, PermitDetails } from '@/api/orders/types';

export const driversColumns = [
  {
    title: "Driver's name",
    dataIndex: 'fullName',
    render: (text: string) => <span>{text ? text : 'Not Available'}</span>,
  },
  {
    title: 'KVK ID',
    dataIndex: 'permitDetails',
    render: (permitDetails: PermitDetails) => (
      <span>
        {permitDetails && permitDetails.kvkDocumentId
          ? permitDetails.kvkDocumentId
          : 'Not Available'}
      </span>
    ),
  },
  {
    title: 'Taxi permit',
    dataIndex: 'permitDetails',
    render: (permitDetails: PermitDetails) => (
      <span className="uppercase">
        {permitDetails && permitDetails.taxiPermitId
          ? permitDetails.taxiPermitId
          : 'Not Available'}
      </span>
    ),
  },
  {
    title: 'Kiwa taxi vergunning',
    dataIndex: 'permitDetails',
    render: (permitDetails: PermitDetails) => (
      <span className="uppercase">
        {permitDetails && permitDetails.kiwaTaxiVergunningId
          ? permitDetails.kiwaTaxiVergunningId
          : 'Not Available'}
      </span>
    ),
  },
  {
    title: 'Driving licence',
    dataIndex: 'driverLicense',
    render: (driverLicense: DriverLicense) => (
      <span>
        {driverLicense && driverLicense.bsnNumber
          ? driverLicense.bsnNumber
          : 'Not Available'}
      </span>
    ),
  },
  {
    title: 'Expired at',
    dataIndex: 'driverLicense',
    render: (driverLicense: DriverLicense) => (
      <span>
        {driverLicense && driverLicense.driverLicenseExpiry
          ? Moment(driverLicense.driverLicenseExpiry).format('DD-MM-YYYY')
          : 'Not Available'}
      </span>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
  },
  {
    title: 'Action',
    dataIndex: 'id',
    render: (id: string) => (
      <Link href={`/dashboard/drivers/${id}`}>Details</Link>
    ),
  },
];

const Drivers = () => {
  const [currentTab, setCurrentTab] = React.useState('1');
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Pending',
      children: <PendingDriversTable />,
    },
    {
      key: '2',
      label: 'Active',
      children: <ActiveDriversTable />,
    },
    {
      key: '3',
      label: 'Rejected',
      children: <RejectedDriversTable />,
    },
    {
      key: '4',
      label: 'Block',
      children: <BlockedDriversTable />,
    },
  ];

  const onChange = (key: string) => {
    setCurrentTab(key);
  };

  return (
    <Tabs defaultActiveKey={currentTab} items={items} onChange={onChange} />
  );
};

export default Drivers;
