import React from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import Overview from '@/views/overview/Overview';
import Link from 'next/link';

const OverviewPage = () => {
  return (
    <>
      <DashboardLayout
        breadcrumbItems={[
          {
            title: <div className="text-primary-base">Dashboard</div>,
          },
        ]}
      >
        <Overview />
      </DashboardLayout>
    </>
  );
};

export default OverviewPage;
