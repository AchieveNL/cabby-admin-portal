import React from 'react';
import { Order, OrderStatus, UserProfile } from '@/api/orders/types';
import {
  cancelOrder,
  completeOrderAdmin,
  confirmOrder,
  createOrderRejectionReason,
  invalidateOrders,
  rejectOrder,
  stopOrder,
} from '@/api/orders/orders';
import {
  Badge,
  Button,
  Dropdown,
  MenuProps,
  Space,
  Table,
  TableColumnsType,
  message,
} from 'antd';
import { useOrders } from '@/api/orders/hooks';
import Link from 'next/link';
import ActionButtons from '@/components/ActionButtons/ActionButtons';
import { Vehicle } from '@/api/vehicles/types';
import { currencyFormatter } from '@/common/utits';
import Countdown from '@/components/CountDown/Countdown';
import Image from 'next/image';
import { CloseOutlined, MoreOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(duration);

type Keys = keyof typeof OrderStatus;
// type Status = (typeof OrderStatus)[Keys];
const orderStatusArray = Object.values(OrderStatus);

const items: ({ id }: { id: string }) => MenuProps['items'] = ({ id }) =>
  orderStatusArray
    .filter((el) => el === OrderStatus.COMPLETED)
    .map((el) => ({
      key: el,
      label: el,
      onClick: async () => {
        if (el === OrderStatus.COMPLETED) {
          await completeOrderAdmin(id);
          message.success('Order completed successfully!');
        }
      },
    }));

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

  const handleStop = async (orderId: string) => {
    try {
      await stopOrder(orderId);
      message.success('Order cancelled successfully');
    } catch (err: any) {
      message.error(err.response?.data?.message);
    }
  };

  return [
    {
      title: 'Bestuurders',
      dataIndex: 'user',
      key: 'user',
      className: 'table-bg-primary',
      render: (user: { profile: UserProfile }) => (
        <a>{user.profile?.fullName}</a>
      ),
    },
    {
      title: 'Auto',
      dataIndex: 'vehicle',
      className: 'table-bg-primary',
      key: 'vehicle',
      render: (vehicle: Vehicle) => (
        <div className="flex items-center gap-2">
          <Image
            src={vehicle.images?.[0]}
            alt={vehicle.companyName}
            width={30}
            height={30}
            className="rounded-full aspect-square object-cover"
          />
          {/* <img src={vehicle.images?.[0]} alt={vehicle.companyName} /> */}
          <div>{vehicle.companyName}</div>
        </div>
      ),
    },
    {
      title: 'Begin',
      dataIndex: 'rentalStartDate',
      className: 'table-bg-primary',
      key: 'rentalStartDate',
      render: (value: string, row: Order) => (
        <>{dayjs.utc(row.rentalStartDate).format('DD/MM/YYYY • hh:mm')}</>
      ),
    },
    {
      title: 'Einde',
      dataIndex: 'rentalStartDate',
      className: 'table-bg-primary',
      key: 'rentalStartDate',
      render: (value: string, row: Order) => (
        <>
          <div>{dayjs.utc(row.rentalEndDate).format('DD/MM/YYYY • hh:mm')}</div>
        </>
      ),
    },
    {
      title: 'Prijs',
      dataIndex: 'totalAmount',
      className: 'table-bg-primary',
      key: 'totalAmount',
      render: (value: number) => currencyFormatter.format(value),
    },
    {
      title: 'Tijd',
      dataIndex: 'rentalStartDate',
      className: 'table-bg-primary',
      key: 'countdown',
      render: (value: string, row) => (
        <>
          {/* <Countdown targetDate={value} /> */}
          {dayjs
            .duration(dayjs(row.rentalEndDate).diff(dayjs(row.rentalStartDate)))
            .format('HH:mm:ss')}
        </>
      ),
    },
    ...(['COMPLETED', 'UNPAID'].includes(status)
      ? [
          {
            title: 'Stoped At',
            dataIndex: 'stopRentDate',
            key: 'stopRentDate',
            className: 'table-bg-primary',
            render: (date: string) =>
              date ? dayjs.utc(date).format('DD/MM/YYYY • hh:mm') : '',
          },
        ]
      : []),
    {
      title: 'Details',
      dataIndex: 'id',
      key: 'id',
      className: 'table-bg-primary',
      render: (id) => (
        <Link href={`/dashboard/orders/${id}`} className="text-primary-base">
          Details
        </Link>
      ),
    },
    {
      title: 'Acties',
      align: 'center',
      render: (value: any, record: Order) => {
        const isStopped = record.stopRentDate;
        const id = record.id;
        return (
          <div className="flex items-center gap-2 justify-end">
            {status === 'PENDING' ? (
              <ActionButtons
                onApprove={handleApprove}
                onRejectReason={onSubmitRejectReason}
                onReject={handleReject}
                recordId={id}
                confirmationMessage="Als u deze order bevestigt gaat de order naar “Afwijzen“."
              />
            ) : status === 'CONFIRMED' ? (
              <ActionButtons
                onCancel={handleCancel}
                recordId={id}
                confirmationMessage="Are you sure you want to cancel this order?"
              />
            ) : status === 'UNPAID' ? (
              <>
                {!isStopped && (
                  <Button
                    onClick={() => stopOrder(id)}
                    type="text"
                    danger
                    className="flex items-center gap-1"
                  >
                    <CloseOutlined rev={undefined} /> Stop
                  </Button>
                )}
                <Badge className="bg-danger-light-2 p-2 rounded-lg text-danger-base">
                  Onbetaald
                </Badge>
                <Dropdown
                  className="hover:cursor-pointer"
                  menu={{ items: items({ id }) }}
                >
                  <Space>
                    <MoreOutlined
                      rev={undefined}
                      className="text-primary-base text-3xl"
                    />
                  </Space>
                </Dropdown>
              </>
            ) : (
              <></>
            )}
          </div>
        );
      },
    },
  ];
};

const OrdersTable = ({ status, label }: { status: Keys; label: string }) => {
  const { data, isFetching, error } = useOrders(status);

  const columns = getColumns({ status });

  if (error) {
    return <div>Error loading data</div>;
  }

  const isPending = status === 'PENDING';
  return (
    <div className="px-6">
      <div className="flex items-end flex-wrap gap-4 mb-5">
        <div className="mr-auto">
          <h4 className="first-letter:capitalize mb-1 text-neutral-100 font-bold text-xl sm:text-2xl">
            {isPending ? `Orders ${label}` : `${label} orders`}
          </h4>
          <h6 className="mb-4 font-medium text-base text-neutral-50">
            {isPending
              ? `Totaal ${data?.length} orders ${label}`
              : `Totaal ${data?.length} ${label} orders`}
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
