import React, { useState } from 'react';
import Head from 'next/head';
import Header from './Header';
import Sidebar from './Sidebar';

interface Props {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <>
      <Head>
        <title>Admin - Cabby</title>
        <meta property="og:title" content="Admin - Cabby" key="title" />
        <link rel="logo" sizes="57x57" href="/logo.png" />
      </Head>
      <main className="lg:flex min-h-screen max-w-[130rem] mx-auto">
        <Sidebar show={showSidebar} onClose={() => setShowSidebar(false)} />
        <div className="lg:flex flex-col flex-1">
          <Header onMenu={() => setShowSidebar(!showSidebar)} />
          <div className="bg-primary-light-4 h-full">{children}</div>
        </div>
      </main>
    </>
  );
};

export default DashboardLayout;
