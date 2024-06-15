import React, { useState } from 'react';
import { Modal, Radio, Table, message } from 'antd';
import { Driver, DriverStatus, UserProfileStatus } from '@/api/drivers/types';
import { useDriversByStatus, useUpdateDriverStatus } from '@/api/drivers/hooks';
import { DriverLicense, PermitDetails } from '@/api/orders/types';
import DefaultModal from '@/components/modals/DefautlModal';
import { ExportOutlined, ReloadOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { deleteDriver, updateDriverStatus } from '@/api/drivers/drivers';
import DeleteIcon from '@/components/icons/DeleteIcon';
import dayjs from 'dayjs';
import ButtonWithIcon from '@/components/buttons/buttons';
import ActionButtons from '@/components/ActionButtons/ActionButtons';
import { useRouter } from 'next/router';
import BlockIcon from '@/components/icons/BlockIcon';

const useDriversColumns = ({ status }: { status: DriverStatus }) => {
  const router = useRouter();
  const { updateStatus } = useUpdateDriverStatus();
  const [isBlockModalVisible, setIsBlockModalVisible] = useState(false);
  const [blockReason, setBlockReason] = useState('');

  const handleApprove = async (id: string) => {
    try {
      await updateStatus(id, UserProfileStatus.ACTIVE);
      message.success('Driver approved successfully');
    } catch (error) {
      message.error('Failed to approve the driver');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateStatus(id, UserProfileStatus.REJECTED);
      message.success('Driver rejected successfully');
    } catch (error) {
      message.error('Failed to reject the driver');
    }
  };

  const onSubmitRejectReason = async (id: string, reason: string) => {
    // Depending on your API and how you handle rejections with reasons,
    // this may differ. If you have a separate API call for submitting the
    // rejection reason, call it here. For now, I'm just logging the reason.
    console.log('Reason for rejection:', reason);
    await handleReject(id); // You can choose to directly update status or perform additional operations based on the reason
  };

  const showBlockModal = () => {
    setIsBlockModalVisible(true);
  };

  const handleBlockWithReason = async (reason: string, driverId: string) => {
    try {
      console.log('Blocking reason:', reason);
      // Here, you can make an API call to submit the reason
      await updateStatus(driverId, UserProfileStatus.BLOCKED, reason);
      message.success('Driver blocked successfully');
    } catch (error) {
      message.error('Failed to block the driver');
    }
  };

  const handleBlockModalOk = async (driverId: string) => {
    setIsBlockModalVisible(false);
    await handleBlockWithReason(blockReason, driverId);
  };

  const handleBlockModalCancel = () => {
    setIsBlockModalVisible(false);
  };

  const handleBlock = () => {
    showBlockModal();
  };

  return [
    {
      title: 'Bestuurder(s)',
      dataIndex: 'fullName',
      render: (text: string) => <span>{text ? text : 'Not Available'}</span>,
    },
    {
      title: 'KVK ID',
      dataIndex: 'permitDetails',
      render: (permitDetails: PermitDetails) => (
        <span>
          {permitDetails && permitDetails.kvkDocumentId
            ? permitDetails.kvkDocumentId
            : 'Not Available'}
        </span>
      ),
    },
    {
      title: 'Chauffeurspas',
      dataIndex: 'permitDetails',
      render: (permitDetails: PermitDetails) => (
        <span className="uppercase">
          {permitDetails && permitDetails.taxiPermitId
            ? permitDetails.taxiPermitId
            : 'Not Available'}
        </span>
      ),
    },
    {
      title: 'KIWA taxivergunning',
      dataIndex: 'permitDetails',
      render: (permitDetails: PermitDetails) => (
        <span className="uppercase">
          {permitDetails && permitDetails.kiwaTaxiVergunningId
            ? permitDetails.kiwaTaxiVergunningId
            : 'Not Available'}
        </span>
      ),
    },
    {
      title: 'Rijbewijs',
      dataIndex: 'driverLicense',
      render: (driverLicense: DriverLicense) => (
        <span>
          {driverLicense && driverLicense.bsnNumber
            ? driverLicense.bsnNumber
            : 'Not Available'}
        </span>
      ),
    },
    {
      title: 'Verlopen op',
      dataIndex: 'driverLicense',
      render: (driverLicense: DriverLicense) => (
        <span>
          {driverLicense && driverLicense.driverLicenseExpiry
            ? dayjs(driverLicense.driverLicenseExpiry).format('DD-MM-YYYY')
            : 'Not Available'}
        </span>
      ),
    },
    {
      title: 'Details',
      dataIndex: 'id',
      render: (id: string) => (
        <Link href={`/dashboard/drivers/${id}`}>Details</Link>
      ),
    },
    {
      title: 'Actie',
      dataIndex: 'id',
      render: (id: string, record: Driver) => {
        const userId = record.userId;
        const driverId = record.id;
        return (
          <div className="flex gap-2 items-center">
            {['REJECTED', 'BLOCKED'].includes(status) && (
              <DefaultModal
                title="Wil je zeker dat je deze bestuurder wilt deblokeren?"
                button={
                  <button className="flex items-center gap-1 text-success-base">
                    <ReloadOutlined rev={undefined} /> herstellen
                  </button>
                }
                confirmPlaceholder="Verder"
                fn={async () => {
                  await updateDriverStatus(id, UserProfileStatus.PENDING);
                  message.success('Driver on pending successfully');
                }}
              >
                Zodra je verdergaat, wordt de bestuurder gedeblokkeerd en kan
                diegene de app weer gebruiken.
              </DefaultModal>
            )}
            {['REJECTED', 'BLOCKED'].includes(status) && (
              <DefaultModal
                title="Wil je zeker dat je deze bestuurder wilt verwijderen?"
                button={
                  <button className="flex items-center gap-1 text-danger-base">
                    <DeleteIcon /> verwijderen
                  </button>
                }
                confirmPlaceholder="Verder"
                fn={async () => {
                  await deleteDriver(driverId);
                  message.success('Driver deleted successfully!');
                }}
              >
                {/* Zodra je verdergaat, wordt de bestuurder gedeblokkeerd en kan
                diegene de app weer gebruiken. */}
              </DefaultModal>
            )}

            {status === 'PENDING' && (
              <>
                <div className="flex gap-2 items-center">
                  <ActionButtons
                    onApprove={handleApprove}
                    onRejectReason={onSubmitRejectReason}
                    onReject={handleReject}
                    recordId={driverId}
                    confirmationMessage="Wil je deze bestuurder afwijzen?"
                  />
                  <ButtonWithIcon icon={<BlockIcon />} onClick={handleBlock}>
                    Block
                  </ButtonWithIcon>
                </div>
                <Modal
                  title="Block Driver"
                  open={isBlockModalVisible}
                  onOk={() => handleBlockModalOk(driverId)}
                  onCancel={handleBlockModalCancel}
                  okText="Block"
                  cancelText="Cancel"
                >
                  <p>Please select the reason for blocking:</p>
                  <Radio.Group
                    onChange={(e) => setBlockReason(e.target.value)}
                    value={blockReason}
                  >
                    <Radio value="Fraude">Fraude</Radio>
                    <Radio value="Herhaalde">Herhaalde</Radio>
                    <Radio value="Onacceptabel">Onacceptabel</Radio>
                    <Radio value="Ongeldige">Ongeldige</Radio>
                    <Radio value="Schending">Schending</Radio>
                    <Radio value="Voertuigprobleme">Voertuigprobleme</Radio>
                    <Radio value="Other">Other</Radio>
                  </Radio.Group>
                </Modal>
              </>
            )}
          </div>
        );
      },
    },
  ];
};

interface Props {
  status: DriverStatus;
  label: string;
}

const DriversTab = ({ status, label }: Props) => {
  const { data: drivers, isLoading } = useDriversByStatus(status);
  const columns = useDriversColumns({
    status,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const isPending = status === 'PENDING';
  return (
    <div className="px-6">
      <div className="flex items-end flex-wrap gap-4 mb-5">
        <div className="mr-auto">
          <h4 className="mb-1 text-neutral-100 font-bold text-xl sm:text-2xl">
            {isPending ? `bestuurders ${label}` : `${label} bestuurders(s)`}
          </h4>
          <h6 className="font-medium text-base text-neutral-50">
            {isPending
              ? `Totaal ${drivers?.length} bestuurders(s) ${label}`
              : `Totaal ${drivers?.length} ${label} bestuurders(s)`}
          </h6>
        </div>
      </div>
      <Table dataSource={drivers} columns={columns} />
    </div>
  );
};

export default DriversTab;
