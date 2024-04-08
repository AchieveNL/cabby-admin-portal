/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Table, message } from 'antd';
import { OrderStatus } from '@/api/orders/types';
import { useOrders } from '@/api/orders/hooks';
import { getOrderColumns } from '../../../views/orders/Orders';
import ActionButtons from '@/components/ActionButtons/ActionButtons';
import Link from 'next/link';
import { cancelOrder } from '@/api/orders/orders';

export default function ActiveOrdersTab() {
  const { data, loading, error, refetch } = useOrders(OrderStatus.CONFIRMED);

  const handleCancel = async (orderId: string) => {
    try{
      await cancelOrder(orderId);
      await refetch();
      message.success('Order cancelled successfully');
    }
    catch(err : any) {
      message.error(err.response.data.message);
    }
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
            onCancel={handleCancel}
            recordId={record.id}
            confirmationMessage="Are you sure you want to cancel this order?"
          />
        </div>
      ),
    },
  ];

  if (error) {
    return <p>Error loading data!</p>;
  }

  return (
    <div className="px-6">
      <div className="flex items-end flex-wrap gap-4 mb-5">
        <div className="mr-auto">
          <h4 className="mb-1 capitalize text-neutral-100 font-bold text-xl sm:text-2xl">
            Active Orders
          </h4>
          <h6 className="mb-4 font-medium text-base text-neutral-50">
            Total {data.length} active orders
          </h6>
        </div>
      </div>
      <Table columns={columns} dataSource={data} loading={loading} />
    </div>
  );
}
