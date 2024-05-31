import { changeOrderStatus, deleteOrder } from '@/api/orders/orders';
import ButtonWithIcon from '@/components/buttons/buttons';
import CheckIcon from '@/components/icons/CheckIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import DefaultModal from '@/components/modals/DefautlModal';

export const OrderDeleteModal = ({ id }: { id: string }) => {
  return (
    <DefaultModal
      fn={() => deleteOrder(id)}
      // confirmPlaceholder="Verwijderen"
      title="Verwijderen"
      button={
        <ButtonWithIcon
          icon={<DeleteIcon />}
          className="bg-danger-base px-2 py-1 text-danger-light-2 rounded-lg"
        >
          Verwijderen
        </ButtonWithIcon>
      }
    ></DefaultModal>
  );
};

export const OrderRecoverModal = ({ id }: { id: string }) => {
  return (
    <DefaultModal
      fn={() => changeOrderStatus(id, 'PENDING')}
      // confirmPlaceholder="Verwijderen"
      title="Herstellen"
      button={
        <ButtonWithIcon
          icon={<CheckIcon />}
          className="bg-success-base px-2 py-1 text-success-light-2 rounded-lg"
        >
          Herstellen
        </ButtonWithIcon>
      }
    ></DefaultModal>
  );
};
