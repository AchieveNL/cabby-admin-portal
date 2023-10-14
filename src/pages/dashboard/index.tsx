import React from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import Overview from '@/views/overview/Overview';

const OverviewPage = () => {
  return (
    <>
      <DashboardLayout>
        <Overview />
      </DashboardLayout>
    </>
  );
};

export default OverviewPage;
