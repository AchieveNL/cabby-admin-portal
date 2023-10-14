import React from 'react';
import Link from 'next/link';
// icons
import DashboardIcon from '@/components/icons/DashboardIcon';

interface BreadcrumbPage {
  name: string;
  href: string;
  current: boolean;
}

interface BreadcrumbsProps {
  pages: BreadcrumbPage[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ pages }) => (
  <ol role="list" className="breadcrumbs flex items-center space-x-2">
    <li>
      <div>
        <Link href="/" className="text-primary-base text-sm flex">
          <DashboardIcon /> {/* You need to replace this with your icon */}
          <span className="ml-1 hover:opacity-80">Cars</span>
        </Link>
      </div>
    </li>
    {pages.map((page) => (
      <li key={page.name}>
        <div className="flex items-center">
          <svg
            className="h-3 w-3 flex-shrink-0 text-primary-base"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
          </svg>

          <Link
            href={page.href}
            className={`ml-1 text-sm text-primary-base hover:opacity-80 ${
              page.current && 'text-primary-light-1 cursor-not-allowed'
            }`}
          >
            {page.name}
          </Link>
        </div>
      </li>
    ))}
  </ol>
);

export default Breadcrumbs;
