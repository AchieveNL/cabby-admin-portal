import React from 'react';
import DefaultModal from './DefautlModal';
import CheckIcon from '../icons/CheckIcon';
import { Button, Tooltip, message } from 'antd';
import {
  CloseOutlined,
  DeleteOutlined,
  DollarOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  cancelOrder,
  changeOrderStatus,
  completeOrderAdmin,
  confirmOrder,
  deleteOrder,
  invalidateOrders,
} from '@/api/orders/orders';
import { refundPayment } from '@/api/payment/payment';

export type Actions =
  | 'COMPLETE'
  | 'CONFIRM'
  | 'CANCEL'
  | 'DELETE'
  | 'RESET'
  | 'REFUND';

type Props = {
  actions: Actions;
  orderId: string;
  mollieId: string;
  isPaid: boolean;
};

const OrdersModal = ({ actions, orderId, mollieId, isPaid }: Props) => {
  let title = 'title';
  let tooltip = '';
  let children = 'children';
  let button;
  let icon = '/assets/modal/success.svg';
  let fn = async () => {};
  switch (actions) {
    case 'CONFIRM':
      tooltip = '';
      title = 'Wil je deze boeking bevestigen?';
      children =
        'Als je deze boeking bevestigd gaat de boeking naar "Bevestigd"';
      button = (
        <Button>
          <CheckIcon />
        </Button>
      );
      fn = async () => {
        await confirmOrder(orderId);
      };
      icon = '/assets/modal/success.svg';
      break;
    case 'COMPLETE':
      tooltip = '';
      title = 'Wil je deze verlopen boeking voltooien?';
      children =
        'Als je deze verlopen boeking voltooid gaat de boeking naar "Voltooid"';
      button = (
        <Button className="bg-success-base">
          <CheckIcon />
        </Button>
      );
      fn = async () => {
        await completeOrderAdmin(orderId);
      };
      icon = '/assets/modal/complete.svg';
      break;
    case 'RESET':
      tooltip = '';
      title = 'Herstellen';
      children = 'Herstellen';
      button = (
        <Button className="bg-success-base">
          <ReloadOutlined rev={undefined} />
        </Button>
      );
      fn = async () => {
        await changeOrderStatus(orderId, 'PENDING');
      };
      // icon = '/assets/modal/reset.svg';
      break;
    case 'DELETE':
      tooltip = '';
      title = 'Wil je deze boeking verwijderen?';
      children = 'Deze actie kan niet ongedaan gemaakt worden.';
      button = (
        <Button danger>
          <DeleteOutlined rev={undefined} />
        </Button>
      );
      fn = async () => {
        await deleteOrder(orderId);
      };
      icon = '/assets/modal/cancel.svg';
      break;
    case 'CANCEL':
      tooltip = '';
      title = 'Wil je deze boeking annuleren?';
      children =
        'Als je deze boeking annuleert gaat de boeking naar “Geannuleerd”. ';
      button = (
        <Button danger>
          <CloseOutlined rev={undefined} />
        </Button>
      );
      fn = async () => {
        await cancelOrder(orderId);
      };
      icon = '/assets/modal/cancel.svg';
      break;
    case 'REFUND':
      tooltip = '';
      title = 'Refund the payment';
      children = 'Are you sure to refund this payment?';
      const disabled = !mollieId || !isPaid;
      button = (
        <Button disabled={disabled}>
          <DollarOutlined rev={undefined} />
        </Button>
      );
      fn = async () => {
        await refundPayment(mollieId);
      };
      icon = '/assets/modal/success.svg';
      break;

    default:
      break;
  }

  button = <Tooltip title={actions}>{button}</Tooltip>;

  return (
    <DefaultModal icon={icon} title={title} button={button} fn={fn}>
      {children}
    </DefaultModal>
  );
};

export default OrdersModal;
