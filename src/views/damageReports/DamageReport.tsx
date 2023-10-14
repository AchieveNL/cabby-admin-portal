import React, { useState } from 'react';
import OpenDamageReports from './OpenDamageReports';
import ClosedDamageReports from './ClosedDamageReports';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const DamageReports = () => {
  const [activeTab, setActiveTab] = useState('1');

  const onChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <Tabs defaultActiveKey={activeTab} onChange={onChange}>
      <TabPane tab="Open Damages" key="1">
        <OpenDamageReports />
      </TabPane>
      <TabPane tab="Closed Damages" key="2">
        <ClosedDamageReports />
      </TabPane>
    </Tabs>
  );
};

export default DamageReports;
