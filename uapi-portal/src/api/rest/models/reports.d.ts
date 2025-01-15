export interface ConsumptionDetialType {
  accountId: number;
  accountCode: string;
  month: number;
  year: number;
}

export interface ConsumptionType {
  accountId: number;
  accountCode: string;
  accountName: string;
  packageName: string;
  dueAmount: number;
  month: number;
  year: number;
}

export interface ConsumptionAccountType {
  serviceCode: string;
  serviceName: string;
  successTransaction: number;
  failedTransactions: number;
  totalTransactions: number;
  totalAmount: number;
  dueMonth?: number;
}
