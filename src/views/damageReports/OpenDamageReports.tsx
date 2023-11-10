import React from 'react';
import { Button, Table, message } from 'antd';
import { formatDate } from '@/utils/utils';
import { useDamageReport } from '@/api/damage-reports/hooks';
import { ReportStatus } from '@/api/damage-reports/types';
import ButtonWithIcon from '@/components/buttons/buttons';
import { CheckOutlined, PlusOutlined } from '@ant-design/icons';
import { closeDamageReports } from '@/api/damage-reports/damage-reports';
import { useRouter } from 'next/router';
import Link from 'next/link';

const OpenDamageReports = () => {
  const router = useRouter();

  const { data, loading, refetch } = useDamageReport(ReportStatus.UNDERPAID);

  const onCloseDamageReport = async (id: string) => {
    try {
      await closeDamageReports(id);
      message.success('Damage Report Successfully Closed');
      refetch();
    } catch (error) {
      message.error('There was an error closing the damage report.');
    }
  };

  const columns = [
    {
      title: 'Reported At',
      dataIndex: 'reportedAt',
      key: 'reportedAt',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Repaired At',
      dataIndex: 'repairedAt',
      key: 'repairedAt',
      render: (date: string) => (date ? formatDate(date) : 'N/A'),
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (user: any) => user.profile?.fullName || 'N/A',
    },
    {
      title: 'Vehicle',
      dataIndex: 'vehicle',
      key: 'vehicle',
      render: (vehicle: any) => `${vehicle.model} (${vehicle.companyName})`,
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      render: (value: any, row: any) => (
        <div className="flex gap-1">
          <Link href={`/dashboard/damage-reports/${value}`}>Details</Link>
          <ButtonWithIcon
            icon={<CheckOutlined rev={undefined} />}
            style={{ color: 'green' }}
            onClick={() => onCloseDamageReport(row.id)}
          >
            Repaired
          </ButtonWithIcon>
        </div>
      ),
    },
  ];

  const onCreateNewReport = () => {
    router.push('/dashboard/damage-reports/create');
  };

  return (
    <div className="px-6">
      <div className="flex items-end flex-wrap gap-4 mb-5">
        <div className="mr-auto">
          <h4 className="mb-1 capitalize text-neutral-100 font-bold text-xl sm:text-2xl">
            Open Damage Reports
          </h4>
          <h6 className="font-medium text-base text-neutral-50">
            Total {data?.length} open reports
          </h6>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined rev={undefined} />}
          onClick={onCreateNewReport}
        >
          Create New Report
        </Button>
      </div>
      <Table columns={columns} dataSource={data} loading={loading} />
    </div>
  );
};

export default OpenDamageReports;
