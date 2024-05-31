import React from 'react';
import RejectedDriversTable from '@/components/tables/drivers/DriversTab';
import ActiveDriversTable from '@/components/tables/drivers/ActiveDriversTable';
import { Modal, Tabs, TabsProps, message } from 'antd';
import Link from 'next/link';
import PendingDriversTable from '@/components/tables/drivers/PendingDriversTable';
import BlockedDriversTable from '@/components/tables/drivers/BlockedDriversTable';
import { DriverLicense, PermitDetails } from '@/api/orders/types';
import { ReloadOutlined } from '@ant-design/icons';
import DeleteModal from '@/components/modals/DeleteModal';
import DefaultModal from '@/components/modals/DefautlModal';
import { UserProfileStatus } from '@/api/drivers/types';
import DriversTab from '@/components/tables/drivers/DriversTab';
import dayjs from 'dayjs';
import { capitalizeFirstLetter } from '@/utils/text';

export const driversColumns = ({
  showChangeStatus,
  changeStatus,
  refresh,
}: {
  showChangeStatus?: boolean;
  refresh?: () => void;
  changeStatus?: (
    id: string,
    status: UserProfileStatus,
    reason?: string | undefined,
  ) => Promise<void>;
}) => [
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
          ? dayjs(driverLicense.driverLicenseExpiry).format('DD-MM-YYYY')
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
    render: (id: string) => {
      return (
        <div className="flex gap-2 items-center">
          {showChangeStatus && changeStatus && (
            <DefaultModal
              title="Wil je zeker dat je deze bestuurder wilt deblokeren?"
              button={
                <button className="flex items-center gap-1 text-success-base">
                  <ReloadOutlined rev={undefined} /> herstellen
                </button>
              }
              confirmPlaceholder="Verder"
              fn={async () => {
                await changeStatus(id, UserProfileStatus.PENDING);
                message.success('Driver on pending successfully');
              }}
            >
              Zodra je verdergaat, wordt de bestuurder gedeblokkeerd en kan
              diegene de app weer gebruiken.
            </DefaultModal>
          )}
          <Link href={`/dashboard/drivers/${id}`}>Details</Link>
        </div>
      );
    },
  },
];

const Drivers = () => {
  const [currentTab, setCurrentTab] = React.useState('1');
  // const items: TabsProps['items'] = [
  //   {
  //     key: '1',
  //     label: 'Pending',
  //     children: <PendingDriversTable />,
  //   },
  //   {
  //     key: '2',
  //     label: 'Active',
  //     children: <ActiveDriversTable />,
  //   },
  //   {
  //     key: '3',
  //     label: 'Rejected',
  //     children: <RejectedDriversTable />,
  //   },
  //   {
  //     key: '4',
  //     label: 'Block',
  //     children: <BlockedDriversTable />,
  //   },
  // ];

  const onChange = (key: string) => {
    setCurrentTab(key);
  };

  const tabs: TabsProps['items'] = Object.values(UserProfileStatus)
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
          : status;

      return {
        key: (index + 2).toString(),
        label: capitalizeFirstLetter(label),
        status,
        children: <DriversTab status={status} label={label} />,
      };
    })
    .filter((el) => !['INACTIVE'].some((status) => status === el.status));

  const newTabs = [
    // {
    //   children: <PendingDriversTable />,
    //   key: '1',
    //   label: 'In behandeling',
    //   status: 'PENDING',
    // },
    ...tabs,
  ];

  return (
    <Tabs defaultActiveKey={currentTab} items={newTabs} onChange={onChange} />
  );
};

export default Drivers;
