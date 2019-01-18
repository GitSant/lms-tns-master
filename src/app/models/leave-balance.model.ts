export interface EmpLeaveBalance {
    LeaveBalanceId: number;
    LeaveYear: string;
    LeaveType: number;
    LeaveTypeName: string;
    NumberOfLeaves: number;
    EmployeeId: number;
    EmployeeName: string;
    TotalLeaves: number;
    ApplyedLeaves: number;
    UtilizedLeaves: number;
    AvailableLeaves: number;
    InProgressLeaves: number;
    RejectedLeaves: number;
}

export interface LeaveBalance {
    EmpLeaveBalance: EmpLeaveBalance[];
}
