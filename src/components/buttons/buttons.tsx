import { Button, ButtonProps } from 'antd';
import React, { ReactNode } from 'react';
import styles from './buttons.module.css';

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  icon: ReactNode;
  className?: string;
}
export default function ButtonWithIcon({
  icon,
  className,
  children,
  ...rest
}: Props) {
  return (
    <button className={className} {...rest}>
      <div className={styles.button_content}>
        <div>{icon}</div>
        <div>{children}</div>
      </div>
    </button>
  );
}
