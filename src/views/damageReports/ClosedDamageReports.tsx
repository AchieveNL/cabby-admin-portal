import React from 'react';
import { Table } from 'antd';
import { formatDate } from '@/utils/utils';
import { useDamageReport } from '@/api/damage-reports/hooks';
import { ReportStatus } from '@/api/damage-reports/types';

const ClosedDamageReports = () => {
  const { data, loading } = useDamageReport(ReportStatus.REPAIRED);

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
      render: (user: any) => user.profile.fullName,
    },
    {
      title: 'Vehicle',
      dataIndex: 'vehicle',
      key: 'vehicle',
      render: (vehicle: any) => `${vehicle.model} (${vehicle.companyName})`,
    },
  ];

  return (
    <div className="px-6">
      <div className="flex items-end flex-wrap gap-4 mb-5">
        <div className="mr-auto">
          <h4 className="mb-1 capitalize text-neutral-100 font-bold text-xl sm:text-2xl">
            Closed Damage Reports
          </h4>
          <h6 className="font-medium text-base text-neutral-50">
            Total {data?.length} closed reports
          </h6>
        </div>
      </div>
      <Table columns={columns} dataSource={data} loading={loading} />
    </div>
  );
};

export default ClosedDamageReports;
