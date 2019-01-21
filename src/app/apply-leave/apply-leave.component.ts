import { Component, OnInit } from "@angular/core";
import { DropDown, SelectedIndexChangedEventData } from "nativescript-drop-down";
import * as modalDatepicker from "nativescript-modal-datetimepicker";
import * as Toast from "nativescript-toast";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import * as moment from "moment";
import { ListPicker } from "tns-core-modules/ui/list-picker";
import { EventData, Page } from "tns-core-modules/ui/page/page";
import { Employee } from "../models/employee.model";
import { Leave } from "../models/leave.model";
import { ILeaveTypes } from "../models/leavetype.model";
import { LeaveSession } from "../models/session";
import { LeaveService } from "../services/leave.service";
import { StorageService } from "../services/storage.service";

@Component({
  selector: "ns-apply-leave",
  templateUrl: "./apply-leave.component.html",
  styleUrls: ["./apply-leave.component.css"],
  moduleId: module.id
})
export class ApplyLeaveComponent implements OnInit {

  isactive = false;
  startdate: Date;
  enddate: Date;
  session1value: number;
  session2value: number;
  session1index: number = 0;
  session2index: number = 1;
  leavetypeindex: number;
  model: any = {};
  employeeId: number;
  userInfo: Employee;
  leavetypedata: Array<ILeaveTypes>;
  leavetypes: Array<string> = [];
  sessions: Array<string> = ["Session1", "Session2"];
  noOfLeaveDays: number;
  sessioncount: number = 1;
  availableleaves: any;

  constructor(private leaveservice: LeaveService, private storageService: StorageService) {
    this.model.leavetype = 0;
    this.model.session1 = 0;
    this.model.session2 = 1;
    this.session1value = 1;
    this.session2value = 2;
    this.leavetypes.push("--Leave Type--");
    this.userInfo = this.storageService.getuserInfo();
    this.employeeId = this.userInfo.Id;
  }

  ngOnInit() {
    this.leaveservice.getleavetypes()
      .subscribe(
        (leavetyperesponse) => {
          if (leavetyperesponse) {
            this.leavetypedata = JSON.parse(JSON.stringify(leavetyperesponse));
            console.log(this.leavetypedata);
            this.leavetypedata.forEach((element) => {
              this.leavetypes.push(element.LeaveTypeName);
            });
          }
        },
        (error) => {
          Toast.makeText("Oops! Something went wrong.").show();
          console.error(error);
        }
      );
  }

  opensession1DD(args: EventData) {
    const page = <Page>args.object;
    const dropdown = <DropDown>page.getViewById("session1dd");
    dropdown.open();
  }

  opensession2DD(args: EventData) {
    const page = <Page>args.object;
    const dropdown = <DropDown>page.getViewById("session2dd");
    dropdown.open();
  }

  openleavetypeDD(args: EventData) {
    const page = <Page>args.object;
    const dropdown = <DropDown>page.getViewById("leavetypedd");
    dropdown.open();
  }

  sessionOneIndexChanged(args: SelectedIndexChangedEventData) {
    this.session1index = args.newIndex;
    // console.log("old session1 value: " + this.session1value);
    this.session1value = this.session1index + 1;
    this.addsessioncount();
    // console.log("new session1 value: " + this.session1value);
  }
  addsessioncount(): void {
    // tslint:disable-next-line:max-line-length
    if ((this.session1value === 1 && this.session2value === 1) || (this.session1value === 2 && this.session2value === 2)) {
      this.sessioncount = 0.5;
      console.log("cond1");
    } else if (this.session1value === 2 && this.session2value === 1) {
      this.sessioncount = 0;
      console.log("cond2");
    } else if (this.session1value === 1 && this.session2value === 2) {
      this.sessioncount = 1;
      console.log("cond3");
    }
    this.ondatechange();
    // console.log("cond not");
  }

  sessionTwoIndexChanged(args: SelectedIndexChangedEventData) {
    this.session2index = args.newIndex;
    this.session2value = this.session2index + 1;
    this.addsessioncount();
  }

  leaveTypeIndexChanged(args: SelectedIndexChangedEventData) {
    this.leavetypeindex = args.newIndex;
    if (this.leavetypeindex !== 0) {
      this.leaveservice.getavailableleaves(this.employeeId, this.leavetypeindex.toString())
        .subscribe((availableleavesresponse) => {
          if (availableleavesresponse) {
            this.availableleaves = JSON.parse(JSON.stringify(availableleavesresponse));
          }
        },
          (error) => {
            Toast.makeText("Oops! Something went wrong.").show();
            console.error(error);
          });
    }
  }

  // tslint:disable-next-line:member-ordering
  ondatechange() {
    // tslint:disable-next-line:max-line-length
    if ((this.model.startdate !== undefined && this.model.startdate !== "") && (this.model.enddate !== undefined && this.model.enddate !== "")) {
      const date2 = new Date(this.startdate);
      const date1 = new Date(this.enddate);
      const timeDiff = Math.abs(date2.getTime() - date1.getTime());
      const days: number = Math.ceil(timeDiff / (1000 * 3600 * 24));
      this.noOfLeaveDays = days;
      // console.log(this.noOfLeaveDays +  " " + this.sessioncount);
      this.model.leaveDays = this.noOfLeaveDays + this.sessioncount;
    }
  }
  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  private pickStartDate() {
    const picker = new modalDatepicker.ModalDatetimepicker();
    let month:string = "";
    // tslint:disable-next-line:no-unused-expression
    picker.pickDate({
      title: "Enter start date.",
      theme: "dark",
      maxDate: new Date(),
      is24HourView: false
    }).then((result) => {
      // tslint:disable-next-line:prefer-conditional-expression
      month=this.appendzero(result.month.toString());
      this.model.startdate = result.day + "/" + month + "/" + result.year;
      this.startdate = new Date(result.year.toString() + "-" + month + "-" + result.day.toString());
      console.log(this.startdate);
    }).catch((error) => {
      console.log("DatePickerError: " + error);
    });
  }

  private pickEndDate() {
    const picker = new modalDatepicker.ModalDatetimepicker();
    let month:string = "";
    picker.pickDate({
      title: "Enter end date.",
      theme: "dark",
      maxDate: new Date(),
      is24HourView: false
    }).then((result) => {
      // tslint:disable-next-line:prefer-conditional-expression
      month=this.appendzero(result.month.toString());
      this.model.enddate = result.day + "/" + month + "/" + result.year;
      this.enddate = new Date(result.year.toString() + "-" + month + "-" + result.day.toString());
      console.log(this.enddate);
    }).catch((error) => {
      console.log("DatePickerError: " + error);
    });
  }

  appendzero(value: string): string {
    let result: string = "";
    if (/^\d$/.test(value)) {
      result = "0" + value;
    } else {
      result = value;
    }
    return result;
  }
  onapplytap() {
    // this.isactive=true;
    const leaveInfo = new Leave();
    leaveInfo.EmployeeId = this.employeeId;
    leaveInfo.LeaveTypeId = +(this.model.leavetype);
    leaveInfo.LeaveStartDate = new Date(this.startdate).toISOString();                    //moment("2019-01-10");
    leaveInfo.LeaveEndDate = new Date(this.enddate).toISOString();                       //moment("2019-01-15");
    leaveInfo.NumberOfLeaveDays = +(this.model.leaveDays);
    leaveInfo.LeaveReason = this.model.leavereason; this.enddate
    leaveInfo.LeaveStatus = "Waiting for approval";
    leaveInfo.AdminRemark = null;
    leaveInfo.CreatedBy = this.employeeId.toString();
    leaveInfo.ModifiedBy = this.employeeId.toString();
    leaveInfo.StartDateSession = this.session1value;
    leaveInfo.EndDateSession = this.session2value;
    console.log(leaveInfo);
    this.leaveservice.leaveapplypost(leaveInfo)
    .subscribe(
      (leaveapplyresponse)=>{
        if(leaveapplyresponse){
          Toast.makeText("Leave applied sucessfully").show();
        }
        else{
          Toast.makeText("Leave applied failed.").show();
        }
      },(error)=>
      {
        Toast.makeText("Oops! Something went wrong.").show();
        console.error(error);
      }
    );
  }


}
