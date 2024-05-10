import React from 'react';
import Link from 'next/link';
import { Button, Space, Table, TableColumnsType, message } from 'antd';
import {
  useUpdateVehicleStatus,
  useVehiclesByStatus,
} from '@/api/vehicles/hooks';
import { Vehicle, VehicleStatus } from '@/api/vehicles/types';
import {
  deleteVehicle,
  saveVehicleRejection,
  updateVehicleStatus,
} from '@/api/vehicles/vehicles';
import ActionButtons from '@/components/ActionButtons/ActionButtons';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import DefaultModal from '@/components/modals/DefautlModal';
import DeleteIcon from '@/components/icons/DeleteIcon';

export type VehicleStatusType = keyof typeof VehicleStatus;

const useColumns = ({
  status,
}: {
  status?: VehicleStatusType;
}): TableColumnsType<Vehicle> => {
  const { mutateAsync: updateStatus } = useUpdateVehicleStatus();
  const handleApprove = async (vehicleId: string) => {
    await updateStatus({ id: vehicleId, status: VehicleStatus.ACTIVE });
    // await refresh();
  };

  const handleReject = async (vehicleId: string) => {
    await updateStatus({ id: vehicleId, status: VehicleStatus.REJECTED });
    // await refresh();
  };

  const onSubmitRejectReason = async (id: string, reason: string) => {
    await saveVehicleRejection(id, reason);
    // await refresh();
  };
  return [
    // {
    //   title: 'Company',
    //   dataIndex: 'companyName',
    //   key: 'companyName',
    // },
    { title: 'Merk & model', dataIndex: 'model', key: 'model' },
    { title: 'Type', dataIndex: 'licensePlate', key: 'licensePlate' },
    {
      title: 'Min',
      dataIndex: 'manufactureYear',
      key: 'manufactureYear',
      render(value, record, index) {
        return <div>$ 100.00</div>;
      },
    },
    {
      title: 'Max',
      dataIndex: 'engineType',
      key: 'engineType',
      render(value, record, index) {
        return <div>$ 100.00</div>;
      },
    },
    {
      title: 'Reden',
      dataIndex: 'seatingCapacity',
      key: 'seatingCapacity',
    },
    // {
    //   title: 'Battery Capacity',
    //   dataIndex: 'batteryCapacity',
    //   key: 'batteryCapacity',
    // },
    // { title: 'Price Per Day', dataIndex: 'pricePerDay', key: 'pricePerDay' },
    // { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Details',
      render: (value: any, record: any) => (
        <Link href={`/dashboard/vehicles/${record.id}`}>Details</Link>
      ),
    },
    ...(status === 'PENDING' || status === 'REJECTED'
      ? [
          {
            title: 'Action',
            key: 'action',
            render: (text: any, record: any) => (
              <div className="flex items-center">
                {status === 'PENDING' ? (
                  <ActionButtons
                    onApprove={handleApprove}
                    onRejectReason={onSubmitRejectReason}
                    onReject={handleReject}
                    recordId={record.id}
                    confirmationMessage="Are you sure you want to reject this vehicle?"
                  />
                ) : (
                  <>
                    <DefaultModal
                      title="Wil je zeker dat je deze bestuurder wilt deblokeren?"
                      button={
                        <Button
                          type="text"
                          color="green"
                          className="flex items-center text-success-base hover:bg-success-base"
                        >
                          <ReloadOutlined rev={undefined} /> herstellen
                        </Button>
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
                      Zodra je verdergaat, wordt de bestuurder gedeblokkeerd en
                      kan diegene de app weer gebruiken.
                    </DefaultModal>
                    <DefaultModal
                      title="Weet je het zeker dat u de auto wilt verwijderen?"
                      button={
                        <Button
                          type="text"
                          danger
                          className="flex items-center gap-1"
                        >
                          <DeleteIcon /> Verwijderen
                        </Button>
                      }
                      confirmPlaceholder="Verwijder"
                      fn={async () => {
                        await deleteVehicle(record.id);
                        message.success('Vehicle deleted successfully');
                      }}
                    >
                      {/* Zodra je verdergaat, wordt de bestuurder gedeblokkeerd en
                      kan diegene de app weer gebruiken. */}
                    </DefaultModal>
                  </>
                )}
              </div>
            ),
          },
        ]
      : []),
  ];
};

export const VehiclesTab = ({ status }: { status: VehicleStatusType }) => {
  const router = useRouter();
  const {
    data: vehicles,
    isLoading,
    // refresh,
  } = useVehiclesByStatus(status);

  const onCreateNewVehicle = () => {
    router.push('/dashboard/vehicles/create-vehicle');
  };

  return (
    <div className="px-6">
      <div className="flex items-end flex-wrap gap-4 mb-5">
        <div className="mr-auto">
          <h4 className="mb-1 capitalize text-neutral-100 font-bold text-xl sm:text-2xl">
            {status} Vehicles
          </h4>
          <h6 className="font-medium text-base text-neutral-50">
            Total {vehicles?.length} {status} vehicles
          </h6>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined rev={undefined} />}
          onClick={onCreateNewVehicle}
          className="flex items-center"
        >
          Create New Vehicle
        </Button>
      </div>
      <Table
        // scroll={{ x: 'max-content' }}
        // className="w-full"
        // tableLayout="fixed"
        columns={useColumns({ status })}
        dataSource={vehicles}
        loading={isLoading}
      />
    </div>
  );
};
