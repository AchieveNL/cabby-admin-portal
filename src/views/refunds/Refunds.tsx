import React from 'react';
import { Button, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { useAllRefunds } from '@/api/refunds/hooks';
import { Driver } from '@/api/drivers/types';

export const columns = [
  {
    title: 'Name',
    dataIndex: 'userProfile',
    key: 'userProfile',
    render: (userProfile: Driver) => (
      <span>{userProfile.fullName ?? 'N/A'}</span>
    ),
  },
  { title: 'Amount', dataIndex: 'amount', key: 'amount' },
  { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' },
];

const Refunds = () => {
  const router = useRouter();
  const { data: refunds, loading } = useAllRefunds();

  const onCreateNewRefund = () => {
    router.push('/dashboard/refunds/create-refund');
  };

  return (
    <div className="px-6">
      <div className="flex items-end flex-wrap gap-4 mb-5">
        <div className="mr-auto">
          <h4 className="mb-1 capitalize text-neutral-100 font-bold text-xl sm:text-2xl">
            Refunds
          </h4>
          <h6 className="font-medium text-base text-neutral-50">
            Total {refunds?.length} refends
          </h6>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined rev={undefined} />}
          onClick={onCreateNewRefund}
        >
          Create New Refund
        </Button>
      </div>
      <Table columns={columns} dataSource={refunds} loading={loading} />
    </div>
  );
};

export default Refunds;
