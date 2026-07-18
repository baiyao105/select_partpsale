export interface ApiResponse<T = unknown> {
  code?: number;
  msg?: string;
  data?: T;
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
