import { Moment } from "moment";

export class Leave {
    LeaveId: number;
    EmployeeId: number;
    LeaveTypeId: number;
    LeaveReason: string;
    LeaveStartDate: string;
    LeaveEndDate: string;
    NumberOfLeaveDays: number;
    LeaveStatus: string;
    AdminRemark: string;
    StartDateSession: number;
    EndDateSession: number;
    CreatedBy: string;
    CreatedDate: any;
    ModifiedBy: string;
    ModifiedDate: any;
  }
