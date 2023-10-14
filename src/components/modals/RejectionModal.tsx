/* eslint-disable @next/next/no-img-element */
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

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(value);
    setValue(''); // Reset the textarea
  };

  return (
    <Modal
      onCancel={hideModal}
      width={500}
      visible={open}
      centered
      footer={false}
    >
      <div className="text-center">
        <div className="relative bg-gray-50 rounded-3xl mx-auto w-32 h-32 mb-5">
          <img
            className="rounded-3xl"
            src="/assets/reject-car-image.svg"
            alt=".."
          />
        </div>
        <p className="text-sm font-normal text-neutral-75">{title}</p>
        <TextArea rows={4} onChange={handleOnChange} value={value} />
        <div className="mt-6 flex gap-3">
          <button
            onClick={hideModal}
            type="button"
            className="btn-outline-primary w-full"
          >
            <span className="text-base font-bold">Cancel</span>
          </button>
          <button
            onClick={handleSubmit}
            type="button"
            className="btn-primary w-full"
          >
            <span className="text-base font-bold">Reject</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RejectionModal;
