import React from 'react';
import { Table } from 'antd';
import { formatDate } from '@/utils/utils';
import { useDamageReport } from '@/api/damage-reports/hooks';
import { ReportStatus } from '@/api/damage-reports/types';
import { damageReportColumns } from './DamageReport';

const ClosedDamageReports = () => {
  const { data, loading } = useDamageReport(ReportStatus.REPAIRED);

  return (
    <div className="px-6">
      <div className="flex items-end flex-wrap gap-4 mb-5">
        <div className="mr-auto">
          <h4 className="mb-1 capitalize text-neutral-100 font-bold text-xl sm:text-2xl">
            Gesloten schaderapporten
          </h4>
          <h6 className="font-medium text-base text-neutral-50">
            Totaal {data?.length} gesloten schaderapporten
          </h6>
        </div>
      </div>
      <Table
        columns={damageReportColumns}
        dataSource={data}
        loading={loading}
      />
    </div>
  );
};

export default ClosedDamageReports;
