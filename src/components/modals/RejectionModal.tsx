/* eslint-disable @next/next/no-img-element */
import { invalidateOrders } from '@/api/orders/orders';
import { Modal, Input } from 'antd';
import React, { useState } from 'react';

const { TextArea } = Input;

interface Props {
  open: boolean;
  hideModal: () => void;
  onSubmit: (value: string) => void;
  title: string;
}

const RejectionModal: React.FC<Props> = ({
  open,
  hideModal,
  onSubmit,
  title,
}) => {
  const [value, setValue] = useState('');

  async function close() {
    hideModal();
    await invalidateOrders();
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = async () => {
    await onSubmit(value);
    setValue(''); // Reset the textarea
    await invalidateOrders();
  };

  return (
    <Modal onCancel={close} width={500} visible={open} centered footer={false}>
      <div className="text-center">
        <div className="relative bg-gray-50 rounded-3xl mx-auto w-32 h-32 mb-5">
          <img
            className="rounded-3xl"
            src="/assets/reject-car-image.svg"
            alt=".."
          />
        </div>
        <p className="text-sm font-normal text-neutral-75">{title}</p>
        <TextArea
          placeholder="typ hier"
          rows={4}
          onChange={handleOnChange}
          value={value}
        />
        <div className="mt-6 flex gap-3">
          <button
            onClick={close}
            type="button"
            className="btn-outline-primary w-full"
          >
            <span className="text-base font-bold">Annuleren</span>
          </button>
          <button
            onClick={handleSubmit}
            type="button"
            className="btn-primary w-full"
          >
            <span className="text-base font-bold">Verzenden</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RejectionModal;
