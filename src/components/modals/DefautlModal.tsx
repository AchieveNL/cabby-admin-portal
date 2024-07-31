import React, { useState } from 'react';
import { Modal, message } from 'antd';
import Image from 'next/image';

// icons
import DeleteIcon from '@/components/icons/DeleteIcon';

interface Props {
  confirmPlaceholder?: string;
  title: string;
  fn: () => Promise<void>;
  children?: React.ReactNode;
  button: React.ReactNode;
  icon?: string;
}

const DefaultModal = ({
  fn,
  children,
  confirmPlaceholder,
  button,
  title,
  icon = '/assets/modal/success.svg',
}: Props) => {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    try {
      await fn();
      setOpen(false);
      message.success('Successfully');
    } catch (error) {
      message.error('Error');
    }
  };

  return (
    <>
      <div onClick={showModal}>{button}</div>
      <Modal
        className="remove-close"
        onCancel={hideModal}
        width={500}
        open={open}
        centered
        footer={false}
      >
        <div className="text-center">
          <div className="relative rounded-3xl mx-auto w-32 h-32 mb-5">
            <Image fill className="rounded-3xl" src={icon} alt=".." />
          </div>
          <h6 className="mb-2 text-base font-bold text-neutral-100">
            {title ?? 'Title'}
          </h6>
          <p className="text-sm font-normal text-neutral-75">{children}</p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={hideModal}
              type="button"
              className="btn-outline-primary w-full"
            >
              <span className="text-base font-bold">Annuleren</span>
            </button>
            <button
              onClick={handleConfirm}
              type="button"
              className="btn-primary w-full"
            >
              <span className="text-base font-bold">
                {confirmPlaceholder ?? 'Bevestigen'}
              </span>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DefaultModal;
