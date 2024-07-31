import React, { useEffect, useState } from 'react';
import { Order, OrderStatus, UserProfile } from '@/api/orders/types';
import {
  cancelOrder,
  changeOrderStatus,
  completeOrderAdmin,
  confirmOrder,
  createOrderRejectionReason,
  deleteOrder,
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
import { CheckOutlined, CloseOutlined, MoreOutlined } from '@ant-design/icons';
import { dayjsExtended } from '@/utils/date';
import DefaultModal from '@/components/modals/DefautlModal';
import ButtonWithIcon from '@/components/buttons/buttons';
import DeleteIcon from '@/components/icons/DeleteIcon';
import CheckIcon from '@/components/icons/CheckIcon';
import { OrderDeleteModal, OrderRecoverModal } from './Modals';

type Keys = keyof typeof OrderStatus;
// type Status = (typeof OrderStatus)[Keys];
const orderStatusArray = Object.values(OrderStatus);

const items: ({ id }: { id: string }) => MenuProps['items'] = ({ id }) =>
  orderStatusArray
    .filter((el) => el === OrderStatus.COMPLETED)
    .map((el) => ({
      key: el,
      label: el === 'COMPLETED' ? 'Voltooid' : el,
      onClick: async () => {
        if (el === OrderStatus.COMPLETED) {
          await completeOrderAdmin(id);
          message.success('Order completed successfully!');
        }
      },
    }));

const useColumns = ({ status }: { status: Keys }): TableColumnsType<Order> => {
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
      title: "Auto's",
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
        <>{dayjsExtended(row.rentalStartDate).format('DD/MM/YYYY • HH:mm')}</>
      ),
    },
    {
      title: 'Einde',
      dataIndex: 'rentalStartDate',
      className: 'table-bg-primary',
      key: 'rentalStartDate',
      render: (value: string, row: Order) => (
        <>
          <div>
            {dayjsExtended(row.rentalEndDate).format('DD/MM/YYYY • HH:mm')}
          </div>
        </>
      ),
    },
    {
      title: 'Duur',
      dataIndex: 'rentalStartDate',
      className: 'table-bg-primary',
      key: 'countdown',
      render: (value: string, row) => (
        <>
          {/* <Countdown targetDate={value} /> */}
          {dayjsExtended
            .duration(
              dayjsExtended(row.rentalEndDate).diff(
                dayjsExtended(row.rentalStartDate),
              ),
            )
            .format('D [days] HH:mm')}
        </>
      ),
    },
    ...(['COMPLETED', 'UNPAID'].includes(status)
      ? [
          {
            title: 'Gestopt',
            dataIndex: 'stopRentDate',
            key: 'stopRentDate',
            className: 'table-bg-primary',
            render: (date: string) =>
              date ? dayjsExtended(date).format('DD/MM/YYYY • HH:mm') : '',
          },
          {
            title: 'Overtijd',
            dataIndex: 'id',
            key: 'id',
            className: 'table-bg-primary',
            render: (id: string, order: Order) => {
              const endDate = dayjsExtended(order.rentalEndDate).toDate();
              const overdue = dayjsExtended
                .duration(
                  dayjsExtended(new Date()).diff(dayjsExtended(endDate)),
                )
                .format('D [days] HH:mm');

              return <div>{endDate < new Date() ? overdue : ''}</div>;
            },
          },
        ]
      : []),
    {
      title: 'Prijs',
      dataIndex: 'totalAmount',
      className: 'table-bg-primary',
      key: 'totalAmount',
      render: (value: number) => currencyFormatter.format(value),
    },
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
              <>
                <DefaultModal
                  confirmPlaceholder="Bevestigen"
                  title="Wilt u deze bestuurder bevestigen?"
                  fn={() => handleApprove(id)}
                  button={
                    <ButtonWithIcon
                      icon={<CheckOutlined rev={undefined} />}
                      className="text-success-base hover:text-success-light-2 hover:bg-success-base px-2 py-1 rounded-lg"
                    >
                      Bevestigen
                    </ButtonWithIcon>
                  }
                >
                  <>
                    Als u deze bestuurder bevestigt gaat de bestuurder naar
                    <strong className="ml-2">Bevestigd</strong>.
                  </>
                </DefaultModal>
                <ActionButtons
                  onCancel={handleCancel}
                  recordId={id}
                  confirmationMessage="Weet je zeker dat u deze order wilt annuleren?"
                  cancelPlaceholder="Order annuleren"
                />
              </>
            ) : status === 'CONFIRMED' ? (
              <ActionButtons
                onCancel={handleCancel}
                recordId={id}
                confirmationMessage="Weet je zeker dat u deze order wilt annuleren?"
                cancelPlaceholder="Order annuleren"
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
            ) : status === 'COMPLETED' ? (
              <>
                <Badge className="bg-success-dark-1 p-2 rounded-lg text-success-light-2">
                  Betaald
                </Badge>
                <OrderDeleteModal id={id} />
              </>
            ) : status === 'CANCELED' ? (
              <>
                <OrderRecoverModal id={id} />
                <OrderDeleteModal id={id} />
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

  const columns = useColumns({ status });

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
              : `Totaal ${data?.length} ${label} order(s)`}
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
