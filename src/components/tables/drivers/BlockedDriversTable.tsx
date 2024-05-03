import React from 'react';
import { Table } from 'antd';
import { UserProfileStatus } from '@/api/drivers/types';
import { useDriversByStatus } from '@/api/drivers/hooks';
import { driversColumns } from '@/views/drivers/Drivers';

const BlockedDriversTable = () => {
  const { data: drivers, loading } = useDriversByStatus(
    UserProfileStatus.BLOCKED,
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-6">
      <div className="flex items-end flex-wrap gap-4 mb-5">
        <div className="mr-auto">
          <h4 className="mb-1 text-neutral-100 font-bold text-xl sm:text-2xl">
            Blocked drivers
          </h4>
          <h6 className="font-medium text-base text-neutral-50">
            Total {drivers.length} blocked drivers
          </h6>
        </div>
      </div>
      <Table dataSource={drivers} columns={driversColumns({})} />
    </div>
  );
};

export default BlockedDriversTable;
