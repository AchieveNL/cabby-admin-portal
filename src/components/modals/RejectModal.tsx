import React, { useState } from 'react';
import { Modal } from 'antd';
import Image from 'next/image';

// icons
import CrossIcon from '@/components/icons/CrossIcon';

const RejectModal = ({
  handleRejectBtn,
  carId,
}: {
  handleRejectBtn: any;
  carId: any;
}) => {
  const [open, setOpen] = useState(false);
  const [feedBack, setFeedBack] = useState(false);
  const [reason, setReason] = useState('');

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const handleReject = () => {
    setFeedBack(true);
    setOpen(false);
  };

  const handleCloseFeedback = () => {
    setFeedBack(false);
  };

  const handleSendFeedback = () => {
    setFeedBack(false);
    handleRejectBtn(carId, reason);
  };

  return (
    <>
      <button
        onClick={showModal}
        type="button"
        className="flex items-center gap-2 text-danger-base hover:opacity-80"
      >
        <CrossIcon />
        <span>Reject</span>
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
            Do you want to reject this car?
          </h6>
          <p className="text-sm font-normal text-neutral-75">
            Give reasons why you are reject the request
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
              onClick={handleReject}
              type="button"
              className="btn-primary w-full"
            >
              <span className="text-base font-bold">Reject</span>
            </button>
          </div>
        </div>
      </Modal>
      {/* input modal */}
      <Modal
        className="remove-close"
        onCancel={handleCloseFeedback}
        open={feedBack}
        centered
        footer={false}
      >
        <div className="text-center">
          <p className="mb-4 text-sm font-normal text-neutral-75">
            Give reasons why you are reject the request
          </p>
          <textarea
            className="w-full bg-neutral-10 p-3 rounded font-medium text-base placeholder:text-neutral-50"
            placeholder="Type here"
            rows={10}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleCloseFeedback}
              type="button"
              className="btn-outline-primary w-full"
            >
              <span className="text-base font-bold">Cancel</span>
            </button>
            <button
              onClick={handleSendFeedback}
              type="button"
              className="btn-primary w-full"
            >
              <span className="text-base font-bold">Send</span>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RejectModal;
