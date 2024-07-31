import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Col, Row } from 'antd';
import type { FormItemProps } from 'antd';
import Image from 'next/image';
import styles from '../../styles/Login.module.css';

const MyFormItemContext = React.createContext<(string | number)[]>([]);
interface MyFormItemGroupProps {
  prefix: string | number | (string | number)[];
  children: React.ReactNode;
}

function toArr(
  str: string | number | (string | number)[],
): (string | number)[] {
  return Array.isArray(str) ? str : [str];
}

const MyFormItemGroup = ({ prefix, children }: MyFormItemGroupProps) => {
  const prefixPath = React.useContext(MyFormItemContext);
  const concatPath = React.useMemo(
    () => [...prefixPath, ...toArr(prefix)],
    [prefixPath, prefix],
  );

  return (
    <MyFormItemContext.Provider value={concatPath}>
      {children}
    </MyFormItemContext.Provider>
  );
};

const MyFormItem = ({ name, ...props }: FormItemProps) => {
  const prefixPath = React.useContext(MyFormItemContext);
  const concatName =
    name !== undefined ? [...prefixPath, ...toArr(name)] : undefined;

  return <Form.Item name={concatName} {...props} />;
};
const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const router: any = useRouter();

  const onHandleNext = () => null;
  const requestForResetLink = async (email: string) => email;
  const onFinish = async (value: any) => {
    const {
      user: { email },
    } = value;
    await requestForResetLink(email);
  };
  return (
    <>
      <Row justify="start" onClick={() => router.push('/auth/login')}>
        <Col span={1}>
          <Image
            alt=""
            className={styles.arrowBackIcon}
            src="/arrow_back_24px.svg"
            width={160}
            height={160}
          />
        </Col>
        <Col span={1} className={styles.arrowBackLabel}>
          Terug
        </Col>
      </Row>
      <span className="margin-b-20"></span>
      <h3 className={styles.loginHeading}>Wachtwoord vergeten?</h3>
      <p className={styles.loginSubHeading}>
        Voer het e-mailadres in dat aan uw account is gekoppeld om de resetlink
        te ontvangen.
      </p>
      <Form
        className={styles.form}
        name="form_item_path"
        layout="vertical"
        onFinish={onFinish}
      >
        <MyFormItemGroup prefix={['user']}>
          <MyFormItem name="username" label="Email Adres">
            <Input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Type hier"
            />
          </MyFormItem>
        </MyFormItemGroup>
        <Button
          className={styles.loginBtn}
          type="primary"
          htmlType="submit"
          onClick={onHandleNext}
        >
          Volgende
        </Button>
      </Form>
    </>
  );
};

export default ForgotPasswordForm;
