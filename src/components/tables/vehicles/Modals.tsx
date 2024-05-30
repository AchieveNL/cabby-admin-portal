import { VehicleStatus } from '@/api/vehicles/types';
import { deleteVehicle, updateVehicleStatus } from '@/api/vehicles/vehicles';
import ButtonWithIcon from '@/components/buttons/buttons';
import DeleteIcon from '@/components/icons/DeleteIcon';
import DefaultModal from '@/components/modals/DefautlModal';
import { CheckOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';

export const VehicleDeleteModal = ({ id }: { id: string }) => {
  return (
    <DefaultModal
      fn={async () => {
        await deleteVehicle(id);
        message.success('Vehicle deleted successfully');
      }}
      confirmPlaceholder="Verwijder"
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

export const VehicleConfirmModal = ({ id }: { id: string }) => {
  return (
    <DefaultModal
      confirmPlaceholder="Bevestigen"
      title="Wilt u deze bestuurder bevestigen?"
      fn={() => updateVehicleStatus(id, VehicleStatus.ACTIVE)}
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
  );
};

export const VehicleRecoverModal = ({ id }: { id: string }) => {
  return (
    <DefaultModal
      title="Wil je zeker dat je deze bestuurder wilt deblokeren?"
      button={
        <Button
          type="text"
          color="green"
          className="flex items-center text-success-base hover:bg-success-base"
        >
          <ReloadOutlined rev={undefined} /> herstellen
        </Button>
      }
      confirmPlaceholder="Verder"
      fn={async () => {
        await updateVehicleStatus(id, VehicleStatus.PENDING);
        message.success('Driver on pending successfully');
      }}
    >
      Zodra je verdergaat, wordt de bestuurder gedeblokkeerd en kan diegene de
      app weer gebruiken.
    </DefaultModal>
  );
};
