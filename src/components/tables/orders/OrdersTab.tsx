import React from 'react';
import { Order, OrderStatus, UserProfile } from '@/api/orders/types';
import {
  cancelOrder,
  confirmOrder,
  createOrderRejectionReason,
  invalidateOrders,
  rejectOrder,
} from '@/api/orders/orders';
import { Table, TableColumnsType, message } from 'antd';
import { useOrders } from '@/api/orders/hooks';
import Link from 'next/link';
import ActionButtons from '@/components/ActionButtons/ActionButtons';
import { Vehicle } from '@/api/vehicles/types';
import dayjs from 'dayjs';
import { currencyFormatter } from '@/common/utits';
import Countdown from '@/components/CountDown/Countdown';

type Keys = keyof typeof OrderStatus;
// type Status = (typeof OrderStatus)[Keys];

const getColumns = ({ status }: { status: Keys }): TableColumnsType<Order> => {
  const handleApprove = async (orderId: string) => {
    await confirmOrder(orderId);
    await invalidateOrders();
  };

  const handleReject = async (orderId: string) => {
    await rejectOrder(orderId);
  };

  const onSubmitRejectReason = async (id: string, reason: string) => {
    await createOrderRejectionReason(id, reason);
    // await refetch();
  };

  const handleCancel = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      // await refetch();
      message.success('Order cancelled successfully');
    } catch (err: any) {
      message.error(err.response.data.message);
    }
  };

  return [
    {
      title: 'Driver',
      dataIndex: 'user',
      key: 'user',
      className: 'table-bg-primary',
      render: (user: { profile: UserProfile }) => (
        <a>{user.profile.fullName}</a>
      ),
    },
    {
      title: 'Vehicle',
      dataIndex: 'vehicle',
      className: 'table-bg-primary',
      key: 'vehicle',
      render: (vehicle: Vehicle) => (
        <div>
          <div>
            <img src={vehicle.images?.[0]} alt={vehicle.companyName} />
          </div>
          <div>{vehicle.companyName}</div>
        </div>
      ),
    },
    {
      title: 'Rental Period',
      dataIndex: 'rentalStartDate',
      className: 'table-bg-primary',
      key: 'rentalStartDate',
      render: (value: string, row: Order) => (
        <>
          <div>
            From: {dayjs(row.rentalStartDate).format('DD/MM/YYYY • hh:mm')}
          </div>
          <div>to: {dayjs(row.rentalEndDate).format('DD/MM/YYYY • hh:mm')}</div>
        </>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'totalAmount',
      className: 'table-bg-primary',
      key: 'totalAmount',
      render: (value: number) => currencyFormatter.format(value),
    },
    {
      title: 'Countdown',
      dataIndex: 'rentalStartDate',
      className: 'table-bg-primary',
      key: 'countdown',
      render: (value: string) => <Countdown targetDate={value} />,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      className: 'table-bg-primary',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY • hh:mm'),
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      className: 'table-bg-primary',
      render: (note?: string) => note || 'N/A',
    },
    {
      title: 'Action',
      // align: 'center',
      render: (value: any, record: Order) => (
        <div className="flex items-center gap-2 w-[200px]">
          <Link href={`/dashboard/orders/${record.id}`}>Details</Link>
          {status === 'PENDING' ? (
            <ActionButtons
              onApprove={handleApprove}
              onRejectReason={onSubmitRejectReason}
              onReject={handleReject}
              recordId={record.id}
              confirmationMessage="Als u deze order bevestigt gaat de order naar “Afwijzen“."
            />
          ) : status === 'CONFIRMED' ? (
            <ActionButtons
              onCancel={handleCancel}
              recordId={record.id}
              confirmationMessage="Are you sure you want to cancel this order?"
            />
          ) : (
            <></>
          )}
        </div>
      ),
    },
  ];
};

const OrdersTable = ({ status }: { status: Keys }) => {
  const { data, isFetching, error } = useOrders(status);

  const columns = getColumns({ status });
  // {
  //   title: 'Action',
  //   key: 'action',
  //   render: (text: any, record: any) => (
  //     <div className="flex items-center gap-2">
  //       <Link href={`/dashboard/orders/${record.id}`}>Details</Link>
  //       <ActionButtons
  //         onApprove={handleApprove}
  //         onRejectReason={onSubmitRejectReason}
  //         onReject={handleReject}
  //         recordId={record.id}
  //         confirmationMessage="Are you sure you want to reject this vehicle?"
  //       />
  //     </div>
  //   ),
  // },

  if (error) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="px-6">
      <div className="flex items-end flex-wrap gap-4 mb-5">
        <div className="mr-auto">
          <h4 className="mb-1 capitalize text-neutral-100 font-bold text-xl sm:text-2xl">
            Pending Orders
          </h4>
          <h6 className="mb-4 font-medium text-base text-neutral-50">
            Total {data?.length} {status} orders
          </h6>
        </div>
      </div>
      <Table
        // tableLayout="auto"
        columns={columns}
        dataSource={data}
        loading={isFetching}
      />
    </div>
  );
};

export default OrdersTable;
