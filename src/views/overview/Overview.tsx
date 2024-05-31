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
import Image from 'next/image';
import { cn } from '@/utils/cn';

const StatisticCard: React.FC<{
  title: string;
  value?: number | string | null;
  icon?: string;
  isLoading?: boolean;
  valueStyle?: React.CSSProperties;
  prefix?: React.ReactNode;
}> = ({ title, value, isLoading, valueStyle, prefix, icon }) =>
  isLoading && !value ? (
    <Card className="">
      <Skeleton active />
    </Card>
  ) : (
    // <Statistic
    //   title={title}
    //   value={value as number | string}
    //   valueStyle={valueStyle}
    //   prefix={prefix}
    // />
    <div
      className={cn(
        'flex gap-2 justify-between bg-primary-base text-white p-4 rounded-lg',
        { 'bg-danger-base': value === 0 },
      )}
    >
      <div className="flex flex-col">
        <span className="text-lg">{value}</span>
        <h2 className="text-base whitespace-nowrap">{title}</h2>
      </div>
      <div
        className={cn(
          'aspect-square bg-transparent bg-white bg-opacity-20 rounded-xl flex justify-center items-center',
        )}
      >
        <div
          className={cn(
            'bg-primary-base bg-transparent bg-opacity-80 p-2 px-3 rounded-xl aspect-square w-full h-full',
          )}
        >
          <Image
            className="w-full h-full aspect-square"
            width={16}
            height={16}
            alt="image"
            src={icon ?? '/doc.svg'}
          />
        </div>
      </div>
    </div>
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

  const grid = [
    {
      title: 'Orders',
      rows: [
        {
          title: 'Alle orders',
          value: overview?.totals.orders,
          icon: '/doc.svg',
          link: '/dashboard/orders',
        },
        { title: 'Actieve orders', value: 0, icon: '/car-key.svg' },
        {
          title: 'Orders geannuleerd',
          value: overview?.totals.ordersRejection,
          icon: '/close.svg',
        },
        { title: 'Orders in behandeling', value: 0, icon: '/clock.svg' },
      ],
    },
    {
      title: 'Auto’s',
      rows: [
        {
          title: 'Alle auto’s',
          value: overview?.totals.vehicles,
          icon: '/car2.svg',
          link: '/dashboard/vehicles',
        },
        { title: 'Auto’s te huur', value: 0, icon: '/clock.svg' },
        { title: 'Actieve auto’s', value: 0, icon: '/car-key.svg' },
        { title: "Auto's in behandeling", value: 0, icon: '/car-key.svg' },
      ],
    },
    {
      title: 'Verhuurders',
      rows: [
        { title: 'Alle verhuurders', value: 0, icon: '/people.svg' },
        { title: 'Verhuurders actief', value: 0, icon: '/people.svg' },
        { title: 'Verhuurders geannuleerd', value: 0, icon: '/close.svg' },
        { title: 'Verhuurders in behandeling', value: 0, icon: '/close.svg' },
      ],
    },
    {
      title: 'Bestuurders',
      rows: [
        {
          title: 'Alle bestuurders',
          value: overview?.totals.drivers,
          icon: '/smile.svg',
        },
        { title: 'Actieve bestuurders', value: 0, icon: '/smile.svg' },
        { title: 'Bestuurders geannuleerd', value: 0, icon: '/close.svg' },
        {
          title: 'Bestuurders in behandeling',
          value: overview?.totals.pendingDrivers,
          icon: '/clock.svg',
        },
      ],
    },
    {
      title: 'Schaderapporten',
      rows: [
        { title: 'Alle schaderapporten', value: 0, icon: '/doc2.svg' },
        { title: 'Schaderapporten geanuleerd ', value: 0, icon: '/doc2.svg' },
        {
          title: 'Schaderapporten in behandeling',
          value: 0,
          icon: '/close.svg',
        },
      ],
    },
    {
      title: 'Uitbetalingen',
      rows: [
        { title: 'Alle uitbetalingen', value: 0, icon: '/eur1.svg' },
        { title: 'Uitbetalingen gestort', value: 0, icon: '/eur2.svg' },
        { title: 'Uitbetalingen geanuleerd', value: 0, icon: '/eur2.svg' },
      ],
    },
    {
      title: 'Stortingen',
      rows: [
        { title: 'Alle stortingen', value: 0, icon: '/eur3.svg' },
        { title: 'Storting verhuurders', value: 0, icon: '/eur3.svg' },
        { title: 'Stortingen bestuurders', value: 0, icon: '/eur3.svg' },
        { title: 'Storting geanuleerd', value: 0, icon: '/close.svg' },
      ],
    },
    {
      title: 'Gebruikers',
      rows: [
        { title: 'Alle gebruikers', value: 0, icon: '/key.svg' },
        { title: 'Nieuwe Gebruikers', value: 0, icon: '/key.svg' },
        { title: 'Actieve gebruikers', value: 0, icon: '/key.svg' },
        { title: 'Gebruikers geanuleerd', value: 0, icon: '/close.svg' },
      ],
    },
  ];

  return (
    <div className="p-5 flex flex-col gap-6">
      {grid.map((el, index) => {
        const rows = el.rows;
        return (
          <div key={index}>
            <h1 className="mb-2 font-semibold">{el.title}</h1>
            <div className="flex gap-3">
              {rows.map((row) => {
                const card = (
                  <div className="min-w-[250px]" key={row.title}>
                    <StatisticCard
                      title={row.title}
                      value={row.value}
                      isLoading={loading}
                      icon={row.icon}
                    />
                  </div>
                );
                const link = row.link;
                if (!link) return card;
                return (
                  <Link key={row.title} href={link}>
                    {card}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Last changes */}
      {/* <Row gutter={[16, 16]}>
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
      </Row> */}

      {/* <div>
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
      </div> */}
    </div>
  );
};

export default Overview;
