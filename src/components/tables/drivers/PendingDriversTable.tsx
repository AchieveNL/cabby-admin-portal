import React from 'react';
import { Col, Row } from 'antd';
import { UserProfileStatus } from '@/api/drivers/types';
import { useDriversByStatus } from '@/api/drivers/hooks';
import DriverCard from '@/components/cards/DriverCard';

const PendingDriversTable = () => {
  const { data: drivers, isFetching } = useDriversByStatus(
    UserProfileStatus.PENDING,
  );

  if (isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-6">
      <div className="flex items-end flex-wrap gap-4 mb-5">
        <div className="mr-auto">
          <h4 className="mb-1 text-neutral-100 font-bold text-xl sm:text-2xl">
            Pending drivers
          </h4>
          <h6 className="font-medium text-base text-neutral-50">
            Total {drivers?.length} pending drivers
          </h6>
        </div>
      </div>
      <Row>
        {drivers?.map((driver: any, ind) => (
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xl={12}
            xxl={12}
            span={11}
            key={ind}
          >
            <DriverCard driver={driver} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PendingDriversTable;
