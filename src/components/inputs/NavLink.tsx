import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, className }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link href={href} className={`${className} ${isActive ? 'active' : ''}`}>
      {children}
    </Link>
  );
};

export default NavLink;
