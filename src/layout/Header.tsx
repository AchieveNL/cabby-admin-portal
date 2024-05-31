import React from 'react';
import { deleteCookie } from 'cookies-next';
import NotificationIcon from '@/components/icons/NotificationIcon';
import ManageAccountIcon from '@/components/icons/ManageAccountIcon';
import SmsIcon from '@/components/icons/SmsIcon';
import MenuIcon from '@/components/icons/MenuIcon';
import { useRouter } from 'next/router';
import { Breadcrumb } from 'antd';
import Link from 'next/link';
import {
  BreadcrumbItemType,
  BreadcrumbSeparatorType,
} from 'antd/es/breadcrumb/Breadcrumb';

const pageNameMappings: Record<string, string> = {
  notifications: 'Notifications',
  messages: 'Messages',
  users: 'Manage Users',
};
interface Props {
  onMenu: React.MouseEventHandler;
  breadcrumbItems:
    | Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[]
    | undefined;
  headerTitle?: string;
}
const Header = ({ onMenu, breadcrumbItems, headerTitle }: Props) => {
  const router = useRouter();
  const logout = () => {
    deleteCookie('token');
    router.push('/auth/login');
  };

  const openMessages = () => router.push('/dashboard/messages');
  const openNotifications = () => router.push('/dashboard/notifications');
  const openUsers = () => router.push('/dashboard/users');

  const getPageName = () => {
    if (headerTitle) return headerTitle;
    const pathSegment = router.pathname.split('/')[2] || '';
    return (
      (pageNameMappings[pathSegment] as string | undefined) ||
      pathSegment
        .split(/[-_]/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    );
  };

  return (
    <>
      <header className="min-h-[5rem] p-6 bg-white border-b border-neutral-10">
        <nav className="flex items-center gap-3">
          <div className="lg:hidden">
            <button onClick={onMenu} className="btn-icon" type="button">
              <MenuIcon />
            </button>
          </div>
          <div className="mr-auto">
            <h6 className="mb-2 text-primary-base text-base font-bold">
              {getPageName()}
            </h6>
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <div className="flex gap-6 lg:gap-8">
            <div className="flex items-center gap-3 lg:gap-6">
              <button
                type="button"
                className="btn-icon relative"
                onClick={openNotifications}
              >
                <NotificationIcon />
              </button>
              <button
                type="button"
                className="btn-icon relative"
                onClick={openMessages}
              >
                <SmsIcon />
              </button>
              <button type="button" className="btn-icon" onClick={openUsers}>
                <ManageAccountIcon />
              </button>
            </div>
            <button
              type="button"
              onClick={() => logout()}
              className="btn-outline-primary"
            >
              <span className="text-base font-bold">Uitloggen</span>
            </button>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
