import React, { useState } from 'react';
import { Card, Row, Tag, message, Modal, Radio } from 'antd';
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
  refetch?: () => void;
}

const DriverCard: React.FC<DriverCardProps> = ({ driver, isDetailPage }) => {
  const router = useRouter();
  const renderTag = (label: string, defaultValue: string, value?: string) => (
    <Tag color="blue">
      {label}: {value || defaultValue}
    </Tag>
  );
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

  const handleBlockWithReason = async (reason: string) => {
    try {
      console.log('Blocking reason:', reason);
      // Here, you can make an API call to submit the reason
      await updateStatus(driver.id, UserProfileStatus.BLOCKED, reason);
      message.success('Driver blocked successfully');
    } catch (error) {
      message.error('Failed to block the driver');
    }
  };

  const handleBlockModalOk = async () => {
    setIsBlockModalVisible(false);
    await handleBlockWithReason(blockReason);
  };

  const handleBlockModalCancel = () => {
    setIsBlockModalVisible(false);
  };

  const handleBlock = () => {
    showBlockModal();
  };
  return (
    <Card style={{ margin: '5px' }}>
      <p className={styles.driverName}>{driver?.fullName || 'User'}</p>
      <Row className={styles.tagsRow}>
        {renderTag(
          'KVK ID',

          'N/A',
          driver?.permitDetails?.kvkDocument,
        )}
        {renderTag(
          'Taxi permit',

          'N/A',
          driver?.permitDetails?.taxiPermitId,
        )}
      </Row>
      <Row className={'min-w-full'}>
        {renderTag(
          'Kiwa taxi vergunning',
          'N/A',
          driver?.permitDetails?.kiwaDocument || 'N/A',
        )}
      </Row>
      <Row className={styles.tagsRow}>
        {renderTag(
          'Drivers License ID',
          'N/A',
          driver?.driverLicense?.bsnNumber,
        )}
        <Tag color="blue">
          License expired on:
          {driver?.driverLicense?.driverLicenseExpiry || 'Not Available'}
        </Tag>
      </Row>
      <Row style={{ marginTop: '8px' }}>
        {!isDetailPage && (
          <ButtonWithIcon
            icon={<ExportOutlined rev={undefined} />}
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
        <ButtonWithIcon icon={<BlockIcon />} onClick={handleBlock}>
          Block
        </ButtonWithIcon>
      </Row>
      <Modal
        title="Block Driver"
        open={isBlockModalVisible}
        onOk={handleBlockModalOk}
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
    </Card>
  );
};

export default DriverCard;
