import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Input, InputNumber, Button, Select, notification } from 'antd';
import { useAllVehicles } from '@/api/vehicles/hooks';
import { createDamageReports } from '@/api/damage-reports/damage-reports';
import { CreateDamageReportDto } from '@/api/damage-reports/types';

const { Option } = Select;

const CreateDamageReport = () => {
  const router = useRouter();
  const { data: vehicles, isLoading: vehiclesLoading } = useAllVehicles();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: CreateDamageReportDto) => {
    try {
      setLoading(true);
      await createDamageReports(values as CreateDamageReportDto);

      notification.success({
        message: 'Success',
        description: 'Damage Report Successfully Created',
      });

      // Optionally navigate to another page, or do something else
      router.push('/dashboard/damage-reports');
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'There was an error creating the damage report.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>
        Create Damage Report
      </h1>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Vehicle"
          name="vehicleId"
          rules={[{ required: true, message: 'Please select a vehicle!' }]}
        >
          <Select loading={vehiclesLoading} placeholder="Select a vehicle">
            {vehicles?.map((vehicle) => (
              <Option key={vehicle.id} value={vehicle.id}>
                {vehicle.model} - {vehicle.companyName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please input the description!' }]}
        >
          <Input.TextArea placeholder="Describe the damage" />
        </Form.Item>
        <Form.Item label="Estimated damage cost (EUR)" name="amount">
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            placeholder="Enter the amount"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateDamageReport;
