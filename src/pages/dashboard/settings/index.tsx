import DashboardLayout from '@/layout/DashboardLayout';
import Settings from '@/views/settings/Settings';
import React from 'react';

export default function UsersPage() {
  return (
    <DashboardLayout headerTitle="Instellingen">
      <Settings />
    </DashboardLayout>
  );
}
