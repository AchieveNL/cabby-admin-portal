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
import { damageReportColumns } from './DamageReport';

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
    ...damageReportColumns,
    {
      title: 'Actie',
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
            Open schaderapporten
          </h4>
          <h6 className="font-medium text-base text-neutral-50">
            Totaal {data?.length} open schaderapporten
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
