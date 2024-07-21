import React, { useEffect, useState } from 'react';
import {
  Order,
  OrderStatus,
  Payment,
  PaymentStatus,
  UserProfile,
} from '@/api/orders/types';
import {
  cancelOrder,
  changeOrderStatus,
  completeOrderAdmin,
  confirmOrder,
  createOrderRejectionReason,
  deleteOrder,
  getRangeExcel,
  getRangeInvoices,
  invalidateOrders,
  rejectOrder,
  stopOrder,
} from '@/api/orders/orders';
import {
  Badge,
  Button,
  DatePicker,
  Dropdown,
  MenuProps,
  Popconfirm,
  Popover,
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
import {
  CheckOutlined,
  CloseOutlined,
  DownSquareTwoTone,
  MoreOutlined,
} from '@ant-design/icons';
import { dateTimeFormat, dayjsExtended } from '@/utils/date';
import DefaultModal from '@/components/modals/DefautlModal';
import ButtonWithIcon from '@/components/buttons/buttons';
import DeleteIcon from '@/components/icons/DeleteIcon';
import CheckIcon from '@/components/icons/CheckIcon';
import { OrderDeleteModal, OrderRecoverModal } from './Modals';
import OrderPopover from '@/components/popover/orderPopover';
import { refundPayment } from '@/api/payment/payment';
import {
  downloadAllFiles,
  downloadFile,
  downloadFile2,
  multipleDownloadsZip,
} from '@/utils/file';

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

interface Data extends Order {
  payment: Payment;
}

const useColumns = ({ status }: { status: Keys }): TableColumnsType<Data> => {
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
        <>{dateTimeFormat(row.rentalStartDate)}</>
      ),
    },
    {
      title: 'Einde',
      dataIndex: 'rentalStartDate',
      className: 'table-bg-primary',
      key: 'rentalStartDate',
      render: (value: string, row: Order) => (
        <>
          <div>{dateTimeFormat(row.rentalEndDate)}</div>
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
            render: (date: string) => dateTimeFormat(date),
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
      render: (value: number, record) => {
        const price = currencyFormatter.format(value);
        const paymentStatus = record?.payment?.status;
        const invoiceUrl = record?.payment?.invoiceUrl;
        return (
          <div className="flex gap-1 items-center">
            {invoiceUrl && (
              <button
                onClick={() => downloadFile(invoiceUrl)}
                // target="_blank"
                className=""
              >
                <Image
                  width={20}
                  height={20}
                  src="/assets/table/invoice.svg"
                  alt="invoice"
                />
              </button>
            )}
            <span>{price}</span>
            {paymentStatus && <span>({paymentStatus})</span>}
          </div>
        );
      },
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
      dataIndex: 'id',
      key: 'id',
      render(value, record, index) {
        const isStopped = record.stopRentDate;
        const id = record.id;
        const mollieId = record?.payment?.mollieId;
        const isPaid = record.payment?.status === PaymentStatus.PAID;
        return (
          <div className="flex gap-1 justify-end">
            {status === 'UNPAID' ? (
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
              </>
            ) : status === 'COMPLETED' ? (
              <Badge className="bg-success-dark-1 p-2 rounded-lg text-success-light-2">
                Betaald
              </Badge>
            ) : null}
            <OrderPopover
              isPaid={isPaid}
              mollieId={mollieId}
              status={status}
              orderId={id}
            />
          </div>
        );
      },
    },
  ];
};

const OrdersTable = ({ status, label }: { status: Keys; label: string }) => {
  const { data, isFetching, error } = useOrders(status);

  const columns = useColumns({ status });

  const [rangePickerValue, setRangePickerValue] = useState([null, null]);

  if (error) {
    return <div>Error loading data</div>;
  }

  // const [start, end] = rangePickerValue;
  const start = rangePickerValue?.[0];
  const end = rangePickerValue?.[1];
  const rangeIsSelected = start && end;

  async function exportPdfs() {
    const res = await getRangeInvoices(start.toDate(), end.toDate());
    downloadAllFiles(res);
    console.log(res);
  }

  async function exportExcel() {
    const res = await getRangeExcel(start.toDate(), end.toDate());
    console.log(res);
  }

  return (
    <div className="px-2">
      <section className="flex justify-end items-center mb-2 gap-2">
        <DatePicker.RangePicker
          value={rangePickerValue}
          onChange={setRangePickerValue}
        />
        <Button onClick={exportPdfs} disabled={!rangeIsSelected}>
          Export pdfs
        </Button>
        <Button onClick={exportExcel} disabled={!rangeIsSelected}>
          Export Excel
        </Button>
        <Link href={'/dashboard/orders/create'}>
          <Button>Create order</Button>
        </Link>
      </section>
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
