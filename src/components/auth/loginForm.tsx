/* eslint-disable @next/next/no-img-element */
import { Form, Input, Button, message, Spin } from 'antd';
import React, { useState, useContext, createContext, useMemo } from 'react';
import router from 'next/router';
import styles from '../../styles/Login.module.css';
import { useLogin } from '@/api/auth/hooks';

interface MyFormItemGroupProps {
  prefix: string | number | (string | number)[];
  children: React.ReactNode;
}

const MyFormItemContext = createContext<(string | number)[]>([]);

const toArr = (
  str: string | number | (string | number)[],
): (string | number)[] => (Array.isArray(str) ? str : [str]);

const MyFormItemGroup: React.FC<MyFormItemGroupProps> = ({
  prefix,
  children,
}) => {
  const prefixPath = useContext(MyFormItemContext);
  const concatPath = useMemo(
    () => [...prefixPath, ...toArr(prefix)],
    [prefixPath, prefix],
  );

  return (
    <MyFormItemContext.Provider value={concatPath}>
      {children}
    </MyFormItemContext.Provider>
  );
};

const MyFormItem: React.FC<React.ComponentProps<typeof Form.Item>> = ({
  name,
  ...props
}) => {
  const prefixPath = useContext(MyFormItemContext);
  const concatName =
    name !== undefined ? [...prefixPath, ...toArr(name)] : undefined;

  return <Form.Item name={concatName} {...props} />;
};

const LoginForm: React.FC = () => {
  const [isPwdVisible, setPasswordVisibility] = useState(false);
  const { data, loading, error, login } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onFinish = async () => {
    await login(email, password);
  };

  React.useEffect(() => {
    if (data) {
      message.success('Welcome to Cabby - Admin Panel');
      router.push('/dashboard');
    }

    if (error) {
      message.error('Invalid Email Address or Password');
    }
  }, [data, error]);

  return (
    <>
      <h3 className={styles.loginHeading}>Inloggen</h3>
      <p className={styles.loginSubHeading}>
        Voer je accountgegevens in om je aan te melden bij je cabby-account
      </p>
      <Form
        className={styles.form}
        name="form_item_path"
        layout="vertical"
        onFinish={onFinish}
      >
        <MyFormItemGroup prefix={['user']}>
          <MyFormItem name="email" label="E-mailadres">
            <Input
              type="text"
              required
              placeholder="Jouw e-mailadres"
              onChange={(e) => setEmail(e.target.value)}
            />
          </MyFormItem>
          <MyFormItem name="password" label="Wachtwoord" className="pwdBox">
            <Input
              type={isPwdVisible ? 'text' : 'password'}
              required
              placeholder="********"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="eyeIcon">
              <img
                src="/Eye off.png"
                width={24}
                height={24}
                onClick={() => setPasswordVisibility(!isPwdVisible)}
                alt="..."
              />
            </span>
          </MyFormItem>
        </MyFormItemGroup>

        <p className={styles.externalLinkBox}>
          <span
            className={styles.externalLink}
            onClick={() => router.push('/auth/forgot-password')}
          >
            Wachtwoord vergeten?
          </span>
        </p>
        <Button
          className={styles.loginBtn}
          type="primary"
          htmlType="submit"
          disabled={loading}
        >
          {loading ? <Spin /> : 'Inloggen'}
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
