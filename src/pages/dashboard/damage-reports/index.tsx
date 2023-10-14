import React from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import DamageReports from '@/views/damageReports/DamageReport';

const DamageReportsPage = () => {
  return (
    <DashboardLayout>
      <DamageReports />
    </DashboardLayout>
  );
};

export default DamageReportsPage;
