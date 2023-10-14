import React from 'react';
import Link from 'next/link';
import { Table, TableColumnsType } from 'antd';

interface DataType {
  report: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Report',
    key: 'report',
    dataIndex: 'report',
    render: () => (
      <p className="text-sm">
        While driving the car on Tue, 08/03/2023, I noticed that the battery
        charge was dropping much faster than expected, and the car was not
        driving as smoothly as it should
      </p>
    ),
  },
  {
    title: '',
    key: 'buttonAction',
    dataIndex: 'buttonAction',

    render: () => (
      <div className="flex justify-end items-center gap-4">
        <Link href="car/toyota/carDetail" className="text-primary-base">
          Details
        </Link>
      </div>
    ),
  },
];

export const LatestDamageReportsTable = ({
  dataSource,
}: {
  dataSource: any;
}) => {
  return (
    <div className="px-6">
      <div className="flex items-end flex-wrap gap-4 mb-5">
        <div className="mr-auto">
          <h4 className="mb-1 capitalize text-neutral-100 font-bold text-xl sm:text-2xl">
            Latest damage reports
          </h4>
        </div>
      </div>
      <Table columns={columns} dataSource={dataSource} />
    </div>
  );
};
