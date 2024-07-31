import { Button, Popover } from 'antd';
import React, { useState } from 'react';
import CheckIcon from '../icons/CheckIcon';
import {
  CloseOutlined,
  EllipsisOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import OrdersModal, { Actions } from '../modals/OrdersModal';
import { OrderStatus } from '@/api/orders/types';

type Props = {
  orderId: string;
  status: OrderStatus;
  mollieId: string;
  isPaid: boolean;
};

const OrderPopover = ({ orderId, status, mollieId, isPaid }: Props) => {
  const [open, setOpen] = useState(false);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  let actions: Actions[] = [];
  switch (status) {
    case OrderStatus.PENDING:
      actions = ['CONFIRM', 'CANCEL', 'REFUND'];
      break;
    case OrderStatus.CONFIRMED:
      actions = ['CANCEL', 'REFUND'];
      break;
    case OrderStatus.CANCELED:
      actions = ['RESET', 'DELETE', 'REFUND'];
      break;
    case OrderStatus.COMPLETED:
      actions = ['DELETE', 'REFUND'];
      break;
    case OrderStatus.UNPAID:
      actions = ['COMPLETE', 'REFUND'];
      break;

    default:
      break;
  }

  const content = (
    <div className="flex gap-1">
      {actions?.map((el) => (
        <OrdersModal
          isPaid={isPaid}
          mollieId={mollieId}
          key={el}
          orderId={orderId}
          actions={el}
        />
      ))}
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="hover"
      open={open}
      onOpenChange={handleOpenChange}
      placement="bottom"
    >
      <Button>
        <EllipsisOutlined rev={undefined} />
      </Button>
    </Popover>
  );
};

export default OrderPopover;
