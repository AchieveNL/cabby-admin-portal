import React from 'react';
import MenuItem from '@/components/inputs/MenuItem';
import NavLink from '@/components/inputs/NavLink';
import Image from 'next/image';

interface NavLinkData {
  href: string;
  label: string;
  iconPath: string;
  numberList?: number;
}

const navLinks: NavLinkData[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    iconPath: '/Dashboard.png',
    // numberList: 17,
  },
  {
    href: '/dashboard/orders',
    label: 'Orders',
    iconPath: '/CarRental.png',
    // numberList: 6,
  },
  {
    href: '/dashboard/vehicles',
    label: "Auto's",
    iconPath: '/DirectionsCarFilled.png',
    // numberList: 4,
  },
  {
    href: '/dashboard/drivers',
    label: 'Drivers',
    iconPath: '/CarRental.png',
  },
  {
    href: '/dashboard/damage-reports',
    label: 'Damage reports',
    iconPath: '/Description.png',
  },
  {
    href: '/dashboard/refunds',
    label: 'Refunds',
    iconPath: '/Money.png',
  },
];

const Sidebar = ({
  show,
  onClose,
}: {
  show: boolean;
  onClose: React.MouseEventHandler;
}) => {
  return (
    <aside className={`sidebar p-5 ${show && 'show'}`}>
      <div className="sidebar-container">
        <div className="mb-10">
          <Image alt="logo" src="/logo-blue.png" width={145} height={58} />
        </div>
        <ul className="space-y-3">
          {navLinks.map((link) => (
            <li key={link.href}>
              <NavLink className="block" href={link.href}>
                <MenuItem
                  props={{
                    label: link.label,
                    iconPath: link.iconPath,
                    numberList: link.numberList,
                  }}
                />
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="sidebar-overlay" onClick={onClose} />
    </aside>
  );
};

export default Sidebar;
