import React, { useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';
import { useRouter } from 'next/router';
import { Form, Input, Button, Row } from 'antd';
import type { FormItemProps } from 'antd';
import styles from '../../src/styles/Login.module.css';
import { verifyOtp } from '@/api/auth/auth';

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

const ResetPasswordForm = () => {
  const [isOtp, setIsOtp] = useState(true);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    setEmail(router.query.email as string);
  }, [router.query.email]);

  const onHandleNext = async () => {
    try {
      await verifyOtp(email, otp);
      setIsOtp(false);
    } catch (err) {
      console.error(err);
      // Handle error
    }
  };

  const onHandleSubmit = async () => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])/;
    const numberPattern = /^(?=.*[0-9])/;

    if (!password.match(pattern) && !password.match(numberPattern)) {
      console.error('Invalid password pattern');
      return;
    }

    router.push('/auth/login');
  };

  return (
    <>
      <Row justify="start" onClick={() => router.push('/auth/forgot-password')}>
        {/* Your Image code here */}
      </Row>
      <h3 className={styles.loginHeading}>Reset Password</h3>
      {isOtp ? (
        <>
          <p className={styles.loginSubHeading}>
            Enter the 4-digit verification code that was sent to your email to
            change your password.
          </p>
          <Form className={styles.form} layout="vertical">
            <div className="margin-b-20">
              <OtpInput
                value={otp}
                onChange={(value) => setOtp(value)}
                numInputs={4}
                inputStyle={{
                  width: '48px',
                  height: '48px',
                  marginRight: '10px',
                  textAlign: 'center',
                  fontSize: '20px',
                  color: '#2D46C4',
                }}
                renderSeparator={<span> </span>}
                renderInput={(props) => <input {...props} />}
              />
            </div>
            <Button
              className={styles.loginBtn}
              type="primary"
              onClick={onHandleNext}
            >
              Next
            </Button>
          </Form>
        </>
      ) : (
        <>
          <Form className={styles.form} layout="vertical">
            <MyFormItemGroup prefix={['user']}>
              <MyFormItem name="password" label="New Password">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="********"
                />
                {/* Your password condition UI here */}
              </MyFormItem>
              <MyFormItem name="cpassword" label="Confirm New Password">
                <Input
                  type="password"
                  value={cpassword}
                  onChange={(e) => setCPassword(e.target.value)}
                  required
                  placeholder="********"
                />
              </MyFormItem>
            </MyFormItemGroup>
            <Button
              className={styles.loginBtn}
              type="primary"
              onClick={onHandleSubmit}
            >
              Submit
            </Button>
          </Form>
        </>
      )}
    </>
  );
};

export default ResetPasswordForm;
