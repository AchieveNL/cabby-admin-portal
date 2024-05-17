import { useGetDeposit } from '@/api/vehicles/hooks';
import { upsertDeposit } from '@/api/vehicles/vehicles';
import { Button, Card, InputNumber, message } from 'antd';
import React, { FormEvent, useEffect, useState } from 'react';

const Settings = () => {
  const [deposit, setDeposit] = useState<number | null>(null);
  const { data } = useGetDeposit();
  useEffect(() => setDeposit(Number(data) || null), [data]);

  async function changeDeposit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await upsertDeposit({ value: deposit as number });
    message.success('Settings updated successfully');
  }
  return (
    <div className="grid grid-cols-2">
      <Card className="flex flex-col m-2">
        <h1 className="text-primary-base text-xl font-poppins">
          Financiële details
        </h1>
        <form onSubmit={changeDeposit} className="flex flex-col">
          <label htmlFor="deposit">Borg</label>
          <InputNumber
            value={deposit}
            onChange={(e) => setDeposit(e)}
            addonAfter="€"
            min={0}
            id="deposit"
            className="w-full py-2"
          />
          <Button
            htmlType="submit"
            onClick={changeDeposit}
            className="w-full bg-primary-base text-white mt-2"
          >
            Save
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Settings;
