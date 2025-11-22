export enum ScanStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface Scan {
  id: number;
  ip: string;
  status: ScanStatus;
  createdAt: string;
}