import React from 'react';
import { Card, Row, Tag, message } from 'antd';
import styles from '@/styles/Driver.module.css';
import ActionButtons from '../ActionButtons/ActionButtons';
import { Driver, UserProfileStatus } from '@/api/drivers/types';
import ButtonWithIcon from '../buttons/buttons';
import BlockIcon from '../icons/BlockIcon';
import { useUpdateDriverStatus } from '@/api/drivers/hooks';
import { useRouter } from 'next/router';
import { ExportOutlined } from '@ant-design/icons';

interface DriverCardProps {
  driver: Driver;
  isDetailPage?: boolean;
}

const DriverCard: React.FC<DriverCardProps> = ({ driver, isDetailPage }) => {
  const router = useRouter();
  const renderTag = (label: string, defaultValue: string, value?: string) => (
    <Tag color="blue">{value ? `${label} ${value}` : defaultValue}</Tag>
  );
  const { updateStatus } = useUpdateDriverStatus();

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

  const handleBlock = async () => {
    try {
      await updateStatus(driver.id, UserProfileStatus.BLOCKED);
      message.success('Driver blocked successfully');
    } catch (error) {
      message.error('Failed to block the driver');
    }
  };

  return (
    <Card style={{ margin: '5px' }}>
      <p className={styles.driverName}>{driver?.fullName || 'User'}</p>
      <Row className={styles.tagsRow}>
        {renderTag(
          'KVK ID',

          'KVK ID 12345234',
          driver?.permitDetails.kvkDocumentId,
        )}
        {renderTag(
          'Taxi permit',

          'Taxi permit TP143653423',
          driver?.permitDetails.taxiPermitId,
        )}
      </Row>
      <Row className={styles.tagsRow}>
        {renderTag(
          'Kiwa taxi vergunning',

          'Kiwa taxi vergunning B01000111100',
          driver?.permitDetails.kiwaTaxiVergunningId,
        )}
      </Row>
      <Row className={styles.tagsRow}>
        {renderTag(
          'Drivers License ID',

          'Drivers License ID A123-34534-123',
          driver?.driverLicense.bsnNumber,
        )}
        <Tag color="blue">
          {driver?.driverLicense.driverLicenseExpiry ||
            'License expired: Not Available'}
        </Tag>
      </Row>
      <Row style={{ marginTop: '8px' }}>
        {!isDetailPage && (
          <ButtonWithIcon
            icon={<ExportOutlined rev={undefined} />}
            type="ghost"
            onClick={() => router.push(`/dashboard/drivers/${driver.id}`)}
          >
            Open Profile
          </ButtonWithIcon>
        )}
        <ActionButtons
          onApprove={handleApprove}
          onRejectReason={onSubmitRejectReason}
          onReject={handleReject}
          recordId={driver.id}
          confirmationMessage="Are you sure you want to reject this driver?"
        />
        <ButtonWithIcon icon={<BlockIcon />} danger onClick={handleBlock}>
          Block
        </ButtonWithIcon>
      </Row>
    </Card>
  );
};

export default DriverCard;
