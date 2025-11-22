export enum ScanStatus {
  Active = "active",
  Inactive = "inactive",
}

export interface Scan {
  id: number;
  ip: string;
  status: ScanStatus;
  createdAt: string;
}
