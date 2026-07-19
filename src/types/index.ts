export * from "./api";
export * from "./device";

import type { DeviceInfo } from "./device";

type DeviceInfoKey = Extract<keyof DeviceInfo, string>;

export interface FieldGroup {
  id: string;
  title: string;
  color: "blue" | "green" | "orange" | "purple" | "teal";
  icon: string;
  keys: DeviceInfoKey[];
}

export type ThemeMode = "auto" | "light" | "dark";
export type StatusType = "info" | "ok" | "err";
export type ToastType = "success" | "error";
