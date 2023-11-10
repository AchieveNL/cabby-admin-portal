import React from 'react';
import { useRouter } from 'next/router';
import { Card, Descriptions, Spin, Button, Carousel, message } from 'antd';
import { useDamageReportDetails } from '@/api/damage-reports/hooks';
import { CheckOutlined } from '@ant-design/icons';
import { closeDamageReports } from '@/api/damage-reports/damage-reports';

const DamageReportDetails = () => {
  const router = useRouter();
  const reportId = router.query.reportId as string;
  const {
    data: report,
    loading,
    error,
    refetch,
  } = useDamageReportDetails(reportId); // This hook needs to be implemented

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div>Failed to load damage report details.</div>;
  }

  if (!report) {
    return <div>Not found!</div>;
  }

  const imageCarousel =
    report.images && report.images.length > 0 ? (
      <Carousel autoplay>
        {report.images.map((imgUrl, idx) => (
          <div key={idx}>
            <img
              src={imgUrl}
              alt={`Damage report image ${idx + 1}`}
              style={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'contain',
              }}
            />
          </div>
        ))}
      </Carousel>
    ) : (
      <div>No Images Available</div>
    );

  const onCloseDamageReport = async (id: string) => {
    try {
      await closeDamageReports(id);
      refetch();
      message.success('Damage Report Successfully Closed');
    } catch (error) {
      message.error('There was an error closing the damage report.');
    }
  };

  return (
    <div className="p-7">
      <Card bordered={false} className="site-page-header mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="inline">{`${report.vehicle.companyName} ${report.vehicle.model}`}</h2>
            <p className="inline">{`Plate: ${
              report.vehicle.licensePlate || 'N/A'
            }`}</p>
          </div>
          <Button
            icon={<CheckOutlined rev={undefined} />}
            style={{ color: 'green' }}
            onClick={() => onCloseDamageReport(reportId)}
          >
            Repaired
          </Button>
        </div>
      </Card>
      <Card bordered={false} className="mb-4">
        {imageCarousel}
      </Card>
      <Card bordered={false} className="mb-4">
        <Descriptions
          title="Report Information"
          bordered
          column={{ xxl: 4, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="Report ID">{report.id}</Descriptions.Item>
          <Descriptions.Item label="Reported At">
            {report.reportedAt}
          </Descriptions.Item>
          <Descriptions.Item label="Status">{report.status}</Descriptions.Item>
          <Descriptions.Item label="Repair Amount">
            {report.amount ? `€${report.amount}` : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Repaired At">
            {report.repairedAt || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            {report.description}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card bordered={false} className="mb-4">
        <Descriptions title="User Information" bordered>
          <Descriptions.Item label="User ID">{report.userId}</Descriptions.Item>
          <Descriptions.Item label="User Role">
            {report.user.role}
          </Descriptions.Item>
          <Descriptions.Item label="Full Name">
            {report.user.profile.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="First Name">
            {report.user.profile.firstName}
          </Descriptions.Item>
          <Descriptions.Item label="Last Name">
            {report.user.profile.lastName}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default DamageReportDetails;
