import React from 'react';
import { Table, message } from 'antd';
import { vehiclesColumns } from '@/views/vehicles/Vehicles';
import {
  useUpdateVehicle,
  useUpdateVehicleStatus,
  useVehiclesByStatus,
} from '@/api/vehicles/hooks';
import { VehicleStatus } from '@/api/vehicles/types';
import Link from 'next/link';
import DefaultModal from '@/components/modals/DefautlModal';
import { ReloadOutlined } from '@ant-design/icons';
import { UserProfileStatus } from '@/api/drivers/types';

export const RejectedVehiclesTable = () => {
  const { data: vehicles, isLoading } = useVehiclesByStatus(
    VehicleStatus.REJECTED,
  );

  const { mutateAsync: updateStatus } = useUpdateVehicleStatus();

  const columns = [
    ...vehiclesColumns(true),
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => (
        <div className="flex gap-2 items-center">
          {true && (
            <DefaultModal
              title="Wil je zeker dat je deze bestuurder wilt deblokeren?"
              button={
                <button className="flex items-center gap-1 text-success-base">
                  <ReloadOutlined rev={undefined} /> herstellen
                </button>
              }
              confirmPlaceholder="Verder"
              fn={async () => {
                await updateStatus({
                  id: record.id,
                  status: VehicleStatus.PENDING,
                });
                message.success('Driver on pending successfully');
              }}
            >
              Zodra je verdergaat, wordt de bestuurder gedeblokkeerd en kan
              diegene de app weer gebruiken.
            </DefaultModal>
          )}
          <Link href={`/dashboard/drivers/${record.id}`}>Details</Link>
        </div>
      ),
    },
  ];

  return (
    <div className="px-6">
      <div className="flex items-end flex-wrap gap-4 mb-5">
        <div className="mr-auto">
          <h4 className="mb-1 capitalize text-neutral-100 font-bold text-xl sm:text-2xl">
            Rejected Vehicles
          </h4>
          <h6 className="font-medium text-base text-neutral-50">
            Total {vehicles?.length} rejected vehicles
          </h6>
        </div>
      </div>
      <Table columns={columns} dataSource={vehicles} loading={isLoading} />
    </div>
  );
};
