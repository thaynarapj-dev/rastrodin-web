export enum PaymentMethodTypeEnum {
  CASH = 'cash',
  DEBIT = 'debit',
  CREDIT = 'credit',
  PIX = 'pix',
  TRANSFER = 'transfer',
  OTHER = 'other',
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: PaymentMethodTypeEnum;
  description: string | null;
  space_id?: string | null;
  active: boolean;
}
