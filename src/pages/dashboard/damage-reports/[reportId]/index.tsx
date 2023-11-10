import React from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import DamageReportDetails from '@/views/damageReports/DamageReportDetails';

const DamageReportDetailsPage = () => {
  return (
    <DashboardLayout>
      <DamageReportDetails />
    </DashboardLayout>
  );
};

export default DamageReportDetailsPage;
