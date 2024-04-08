import React, { useState } from 'react';
import { Space } from 'antd';
import ButtonWithIcon from '../buttons/buttons';
import CheckOutlined from '@ant-design/icons/CheckOutlined';
import { CloseOutlined } from '@ant-design/icons';
import ConfirmationModal from '../modals/ConfirmationModal';
import RejectionModal from '../modals/RejectionModal';

interface Props {
  onApprove?: (id: string) => void;
  onRejectReason?: (id: string, reason: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
  recordId: string;
  confirmationMessage: string;
  fullWidth?: boolean;
}

export default function ActionButtons({
  onApprove,
  onRejectReason,
  recordId,
  confirmationMessage,
  onReject,
  onCancel,
  fullWidth,
}: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRejectReason, setShowRejectReason] = useState(false);

  const handleConfirm = () => {
    if (onReject) {
      onReject(recordId);
      setShowConfirm(false);
      setShowRejectReason(true);
    }
    else if (onCancel) {
      onCancel(recordId);
      setShowConfirm(false);
    }
  };

  const handleRejectReasonSubmit = (reason: string) => {
    if (onRejectReason) {
      onRejectReason(recordId, reason);
      setShowRejectReason(false);
    }
  };

  return (
    <Space size="middle">
      {onApprove && (
        <ButtonWithIcon
          icon={<CheckOutlined rev={undefined} />}
          style={{ color: 'green' }}
          onClick={() => onApprove(recordId)}
          block={fullWidth}
        >
          Approve
        </ButtonWithIcon>
      )}
      {onReject && (
        <ButtonWithIcon
          icon={<CloseOutlined rev={undefined} />}
          danger
          onClick={() => {
            setShowConfirm(true);
          }}
          block={fullWidth}
        >
          Reject
        </ButtonWithIcon>
      )}
      {onCancel && (
        <ButtonWithIcon
          icon={<CloseOutlined rev={undefined} />}
          danger
          onClick={() => {
            setShowConfirm(true);
          }}
          block={fullWidth}
        >
          Cancel
        </ButtonWithIcon>
      )}

      <ConfirmationModal
        open={showConfirm}
        hideModal={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        confirmationMessage={confirmationMessage}
      />

      <RejectionModal
        open={showRejectReason}
        hideModal={() => setShowRejectReason(false)}
        onSubmit={handleRejectReasonSubmit}
        title="Please provide the reason for rejection."
      />
    </Space>
  );
}
