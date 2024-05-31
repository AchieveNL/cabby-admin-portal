/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import { Carousel, Input } from 'antd';
import { useRouter } from 'next/router';
import { LatestDamageReportsTable } from '@/components/tables/vehicles/LatestDamageReportsTable';
import ElectricCarIcon from '@/components/icons/ElectricCarIcon';
import EventSeatIcon from '@/components/icons/EventSeatIcon';
import BatteryChargingIcon from '@/components/icons/BatteryChargingIcon';
import StarIcon from '@/components/icons/StarIcon';
import { useUpdateVehicleStatus, useVehicleById } from '@/api/vehicles/hooks';
import { formatToEuro } from '@/utils/utils';
import ActionButtons from '@/components/ActionButtons/ActionButtons';
import { VehicleStatus } from '@/api/vehicles/types';
import {
  saveVehicleRejection,
  updateVehicleStatus,
} from '@/api/vehicles/vehicles';
import {
  VehicleConfirmModal,
  VehicleDeleteModal,
  VehicleRecoverModal,
} from '@/components/tables/vehicles/Modals';

const reports = [{}, {}, {}];

const VehicleDetails = () => {
  const router = useRouter();
  const vehicleId = router.query.vehicleId as string;
  const { data: vehicle, isLoading } = useVehicleById(vehicleId);
  const { mutateAsync: updateStatus } = useUpdateVehicleStatus();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const badgeList = [
    {
      icon: ElectricCarIcon,
      title: 'Engine',
      value: `${vehicle?.engineType || 'N/A'}`,
    },
    {
      icon: EventSeatIcon,
      title: 'Total seats',
      value: `${vehicle?.seatingCapacity || 'N/A'}`,
    },
    {
      icon: BatteryChargingIcon,
      title: 'Battery capacity',
      value: `${vehicle?.batteryCapacity || 'N/A'}`,
    },
    {
      icon: StarIcon,
      title: 'Special feature',
      value: vehicle?.uniqueFeature || 'N/A',
    },
    // ... Add more badges as required
  ];

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
  };

  return (
    <div className="p-8">
      <figure className="mb-8">
        <Link href="/dashboard/vehicles" className="btn-primary">
          <span className="text-base font-bold">Back</span>
        </Link>
      </figure>

      <header className="flex flex-wrap gap-4 mb-5">
        <h4 className="mr-auto mb-1 capitalize text-neutral-100 font-bold text-xl sm:text-2xl">
          Details info
        </h4>
        <Link
          href={`/dashboard/vehicles/create-vehicle?vehicleId=${vehicleId}`}
          className="btn-primary"
        >
          <span className="text-base font-bold">Edit</span>
        </Link>
        <div className="flex gap-4 items-center">
          {vehicle?.status === VehicleStatus.PENDING ? (
            <>
              <VehicleConfirmModal id={vehicleId} />
              <VehicleDeleteModal id={vehicleId} />
            </>
          ) : (
            <>
              <VehicleRecoverModal id={vehicleId} />
              <VehicleDeleteModal id={vehicleId} />
            </>
          )}
        </div>
      </header>

      <section className="mb-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="h-full bg-neutral-10 border border-neutral-50/25 rounded-xl p-6">
          <Carousel autoplay>
            {vehicle?.images?.length ? (
              vehicle.images.map((imgUrl, idx) => (
                <div key={idx}>
                  <img
                    className="block h-full w-full"
                    src={imgUrl}
                    alt={`Car image ${idx}`}
                  />
                </div>
              ))
            ) : (
              <div>
                <img
                  className="block h-full w-full"
                  src="https://cdn.motor1.com/images/mgl/8A9MRe/s3/2024-lamborghini-revuelto.jpg"
                  alt="Default car"
                />
              </div>
            )}
          </Carousel>
        </div>
        <div className="bg-white border border-primary-light-2 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <span className="capitalize text-neutral-100 font-bold text-xl sm:text-2xl">
              {vehicle?.companyName || 'N/A'}
            </span>
          </div>
          <h4 className="mb-2 capitalize text-neutral-100 font-bold text-xl sm:text-2xl">
            {vehicle?.model || 'N/A'}
          </h4>
          <p className="text-neutral-100">
            {formatToEuro(vehicle?.pricePerDay ?? 0) || 'N/A'} /day.
            {vehicle?.rentalDuration || 'N/A'} rental period
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-4">
            <li className="col-span-2">
              <label className="text-neutral-100 text-sm font-medium capitalize mb-2 block">
                Plate number
              </label>
              <Input
                placeholder="plate number"
                disabled
                className="font-medium capitalize disabled:bg-[#DBDBDB] disabled:text-neutral-75 placeholder:text-neutral-75"
                defaultValue={vehicle?.licensePlate || '-'}
              />
            </li>
            <li>
              <label className="text-neutral-100 text-sm font-medium capitalize mb-2 block">
                Type
              </label>
              <Input
                placeholder="type"
                disabled
                className="font-medium capitalize disabled:bg-[#DBDBDB] disabled:text-neutral-75 placeholder:text-neutral-75"
                value={vehicle?.category || '-'}
              />
            </li>
            <li>
              <label className="text-neutral-100 text-sm font-medium capitalize mb-2 block">
                Year
              </label>
              <Input
                placeholder="Year"
                disabled
                className="font-medium capitalize disabled:bg-[#DBDBDB] disabled:text-neutral-75 placeholder:text-neutral-75"
                value={vehicle?.manufactureYear || '-'}
              />
            </li>
          </ul>
        </div>
      </section>

      <section className="mb-6">
        <div className="flex flex-wrap gap-4">
          {badgeList.map((badge, idx) => (
            <div
              key={`badge-${idx}`}
              className="bg-white border border-primary-light-2 rounded-lg py-3 px-4 flex items-center gap-3"
            >
              <div className="flex items-center justify-center h-10 w-10 min-w-[2.5rem] bg-primary-light-3 rounded p-2">
                <badge.icon />
              </div>
              <div>
                <h6 className="text-base font-normal text-neutral-50">
                  {badge.title}
                </h6>
                <h4 className="capitalize text-neutral-100 font-bold text-xl sm:text-2xl">
                  {badge.value}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-5">
        <LatestDamageReportsTable dataSource={reports} />
      </section>
    </div>
  );
};

export default VehicleDetails;
