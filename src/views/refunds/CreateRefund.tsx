import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, Select, message } from 'antd';
import { useRouter } from 'next/router';
import { useCreateRefund } from '@/api/refunds/hooks';
import { RefundInput } from '@/api/refunds/types';
import { useAllDrivers } from '@/api/drivers/hooks';

const initialRefundData: RefundInput = {
  userProfileId: '',
  amount: '',
};

const CreateRefund: React.FC = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { create, loading: isCreating } = useCreateRefund();
  const { data: drivers, loading: driversLoading } = useAllDrivers();

  const handleCreateRefund = async (values: any) => {
    try {
      await create(values);
      message.success('Refund created successfully');
      router.push('/dashboard/refunds');
    } catch (error) {
      message.error('Failed to create refund');
    }
  };

  return (
    <div className="p-8">
      <Form form={form} layout={'vertical'} onFinish={handleCreateRefund}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="userProfileId"
              label="User Profile"
              rules={[
                { required: true, message: 'Please select a user profile!' },
              ]}
            >
              <Select
                showSearch
                loading={driversLoading}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option?.children?.[0]
                    ?.toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {drivers.map((driver) => (
                  <Select.Option key={driver.id} value={driver.id}>
                    {driver.fullName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="amount"
              label="Amount"
              rules={[
                { required: true, message: 'Please input the refund amount!' },
              ]}
            >
              <Input prefix="€" type="number" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isCreating}>
            Create Refund
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateRefund;
