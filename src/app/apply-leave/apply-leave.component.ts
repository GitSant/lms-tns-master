import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { DropDown, SelectedIndexChangedEventData } from "nativescript-drop-down";
import * as modalDatepicker from "nativescript-modal-datetimepicker";
import * as Toast from "nativescript-toast";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { EventData, Page } from "tns-core-modules/ui/page/page";
import { Employee } from "../models/employee.model";
import { Leave } from "../models/leave.model";
import { ILeaveTypes } from "../models/leavetype.model";
import { ConnectivityService } from "../services/connectivity.service";
import { LeaveService } from "../services/leave.service";
import { StorageService } from "../services/storage.service";
import * as utils from "utils/utils";
import { isIOS, isAndroid } from "platform";
import * as frame from "ui/frame";

@Component({
  selector: "ns-apply-leave",
  templateUrl: "./apply-leave.component.html",
  styleUrls: ["./apply-leave.component.css"],
  moduleId: module.id
})
export class ApplyLeaveComponent implements OnInit {

  startdate: Date;
  enddate: Date;
  leaveStartDate: Date;
  leaveEndDate: Date;
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
  datevalidationerror: boolean;
  sessionvalidationerror: boolean;
  busyindicator: boolean = false;
  dropdownCss: string = "dropdownContentsCss";

  // tslint:disable-next-line:max-line-length
  constructor(private connectionService: ConnectivityService, private leaveservice: LeaveService, private storageService: StorageService, private routerExtentions: RouterExtensions) {
    this.model.leavetype = 0;
    this.model.session1 = 0;
    this.model.session2 = 1;
    this.session1value = 1;
    this.session2value = 2;
    this.leavetypes.push("--Leave Type--");
    this.userInfo = this.storageService.getuserInfo();
    if (this.userInfo) {
      this.employeeId = this.userInfo.Id;
    }
  }

  ngOnInit() {
    this.leaveservice.getleavetypes()
      .subscribe(
        (leavetyperesponse) => {
          if (leavetyperesponse) {
            this.leavetypedata = JSON.parse(JSON.stringify(leavetyperesponse));
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
    this.session1value = this.session1index + 1;
    this.addsessioncount();
  }
  addsessioncount(): void {
    // tslint:disable-next-line:max-line-length
    if ((this.session1value === 1 && this.session2value === 1) || (this.session1value === 2 && this.session2value === 2)) {
      this.sessioncount = 0.5;
    } else if (this.session1value === 2 && this.session2value === 1) {
      this.sessioncount = 0;
    } else if (this.session1value === 1 && this.session2value === 2) {
      this.sessioncount = 1;
    }
    this.ondatechange();
  }

  sessionTwoIndexChanged(args: SelectedIndexChangedEventData) {
    this.session2index = args.newIndex;
    this.session2value = this.session2index + 1;
    this.addsessioncount();
  }

  leaveTypeIndexChanged(args: SelectedIndexChangedEventData) {
    if (this.connectionService.checkConnection()) {
      this.leavetypeindex = args.newIndex;
      if (this.leavetypeindex === 3 || this.leavetypeindex === 0) {
        this.availableleaves = 0;
      } else {
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
  }

  dismissSoftKeybaord(){
      if (isIOS) {
         frame.topmost().nativeView.endEditing(true);
      }else if (isAndroid) {
        utils.ad.dismissSoftInput();
      }
  }
  // tslint:disable-next-line:member-ordering
  ondatechange() {
    // tslint:disable-next-line:max-line-length
    if ((this.model.startdate !== undefined && this.model.startdate !== "") && (this.model.enddate !== undefined && this.model.enddate !== "")) {
      const timeDiff = Math.abs(this.leaveStartDate.getTime() - this.leaveEndDate.getTime());
      const days: number = Math.ceil(timeDiff / (1000 * 3600 * 24));
      this.noOfLeaveDays = days;
      this.model.leaveDays = this.noOfLeaveDays + this.sessioncount;
    }
  }

  pickStartDate() {
    const picker = new modalDatepicker.ModalDatetimepicker();
    let month: string = "";
    let day: string = "";
    // tslint:disable-next-line:no-unused-expression
    picker.pickDate({
      theme: "light"
      // datePickerMode: "spinner"
    }).then((result) => {
      // tslint:disable-next-line:prefer-conditional-expression
      day = this.appendzero(result.day.toString());
      month = this.appendzero(result.month.toString());
      this.model.startdate = day + "/" + month + "/" + result.year;
      this.startdate = new Date(result.year.toString() + "-" + month + "-" + day);
      this.leaveStartDate = new Date(this.startdate);
      console.log(this.startdate);
    }).catch((error) => {
      console.log("DatePickerError: " + error);
    });
  }

  pickEndDate() {
    const picker = new modalDatepicker.ModalDatetimepicker();
    let month: string = "";
    let day: string = "";
    picker.pickDate({
      theme: "light"
    }).then((result) => {
      // tslint:disable-next-line:prefer-conditional-expression
      day = this.appendzero(result.day.toString());
      month = this.appendzero(result.month.toString());
      this.model.enddate = day + "/" + month + "/" + result.year;
      this.enddate = new Date(result.year.toString() + "-" + month + "-" + day);
      this.leaveEndDate = new Date(this.enddate);
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
    if (this.connectionService.checkConnection()) {
      if (this.validateleaveapplication()) {
        this.busyindicator = true;
        const leaveInfo = this.prepareLeaveData();
        this.leaveservice.leaveapplypost(leaveInfo)
          .subscribe(
            (leaveapplyresponse) => {
              if (leaveapplyresponse) {
                this.busyindicator = false;
                Toast.makeText("Leave applied sucessfully").show();
                this.routerExtentions.navigate(['/leavebalance'], {
                  transition: { name: "slideBottom", duration: 100 }
                });
              }
              else {
                this.busyindicator = false;
              }
            }, (error) => {
              this.busyindicator = false;
              Toast.makeText("Oops! Something went wrong.").show();
            }
          );
      }
    }
  }

  validateleaveapplication(): Boolean {
    if (this.startdate === undefined) {
      Toast.makeText("Start Date is required.").show();
      return false;
    }
    if (this.enddate === undefined) {
      Toast.makeText("End Date is required.").show();
      return false;
    }
    if (this.leaveStartDate.getTime() > this.leaveEndDate.getTime()) {
      Toast.makeText("Leave End Date must be greater than Start Date.").show();
      return false;
    }
    if ((new Date(this.startdate).toISOString()) === (new Date(this.enddate).toISOString())
      && (this.session1value === 2 && this.session2value === 1)) {
      Toast.makeText("Sessions must be Equal or from Session1 to Session2 on the same date.").show();
      return false;
    }
    if (this.model.leavetype === 0 && (this.availableleaves == 0 || this.availableleaves == undefined)) {
      Toast.makeText("Please select a Leave Type.").show();
      return false;
    }
    if (this.model.leavetype != "3" && (this.availableleaves == 0 || this.availableleaves < +(this.model.leaveDays))) {
      Toast.makeText("You don't have sufficient leaves, please contact admin.").show();
      return false;
    }
    if (this.model.leavereason === undefined) {
      Toast.makeText("Leave Reason is required.").show();
      return false;
    }
    return true;
  }

  prepareLeaveData(): Leave {
    const leaveInfo = new Leave();
    leaveInfo.EmployeeId = this.employeeId;
    leaveInfo.LeaveTypeId = +(this.model.leavetype);
    leaveInfo.LeaveStartDate = this.leaveStartDate.toISOString();
    leaveInfo.LeaveEndDate = this.leaveEndDate.toISOString();
    leaveInfo.NumberOfLeaveDays = +(this.model.leaveDays);
    leaveInfo.LeaveReason = this.model.leavereason;
    leaveInfo.LeaveStatus = "Waiting for approval";
    leaveInfo.AdminRemark = null;
    leaveInfo.CreatedBy = this.employeeId.toString();
    leaveInfo.ModifiedBy = this.employeeId.toString();
    leaveInfo.StartDateSession = this.session1value;
    leaveInfo.EndDateSession = this.session2value;

    return leaveInfo;
  }



}
