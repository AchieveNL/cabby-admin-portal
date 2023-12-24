import React from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Alert,
  Skeleton,
  Collapse,
  Avatar,
  Badge,
  Descriptions,
  Tag,
  Timeline,
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  ClockCircleOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { useOverview, usePendingDetails } from '@/api/overview/hooks';
import Link from 'next/link';
import { formatToEuro } from '@/utils/utils';

const StatisticCard: React.FC<{
  title: string;
  value?: number | string | null;
  isLoading?: boolean;
  valueStyle?: React.CSSProperties;
  prefix?: React.ReactNode;
}> = ({ title, value, isLoading, valueStyle, prefix }) => (
  <Card>
    {isLoading && !value ? (
      <Skeleton active />
    ) : (
      <Statistic
        title={title}
        value={value as number | string}
        valueStyle={valueStyle}
        prefix={prefix}
      />
    )}
  </Card>
);

const Overview: React.FC = () => {
  const { data: overview, loading, error } = useOverview();
  const { data: pendingDetails } = usePendingDetails();

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Alert
          message="An Error Occurred"
          description={`Unable to fetch data: ${error.message}`}
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!overview && !loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Alert
          message="No Data Available"
          description="No overview data is currently available. Please check back later."
          type="info"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Overview</h1>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <StatisticCard
            title="Total Drivers"
            value={overview?.totals.drivers}
            isLoading={loading}
          />
        </Col>
        <Col span={6}>
          <StatisticCard
            title="Total Vehicles"
            value={overview?.totals.vehicles}
            isLoading={loading}
          />
        </Col>
        <Col span={6}>
          <StatisticCard
            title="Total Orders"
            value={overview?.totals.orders}
            isLoading={loading}
          />
        </Col>
        <Col span={6}>
          <StatisticCard
            title="Order Rejections"
            value={overview?.totals.ordersRejection}
            isLoading={loading}
          />
        </Col>
        <Col span={6}>
          <StatisticCard
            title="Pending Orders"
            value={overview?.totals.pendingOrders}
            isLoading={loading}
          />
        </Col>
        <Col span={6}>
          <StatisticCard
            title="Pending Drivers"
            value={overview?.totals.pendingDrivers}
            isLoading={loading}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={6}>
          <StatisticCard
            title="New Drivers This Week"
            value={overview?.newThisWeek.drivers}
            valueStyle={{ color: '#3f8600' }}
            prefix={<ArrowUpOutlined rev={undefined} />}
            isLoading={loading}
          />
        </Col>
        <Col span={6}>
          <StatisticCard
            title="New Orders This Week"
            value={overview?.newThisWeek.orders}
            valueStyle={{ color: '#3f8600' }}
            prefix={<ArrowUpOutlined rev={undefined} />}
            isLoading={loading}
          />
        </Col>
        <Col span={6}>
          <StatisticCard
            title="Unfulfilled Orders"
            value={
              overview &&
              overview.totals.orders - overview.totals.ordersRejection
            }
            valueStyle={{ color: '#cf1322' }}
            prefix={<ArrowDownOutlined rev={undefined} />}
            isLoading={loading}
          />
        </Col>
      </Row>
      <div>
        <div style={{ padding: '20px' }}>
          <h2 className="mt-2 mb-2 bold">Pending Drivers</h2>
          <Collapse accordion>
            {pendingDetails?.pendingDrivers.map((driver) => (
              <Collapse.Panel
                header={
                  <Link
                    href={`/dashboard/drivers/${driver.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <>
                      <Avatar icon={<UserOutlined rev={undefined} />} />
                      {driver.firstName}
                    </>
                  </Link>
                }
                key={driver.id}
                extra={<Badge status="warning" text="Pending" />}
              >
                <Descriptions title="Driver Details">
                  <Descriptions.Item label="Email">
                    {driver.user.email}
                  </Descriptions.Item>
                </Descriptions>
              </Collapse.Panel>
            ))}
          </Collapse>

          <h2 className="mt-2 mb-2 bold">Pending Orders</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {pendingDetails?.pendingOrders.map((order) => (
              <Link
                href={`/dashboard/orders/${order.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
                key={order.id}
              >
                <Card
                  title={`Order ${order.id}`}
                  extra={
                    <Tag
                      color={order.totalAmount > 100 ? 'red' : 'green'}
                    >{`$${order.totalAmount}`}</Tag>
                  }
                  style={{ width: 400 }}
                >
                  <Timeline>
                    <Timeline.Item
                      dot={
                        <ClockCircleOutlined
                          style={{ fontSize: '16px' }}
                          rev={undefined}
                        />
                      }
                    >
                      {new Date(order.rentalStartDate).toLocaleDateString()}
                    </Timeline.Item>
                    <Timeline.Item
                      dot={
                        <DollarOutlined
                          style={{ fontSize: '16px' }}
                          rev={undefined}
                        />
                      }
                    >
                      Total: {formatToEuro(order.totalAmount)}
                    </Timeline.Item>
                    <Timeline.Item
                      dot={
                        <ClockCircleOutlined
                          style={{ fontSize: '16px' }}
                          rev={undefined}
                        />
                      }
                    >
                      {new Date(order.rentalEndDate).toLocaleDateString()}
                    </Timeline.Item>
                  </Timeline>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
