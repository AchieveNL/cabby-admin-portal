import { useAllDrivers } from '@/api/drivers/hooks';
import { createOrderAdmin } from '@/api/orders/orders';
import { useAllVehicles } from '@/api/vehicles/hooks';
import { dayjsExtended } from '@/utils/date';
import { Button, DatePicker, Form, FormProps, Input, Select } from 'antd';
import React from 'react';

type Props = {};

type FieldType = {
  vehicleId: string;
  driverId: string;
  range: [Date, Date];
};

const CreateOrder = (props: Props) => {
  const { data: drivers = [] } = useAllDrivers();
  const driversOptions = drivers.map((el) => ({
    label: el.fullName,
    value: el.userId,
  }));
  const { data: vehicles = [] } = useAllVehicles();
  const vehiclesOptions = vehicles.map((el) => ({
    label: el.model,
    value: el.id,
  }));

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const data = {
      ...values,
      rentalStartDate: values.range[0],
      rentalEndDate: values.range[1],
    };
    await createOrderAdmin(data);
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo,
  ) => {
    console.log('Failed:', errorInfo);
  };

  const range = (start: number, end: number) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  const disabledDateTime = () => ({
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56],
  });
  return (
    <div className="bg-white border border-gray-300 rounded-xl p-6 m-2">
      <h1 className="text-xl font-normal mb-4">Create Order</h1>
      <Form
        // name="basic"
        // labelCol={{ span: 2 }}
        // wrapperCol={{ span: 16 }}
        // style={{ maxWidth: 600 }}
        // initialValues={{ remember: true }}
        // autoComplete="off"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="grid grid-cols-2 gap-3"
        layout="vertical"
      >
        <Form.Item<FieldType>
          label="Bestuurder"
          name="userId"
          rules={[{ required: true, message: 'Is required' }]}
        >
          <Select size="large" options={driversOptions} />
        </Form.Item>
        <Form.Item<FieldType>
          label="Auto"
          name="vehicleId"
          rules={[{ required: true, message: 'Is required' }]}
        >
          <Select size="large" options={vehiclesOptions} />
        </Form.Item>
        <Form.Item<FieldType>
          label="Range"
          name="range"
          rules={[{ required: true, message: 'Is required' }]}
        >
          <DatePicker.RangePicker
            size="large"
            minDate={dayjsExtended()}
            showSecond={false}
            showTime
            className="w-full"
          />
        </Form.Item>
        <Form.Item className="col-span-full">
          <Button className="w-full" type="primary" htmlType="submit">
            create
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateOrder;
