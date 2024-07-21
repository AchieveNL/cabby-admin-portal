import React from 'react';
import {
  Card,
  Descriptions,
  Avatar,
  Image,
  Tag,
  Timeline,
  Spin,
  Alert,
} from 'antd';
import { useOrderDetails } from '@/api/orders/hooks';
import { useRouter } from 'next/router';
import { OrderStatus } from '@/api/orders/types';
import dayjs from 'dayjs';
import { currencyFormatter } from '@/common/utits';
import { dayjsExtended } from '@/utils/date';

const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'gold';
    case OrderStatus.CONFIRMED:
      return 'green';
    case OrderStatus.REJECTED:
    case OrderStatus.CANCELED:
      return 'red';
    case OrderStatus.COMPLETED:
      return 'blue';
    default:
      return 'gray';
  }
};

export default function OrderDetails() {
  const router = useRouter();
  const { orderId } = router.query;
  const {
    data: order,
    loading,
    error,
  } = useOrderDetails(orderId as string | undefined);

  const formatDate = (date: string) =>
    dayjsExtended(date).format('DD/MM/YYYY • HH:mm');

  return (
    <div>
      {order ? (
        <Card bordered={false} style={{ margin: '16px' }}>
          <Descriptions title="User Information" bordered column={2}>
            <Descriptions.Item label="Profile Photo">
              <Avatar src={order.user.profile?.profilePhoto} />
            </Descriptions.Item>
            <Descriptions.Item label="Full Name">
              {order.user.profile?.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Phone Number">
              {order.user.profile?.phoneNumber}
            </Descriptions.Item>
            <Descriptions.Item label="City">
              {order.user.profile?.city}
            </Descriptions.Item>
            <Descriptions.Item label="Full Address">
              {order.user.profile?.fullAddress}
            </Descriptions.Item>
            <Descriptions.Item label="Zip">
              {order.user.profile?.zip}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions
            title="Vehicle Information"
            bordered
            column={2}
            style={{ marginTop: '16px' }}
          >
            <Descriptions.Item label="Logo">
              <Image
                width={50}
                src={order.vehicle.logo || '/fallback-image.png'}
                alt="..."
              />
            </Descriptions.Item>
            <Descriptions.Item label="Company Name">
              {order.vehicle.companyName}
            </Descriptions.Item>
            <Descriptions.Item label="Model">
              {order.vehicle.model}
            </Descriptions.Item>
            <Descriptions.Item label="Manufacture Year">
              {order.vehicle.manufactureYear}
            </Descriptions.Item>
            <Descriptions.Item label="Engine Type">
              {order.vehicle.engineType}
            </Descriptions.Item>
            <Descriptions.Item label="Seating Capacity">
              {order.vehicle.seatingCapacity}
            </Descriptions.Item>
            <Descriptions.Item label="Battery Capacity">
              {order.vehicle.batteryCapacity}
            </Descriptions.Item>
            <Descriptions.Item label="Rental Duration">
              {order.vehicle.rentalDuration}
            </Descriptions.Item>
            <Descriptions.Item label="Vin">
              {order.vehicle.vin}
            </Descriptions.Item>
            <Descriptions.Item label="Availability">
              <Tag
                color={
                  order.vehicle.availability === 'available' ? 'green' : 'red'
                }
              >
                {order.vehicle.availability || 'Unknown'}
              </Tag>
            </Descriptions.Item>
          </Descriptions>

          <Descriptions
            title="Order Information"
            bordered
            column={2}
            style={{ marginTop: '16px' }}
          >
            <Descriptions.Item label="Order ID">{order.id}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={getStatusColor(order.status)}>{order.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Total Amount">
              {currencyFormatter.format(order.totalAmount)}
            </Descriptions.Item>
            <Descriptions.Item label="Rental Start Date">
              {formatDate(order.rentalStartDate)}
            </Descriptions.Item>
            <Descriptions.Item label="Rental End Date">
              {formatDate(order.rentalEndDate)}
            </Descriptions.Item>
            <Descriptions.Item label="Note">
              {order.note || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {formatDate(order.createdAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {formatDate(order.updatedAt)}
            </Descriptions.Item>
          </Descriptions>

          <Timeline mode="alternate" style={{ marginTop: '16px' }}>
            <Timeline.Item label="Ordered">
              {formatDate(order.createdAt)}
            </Timeline.Item>
            {order.status === OrderStatus.CONFIRMED && (
              <Timeline.Item color="green" label="Confirmed">
                {formatDate(order.updatedAt)}
              </Timeline.Item>
            )}
            {order.status === OrderStatus.REJECTED && (
              <Timeline.Item color="red" label="Rejected">
                {formatDate(order.updatedAt)}
              </Timeline.Item>
            )}
            {order.status === OrderStatus.CANCELED && (
              <Timeline.Item color="red" label="Canceled">
                {formatDate(order.updatedAt)}
              </Timeline.Item>
            )}
            {order.status === OrderStatus.COMPLETED && (
              <Timeline.Item color="blue" label="Completed">
                {formatDate(order.updatedAt)}
              </Timeline.Item>
            )}
            <Timeline.Item color="green" label="Rental Starts">
              {formatDate(order.rentalStartDate)}
            </Timeline.Item>
            <Timeline.Item color="red" label="Rental Ends">
              {formatDate(order.rentalEndDate)}
            </Timeline.Item>
          </Timeline>
        </Card>
      ) : loading ? (
        <Spin tip="Loading order details..." />
      ) : error ? (
        <Alert
          message="Error"
          description="Failed to load order details."
          type="error"
        />
      ) : null}
    </div>
  );
}
