import type { QueryData } from "../types";
import type { InsuranceResponse } from "../types";

const INS_STATUS: Record<string, string> = {
  AVAILABLE: "有效",
  EXPIRE: "已过期",
  PENDING: "待生效",
};

const BUY_STATUS: Record<string, string> = {
  HAS_BUY: "已购买",
  EXPIRE_BUY: "已过期",
};

export function mergeData(
  deviceData: QueryData | undefined,
  insuranceRes: InsuranceResponse | null | undefined,
): QueryData | undefined {
  if (!deviceData) return undefined;

  const merged: QueryData = { ...deviceData };

  const ins = insuranceRes?.data;
  if (!ins) return merged;

  const dto = ins.insuranceDTO;
  const act = dto?.activationTime || ins.activationTime;

  if (act) merged["激活时间"] = act.split(" ")[0] || null;

  if (dto?.startTime && dto?.endTime) {
    merged["保修时间"] =
      `${dto.startTime.split(" ")[0]}~${dto.endTime.split(" ")[0]}`;
  } else if (act) {
    const exp = new Date(act);
    exp.setFullYear(exp.getFullYear() + 1);
    merged["保修时间"] =
      `${act.split(" ")[0]}~${exp.toISOString().split("T")[0]}`;
  }

  if (ins.buyStatus) {
    merged["购买状态"] = BUY_STATUS[ins.buyStatus] || ins.buyStatus;
  }
  if (dto?.insuranceStatus) {
    merged["保险状态"] = INS_STATUS[dto.insuranceStatus] || dto.insuranceStatus;
  }
  if (dto?.activityName) merged["活动名称"] = dto.activityName;
  if (ins.expireDays && ins.expireDays > 0) {
    merged["剩余天数"] = `${ins.expireDays}天`;
  }
  if (ins.price) merged["延保价格"] = `${ins.price}元`;

  return merged;
}
