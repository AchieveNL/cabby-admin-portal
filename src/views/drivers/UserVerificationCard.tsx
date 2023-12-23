import React from 'react';
import { Card, Tag, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { UserVerification } from '@/api/drivers/types';

const { Text } = Typography;

interface VerificationItemProps {
  label: string;
  extracted: string | null;
  existing: string | null;
}

const VerificationItem: React.FC<VerificationItemProps> = ({
  label,
  extracted,
  existing,
}) => (
  <div style={{ marginBottom: 10 }}>
    <Text strong>{label}: </Text>
    <Tag color={extracted === existing ? 'success' : 'error'}>
      {extracted === existing ? (
        <CheckCircleOutlined rev={undefined} />
      ) : (
        <CloseCircleOutlined rev={undefined} />
      )}
      {extracted || 'N/A'}
    </Tag>
    <Text type="secondary"> (Expected: {existing || 'N/A'})</Text>
  </div>
);

interface UserVerificationCardProps {
  verificationData: UserVerification;
}

const UserVerificationCard: React.FC<UserVerificationCardProps> = ({
  verificationData,
}) => {
  return (
    <Card title="Verification Status" bordered={false}>
      <VerificationItem
        label="First Name"
        extracted={verificationData.extractedFirstName}
        existing={verificationData.existingFirstName}
      />
      <VerificationItem
        label="Last Name"
        extracted={verificationData.extractedLastName}
        existing={verificationData.existingLastName}
      />
      <VerificationItem
        label="BSN Number"
        extracted={verificationData.extractedBsnNumber}
        existing={verificationData.existingBsnNumber}
      />
      <VerificationItem
        label="Date of Birth"
        extracted={verificationData.extractedDateOfBirth}
        existing={verificationData.existingDateOfBirth}
      />
      <VerificationItem
        label="Expiry Date"
        extracted={verificationData.extractedExpiryDate}
        existing={verificationData.existingExpiryDate}
      />
    </Card>
  );
};

export default UserVerificationCard;
