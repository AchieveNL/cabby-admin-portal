import { Driver } from '../drivers/types';

export interface Refund extends RefundInput {
  userProfile: Driver;
}

export type RefundInput = {
  userProfileId: string;
  amount: string;
};
