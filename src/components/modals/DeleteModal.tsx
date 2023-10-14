import React, { useState } from 'react';
import { Modal } from 'antd';
import Image from 'next/image';

// icons
import DeleteIcon from '@/components/icons/DeleteIcon';

const DeleteModal = () => {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={showModal}
        type="button"
        className="flex items-center gap-2 text-danger-base hover:opacity-80"
      >
        <DeleteIcon />
        <span>Delete</span>
      </button>

      <Modal
        className="remove-close"
        onCancel={hideModal}
        width={320}
        open={open}
        centered
        footer={false}
      >
        <div className="text-center">
          <div className="relative bg-gray-50 rounded-3xl mx-auto w-32 h-32 mb-5">
            <Image
              fill
              className="rounded-3xl"
              src="/assets/reject-car-image.svg"
              alt=".."
            />
          </div>
          <h6 className="mb-2 text-base font-bold text-neutral-100">
            Do you want to delete this car?
          </h6>
          <p className="text-sm font-normal text-neutral-75">
            Please confirm that you want to proceed with the deletion by
            clicking the delete button below
          </p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={hideModal}
              type="button"
              className="btn-outline-primary w-full"
            >
              <span className="text-base font-bold">Cancel</span>
            </button>
            <button
              onClick={handleDelete}
              type="button"
              className="btn-primary w-full"
            >
              <span className="text-base font-bold">Delete</span>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DeleteModal;
