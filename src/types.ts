export interface QueryData {
  [key: string]: string | null | undefined;
}

export interface ApiResponse {
  code?: number;
  msg?: string;
  data?: QueryData;
}

export interface InsuranceDTO {
  id: string;
  insuranceStatus: string;
  reportType: string;
  productSn: string;
  oldProductSn: string | null;
  tradeState: string | null;
  totalFee: number | null;
  productModel: string;
  brand: string;
  timeType: number;
  serviceType: string;
  remark: string | null;
  activationTime: string;
  reportTime: string;
  startTime: string;
  endTime: string;
  useTime: string | null;
  createTime: string;
  updateTime: string;
  activityType: string;
  activityName: string | null;
  source: string | null;
}

export interface InsuranceData {
  productSn: string;
  activationTime: string;
  price: number;
  expireDays: number;
  buyStatus: string;
  buyStatusDesc: string | null;
  model: string;
  brand: string;
  insuranceDTO: InsuranceDTO | null;
  urlVo: {
    insuranceUrl: string;
    igreementUrl: string;
  } | null;
  configId: number;
}

export interface InsuranceResponse {
  code: string;
  data: InsuranceData | null;
  desc: string;
}

export interface FieldGroup {
  id: string;
  title: string;
  color: 'blue' | 'green' | 'orange' | 'purple';
  icon: string;
  keys: string[];
}

export type ThemeMode = 'auto' | 'light' | 'dark';
export type StatusType = 'info' | 'ok' | 'err';
export type ToastType = 'success' | 'error';
