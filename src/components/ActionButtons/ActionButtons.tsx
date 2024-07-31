import React, { useState } from 'react';
import { Space } from 'antd';
import ButtonWithIcon from '../buttons/buttons';
import CheckOutlined from '@ant-design/icons/CheckOutlined';
import { CloseOutlined } from '@ant-design/icons';
import ConfirmationModal from '../modals/ConfirmationModal';
import RejectionModal from '../modals/RejectionModal';
import { invalidateOrders } from '@/api/orders/orders';
import DefaultModal from '../modals/DefautlModal';

interface Props {
  onApprove?: (id: string) => Promise<void>;
  onRejectReason?: (id: string, reason: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
  recordId: string;
  confirmationMessage: string;
  fullWidth?: boolean;
  cancelPlaceholder?: string;
}

export default function ActionButtons({
  onApprove,
  onRejectReason,
  recordId,
  confirmationMessage,
  onReject,
  onCancel,
  fullWidth,
  cancelPlaceholder,
}: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRejectReason, setShowRejectReason] = useState(false);

  const handleConfirm = async () => {
    if (onReject) {
      await onReject(recordId);
      setShowConfirm(false);
      setShowRejectReason(true);
    } else if (onCancel) {
      onCancel(recordId);
      setShowConfirm(false);
    }
  };

  const handleRejectReasonSubmit = async (reason: string) => {
    if (onRejectReason) {
      await onRejectReason(recordId, reason);
      setShowRejectReason(false);
    }
  };

  return (
    <>
      {onApprove && (
        <DefaultModal
          confirmPlaceholder="Bevestigen"
          title="Wilt u deze bestuurder bevestigen?"
          fn={() => onApprove(recordId)}
          button={
            <ButtonWithIcon
              icon={<CheckOutlined rev={undefined} />}
              className="text-success-base hover:text-success-light-2 hover:bg-success-base px-2 py-1 rounded-lg"
            >
              Bevestigen
            </ButtonWithIcon>
          }
        >
          <>
            Als u deze bestuurder bevestigt gaat de bestuurder naar
            <strong className="ml-2">Bevestigd</strong>.
          </>
        </DefaultModal>
      )}
      {onReject && (
        <ButtonWithIcon
          icon={<CloseOutlined rev={undefined} />}
          className="text-danger-base hover:text-danger-light-2 hover:bg-danger-base px-2 py-1 rounded-lg"
          onClick={() => {
            setShowConfirm(true);
          }}
        >
          Afwijzen
        </ButtonWithIcon>
      )}
      {onCancel && (
        <ButtonWithIcon
          icon={<CloseOutlined rev={undefined} />}
          className="text-danger-base hover:text-danger-light-2 hover:bg-danger-base px-2 py-1 rounded-lg"
          onClick={() => {
            setShowConfirm(true);
          }}
        >
          Cancel
        </ButtonWithIcon>
      )}

      <ConfirmationModal
        confirmationPlaceholder="Order annuleren"
        open={showConfirm}
        hideModal={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        confirmationMessage={confirmationMessage}
        paragraph="Geef redenen waarom je deze bestuurder wilt afwijzen"
      />

      <RejectionModal
        open={showRejectReason}
        hideModal={() => setShowRejectReason(false)}
        onSubmit={handleRejectReasonSubmit}
        title='Geef redenen waarom u het verzoek afwijst. Als u dat gedaan heeft gaat de order naar "Afgewezen".'
      />
    </>
  );
}
