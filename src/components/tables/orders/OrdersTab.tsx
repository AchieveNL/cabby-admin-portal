import React from 'react';
import { Order, OrderStatus, UserProfile } from '@/api/orders/types';
import {
  cancelOrder,
  confirmOrder,
  createOrderRejectionReason,
  invalidateOrders,
  rejectOrder,
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
dayjs.extend(duration);

type Keys = keyof typeof OrderStatus;
// type Status = (typeof OrderStatus)[Keys];
const orderStatusArray = Object.values(OrderStatus);

const items: MenuProps['items'] = orderStatusArray.map((el) => ({
  key: el,
  label: el,
  // onClick: () => {},
}));

const getColumns = ({ status }: { status?: Keys }): TableColumnsType<Order> => {
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
      title: 'Naam bestuurder',
      dataIndex: 'user',
      key: 'user',
      className: 'table-bg-primary',
      render: (user: { profile: UserProfile }) => (
        <a>{user.profile.fullName}</a>
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
      title: 'begin',
      dataIndex: 'rentalStartDate',
      className: 'table-bg-primary',
      key: 'rentalStartDate',
      render: (value: string, row: Order) => (
        <>{dayjs(row.rentalStartDate).format('DD/MM/YYYY • hh:mm')}</>
      ),
    },
    {
      title: 'einde',
      dataIndex: 'rentalStartDate',
      className: 'table-bg-primary',
      key: 'rentalStartDate',
      render: (value: string, row: Order) => (
        <>
          <div>{dayjs(row.rentalEndDate).format('DD/MM/YYYY • hh:mm')}</div>
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
    // {
    //   title: 'Created At',
    //   dataIndex: 'createdAt',
    //   key: 'createdAt',
    //   className: 'table-bg-primary',
    //   render: (date: string) => dayjs(date).format('DD/MM/YYYY • hh:mm'),
    // },
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
      title: 'Actie',
      // align: 'center',
      render: (value: any, record: Order) => (
        <div className="flex items-center gap-2">
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
          ) : status === 'UNPAID' ? (
            <>
              <Button type="text" danger className="flex items-center gap-1">
                <CloseOutlined rev={undefined} /> Stop
              </Button>
              <Badge className="bg-danger-light-2 p-2 rounded-lg text-danger-base">
                Onbetaald
              </Badge>
              <Dropdown className="hover:cursor-pointer" menu={{ items }}>
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
      ),
    },
  ];
};

const OrdersTable = ({ status }: { status?: Keys }) => {
  const { data, isFetching, error } = useOrders(status);

  const columns = getColumns({ status });

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
