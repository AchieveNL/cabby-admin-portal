import React, { useState } from 'react';
import { Button, Modal, Radio, Table, message } from 'antd';
import {
  Driver,
  DriverStatus,
  RegistrationOrder,
  User,
  UserProfileStatus,
} from '@/api/drivers/types';
import { useDriversByStatus, useUpdateDriverStatus } from '@/api/drivers/hooks';
import {
  DriverLicense,
  Payment,
  PaymentStatus,
  PermitDetails,
  UserProfile,
} from '@/api/orders/types';
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
import { refundPayment } from '@/api/payment/payment';
import Image from 'next/image';
import { downloadFile } from '@/utils/file';

type Record = UserProfile & {
  user: User & {
    registrationOrder: RegistrationOrder & { payment: Payment };
  };
};

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

  const colWidth = 200;

  return [
    {
      // width: colWidth,
      title: 'Bestuurder',
      dataIndex: 'fullName',
      render: (text: string) => <span>{text ? text : 'Not Available'}</span>,
    },
    {
      // width: colWidth,
      title: 'BSN nummer',
      dataIndex: 'driverLicense',
      render: (driverLicense: DriverLicense) => (
        <span>{driverLicense?.bsnNumber || 'Not Available'}</span>
      ),
    },
    {
      // width: colWidth,
      title: 'Email',
      dataIndex: 'user',
      render: (user: User) => (
        <span className="lowercase">{user?.email || 'Not Available'}</span>
      ),
    },
    {
      // width: colWidth,
      title: 'Geboortedatum',
      dataIndex: 'user',
      render: (user: User & { profile: UserProfile }) => (
        <span className="">
          {user?.profile?.dateOfBirth || 'Not Available'}
        </span>
      ),
    },
    {
      // width: colWidth,
      title: 'Adres',
      dataIndex: 'user',
      render: (user: User & { profile: UserProfile }) => (
        <span className="">
          {user?.profile?.fullAddress || 'Not Available'}
        </span>
      ),
    },
    {
      // width: colWidth,
      title: 'Telefoonnummer',
      dataIndex: 'user',
      render: (user: User & { profile: UserProfile }) => (
        <span className="">
          {user?.profile?.phoneNumber || 'Not Available'}
        </span>
      ),
    },
    {
      // width: colWidth,
      title: 'Rijbewijs',
      dataIndex: 'driverLicense',
      render: (driverLicense: DriverLicense) => {
        const file = driverLicense.driverLicenseFront;
        async function fn() {
          await downloadFile(file);
        }
        return (
          <Button onClick={fn} disabled={!file} className="flex gap-1">
            <Image
              width={20}
              height={20}
              src="/assets/table/invoice.svg"
              alt="invoice"
            />
          </Button>
        );
      },
    },
    {
      // width: colWidth,
      title: 'Vervaldatum rijbewijs',
      dataIndex: 'driverLicense',
      render: (driverLicense: DriverLicense) => (
        <span>{driverLicense?.driverLicenseExpiry || 'Not Available'}</span>
      ),
    },
    {
      // width: colWidth,
      title: 'Vervaldatum chauffeurspas',
      dataIndex: 'driverLicense',
      render: (driverLicense: DriverLicense) => (
        <span>{driverLicense?.driverLicenseExpiry || 'Not Available'}</span>
      ),
    },
    {
      // width: colWidth,
      title: 'Bedrijfsnaam',
      dataIndex: 'permitDetails',
      render: (permitDetails: PermitDetails) => (
        <span>{permitDetails?.companyName || 'Not Available'}</span>
      ),
    },
    {
      // width: colWidth,
      title: 'KVK uittreksel',
      dataIndex: 'permitDetails',
      render: (permitDetails: PermitDetails) => {
        const file = permitDetails.kvkDocument;
        async function fn() {
          await downloadFile(file);
        }
        return (
          <Button onClick={fn} disabled={!file} className="flex gap-1">
            <Image
              width={20}
              height={20}
              src="/assets/table/invoice.svg"
              alt="invoice"
            />
          </Button>
        );
      },
    },
    {
      // width: colWidth,
      title: 'KIWA taxivergunning',
      dataIndex: 'permitDetails',
      render: (permitDetails: PermitDetails) => {
        const file = permitDetails.kiwaDocument;
        async function fn() {
          await downloadFile(file);
        }
        return (
          <Button onClick={fn} disabled={!file} className="flex gap-1">
            <Image
              width={20}
              height={20}
              src="/assets/table/invoice.svg"
              alt="invoice"
            />
          </Button>
        );
      },
    },
    {
      // width: colWidth,
      title: 'Huurovereenkomst',
      dataIndex: 'permitDetails',
      render: (permitDetails: PermitDetails) => <span>{'Not Available'}</span>,
    },
    {
      // width: colWidth,
      title: 'Borg',
      dataIndex: 'user',
      render: (
        user: User & {
          registrationOrder: RegistrationOrder & { payment: Payment };
        },
      ) => {
        let totalAmount = user.registrationOrder.totalAmount?.toString();
        const paymentStatus = user.registrationOrder.payment.status;
        totalAmount = totalAmount
          ? '€ ' + totalAmount + ` (${paymentStatus})`
          : totalAmount;

        const file = user.registrationOrder.invoiceUrl;
        async function fn() {
          await downloadFile(file);
        }
        return (
          <span className="flex gap-1 whitespace-nowrap">
            <button disabled={!file} onClick={fn} className="w-6">
              <Image
                width={20}
                height={20}
                src="/assets/table/invoice.svg"
                alt="invoice"
              />
            </button>
            {totalAmount || 'Not Available'}
          </span>
        );
      },
    },
    {
      // width: colWidth,
      title: 'Details',
      dataIndex: 'id',
      render: (id: string) => (
        <Link href={`/dashboard/drivers/${id}`}>Details</Link>
      ),
    },
    {
      // width: colWidth,
      title: 'Actie',
      dataIndex: 'id',
      render: (id: string, record: Record) => {
        const driverId = record.id;
        const status = record.user?.registrationOrder?.payment?.status;
        const refunded = status === PaymentStatus.REFUNDED;

        const mollieId = record.user.registrationOrder.payment?.mollieId;

        return (
          <div className="flex gap-2 items-center">
            <DefaultModal
              button={<Button disabled={refunded || !mollieId}>Refund</Button>}
              title="Refund user deposit"
              fn={() => refundPayment(mollieId)}
            ></DefaultModal>
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
                  {false && (
                    <ButtonWithIcon
                      icon={<ExportOutlined rev={undefined} />}
                      onClick={() =>
                        router.push(`/dashboard/drivers/${driverId}`)
                      }
                      // className="whitespace-nowrap"
                    >
                      Open Profile
                    </ButtonWithIcon>
                  )}
                  <ActionButtons
                    onApprove={handleApprove}
                    onRejectReason={onSubmitRejectReason}
                    onReject={handleReject}
                    recordId={driverId}
                    confirmationMessage="Are you sure you want to reject this driver?"
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
