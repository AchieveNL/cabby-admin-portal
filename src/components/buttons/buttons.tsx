import { Button, ButtonProps } from 'antd';
import React, { ReactNode } from 'react';
import styles from './buttons.module.css';

interface Props extends ButtonProps {
  icon: ReactNode;
}
export default function ButtonWithIcon({ icon, ...rest }: Props) {
  return (
    <Button type="text" danger {...rest}>
      <div className={styles.button_content}>
        <div>{icon}</div>
        <div>{rest.children}</div>
      </div>
    </Button>
  );
}
