import React from 'react';
import { Table, message } from 'antd';
import { Driver, DriverStatus, UserProfileStatus } from '@/api/drivers/types';
import { useDriversByStatus, useUpdateDriverStatus } from '@/api/drivers/hooks';
import { DriverLicense, PermitDetails } from '@/api/orders/types';
import DefaultModal from '@/components/modals/DefautlModal';
import { ReloadOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { deleteDriver, updateDriverStatus } from '@/api/drivers/drivers';
import DeleteIcon from '@/components/icons/DeleteIcon';
import dayjs from 'dayjs';

const driversColumns = ({ status }: { status: DriverStatus }) => {
  return [
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
      render: (id: string, record: Driver) => {
        const userId = record.userId;
        return (
          <div className="flex gap-2 items-center">
            <Link href={`/dashboard/drivers/${id}`}>Details</Link>
            {['REJECTED', 'BLOCKED'].includes(status) && (
              <DefaultModal
                title="Wil je zeker dat je deze bestuurder wilt deblokeren?"
                button={
                  <button className="flex items-center gap-1 text-success-base">
                    <ReloadOutlined rev={undefined} /> herstellen
                  </button>
                }
                confirmPlaceholder="Verder"
                fn={async () => {
                  await updateDriverStatus(id, UserProfileStatus.PENDING);
                  message.success('Driver on pending successfully');
                }}
              >
                Zodra je verdergaat, wordt de bestuurder gedeblokkeerd en kan
                diegene de app weer gebruiken.
              </DefaultModal>
            )}
            {['REJECTED', 'BLOCKED'].includes(status) && (
              <DefaultModal
                title="Wil je zeker dat je deze bestuurder wilt verwijderen?"
                button={
                  <button className="flex items-center gap-1 text-danger-base">
                    <DeleteIcon /> verwijderen
                  </button>
                }
                confirmPlaceholder="Verder"
                fn={async () => {
                  await deleteDriver(userId);
                  message.success('Driver deleted successfully!');
                }}
              >
                {/* Zodra je verdergaat, wordt de bestuurder gedeblokkeerd en kan
                diegene de app weer gebruiken. */}
              </DefaultModal>
            )}
          </div>
        );
      },
    },
  ];
};

interface Props {
  status: DriverStatus;
}

const DriversTab = ({ status }: Props) => {
  const { data: drivers, isFetching } = useDriversByStatus(status);

  if (isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-6">
      <div className="flex items-end flex-wrap gap-4 mb-5">
        <div className="mr-auto">
          <h4 className="mb-1 text-neutral-100 font-bold text-xl sm:text-2xl">
            {status} drivers
          </h4>
          <h6 className="font-medium text-base text-neutral-50">
            Total {drivers?.length} {status} drivers
          </h6>
        </div>
      </div>
      <Table
        dataSource={drivers}
        columns={driversColumns({
          status,
        })}
      />
    </div>
  );
};

export default DriversTab;
