import React from 'react';
import { Col, Row } from 'antd';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Login.module.css';

interface Props {
  children: React.ReactNode;
}
const AuthLayout = ({ children }: Props) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="Cabby" />
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <title>Cabby - Auth</title>
      </Head>
      <Row style={{ margin: 0 }}>
        <Col xs={0} sm={0} md={0} lg={12} xl={12} className={styles.leftBox}>
          <Row align="middle" className={styles.imgBox}>
            <Col>
              <Image alt="" src="/logo.png" width={240} height={93} />
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Row align="middle" className={styles.loginBox}>
            <Col span={16}>{children}</Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default AuthLayout;
