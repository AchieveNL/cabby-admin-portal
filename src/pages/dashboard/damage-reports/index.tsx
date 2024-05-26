import React from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import DamageReports from '@/views/damageReports/DamageReport';

const DamageReportsPage = () => {
  return (
    <DashboardLayout headerTitle="Schaderapporten">
      <DamageReports />
    </DashboardLayout>
  );
};

export default DamageReportsPage;
