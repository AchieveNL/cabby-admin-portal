import DashboardLayout from '@/layout/DashboardLayout';
import MessagesContent from '@/views/messages/MessagesContent';
import React from 'react';

export default function MessagingContent() {
  return (
    <DashboardLayout>
      <MessagesContent />
    </DashboardLayout>
  );
}
