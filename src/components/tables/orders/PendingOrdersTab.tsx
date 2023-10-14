import React from 'react';
import { OrderStatus } from '@/api/orders/types';
import {
  confirmOrder,
  createOrderRejectionReason,
  rejectOrder,
} from '@/api/orders/orders';
import { Table } from 'antd';
import { useOrders } from '@/api/orders/hooks';
import { getOrderColumns } from '@/views/orders/Orders';
import Link from 'next/link';
import ActionButtons from '@/components/ActionButtons/ActionButtons';

const PendingOrdersTable = () => {
  const { data, loading, error, refetch } = useOrders(OrderStatus.PENDING);

  const handleApprove = async (orderId: string) => {
    await confirmOrder(orderId);
    await refetch();
  };

  const handleReject = async (orderId: string) => {
    await rejectOrder(orderId);
  };

  const onSubmitRejectReason = async (id: string, reason: string) => {
    await createOrderRejectionReason(id, reason);
    await refetch();
  };

  const columns = [
    ...getOrderColumns(true),
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => (
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/orders/${record.id}`}>Details</Link>
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
            Total {data.length} pending orders
          </h6>
        </div>
      </div>
      <Table columns={columns} dataSource={data} loading={loading} />
    </div>
  );
};

export default PendingOrdersTable;
