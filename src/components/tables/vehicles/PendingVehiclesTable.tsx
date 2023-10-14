import React from 'react';
import Link from 'next/link';
import { Button, Table } from 'antd';
import { vehiclesColumns } from '@/views/vehicles/Vehicles';
import { useVehiclesByStatus } from '@/api/vehicles/hooks';
import { VehicleStatus } from '@/api/vehicles/types';
import {
  saveVehicleRejection,
  updateVehicleStatus,
} from '@/api/vehicles/vehicles';
import ActionButtons from '@/components/ActionButtons/ActionButtons';
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

export const PendingVehiclesTable = () => {
  const router = useRouter();
  const { data: vehicles, loading } = useVehiclesByStatus(
    VehicleStatus.PENDING,
  );

  const handleApprove = async (vehicleId: string) => {
    await updateVehicleStatus(vehicleId, VehicleStatus.ACTIVE);
  };

  const handleReject = async (vehicleId: string) => {
    await updateVehicleStatus(vehicleId, VehicleStatus.REJECTED);
  };

  const onSubmitRejectReason = async (id: string, reason: string) => {
    await saveVehicleRejection(id, reason);
  };

  const columns = [
    ...vehiclesColumns(true),
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => (
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/vehicles/${record.id}`}>Details</Link>
          <ActionButtons
            onApprove={handleApprove}
            onRejectReason={onSubmitRejectReason}
            onReject={handleReject}
            recordId={record.id}
            confirmationMessage="Are you sure you want to reject this vehicle?"
          />
        </div>
      ),
    },
  ];

  const onCreateNewVehicle = () => {
    router.push('/dashboard/vehicles/create-vehicle');
  };

  return (
    <div className="px-6">
      <div className="flex items-end flex-wrap gap-4 mb-5">
        <div className="mr-auto">
          <h4 className="mb-1 capitalize text-neutral-100 font-bold text-xl sm:text-2xl">
            Pending Vehicles
          </h4>
          <h6 className="font-medium text-base text-neutral-50">
            Total {vehicles?.length} opending vehicles
          </h6>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined rev={undefined} />}
          onClick={onCreateNewVehicle}
        >
          Create New Vehicle
        </Button>
      </div>
      <Table columns={columns} dataSource={vehicles} loading={loading} />
    </div>
  );
};
