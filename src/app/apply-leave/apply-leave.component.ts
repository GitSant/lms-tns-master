import { Component, OnInit } from '@angular/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import * as app from "tns-core-modules/application";
import * as modalDatepicker from "nativescript-modal-datetimepicker";
import { LeaveSession } from '../models/session';
import { ListPicker } from "tns-core-modules/ui/list-picker";
import { DropDown, SelectedIndexChangedEventData } from "nativescript-drop-down";
import { Page, EventData } from "tns-core-modules/ui/page/page";
import { ILeaveTypes } from '../models/leavetype.model';
import { LeaveService } from '../services/leave.service';
import * as Toast from "nativescript-toast";

@Component({
  selector: 'ns-apply-leave',
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.css'],
  moduleId: module.id,
})
export class ApplyLeaveComponent implements OnInit {

  isactive = false;
  startdate: string;
  enddate: string;
  session1index: number = 0;
  session2index: number = 1;
  leavetypeindex: number;
  model: any = {};
  leavetypedata: ILeaveTypes[];
  leavetypes: Array<string> = [];
  sessions: Array<string> = ["Session1", "Session2"];
  noOfLeaveDays: number;
  sessioncount: number = 1;
  availableleaves: any;

  constructor(private leaveservice: LeaveService) {
    this.model.leavetype = 0;
    this.model.session1 = 0;
    this.model.session2 = 1;
    this.leavetypes.push('--Leave Type--');
  }

  ngOnInit() {
    this.leaveservice.getleavetypes()
      .subscribe(
        (leavetyperesponse) => {
          if (leavetyperesponse) {
            this.leavetypedata = JSON.parse(JSON.stringify(leavetyperesponse));
            console.log(this.leavetypedata);
            this.leavetypedata.forEach(element => {
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

  private pickStartDate() {
    const picker = new modalDatepicker.ModalDatetimepicker();
    picker.pickDate({
      title: 'Enter start date.',
      theme: 'dark',
      maxDate: new Date(),
      is24HourView: false
    }).then((result) => {
      this.model.startdate = result['day'] + '/' + result['month'] + '/' + result['year'];
    }).catch((error) => {
      console.log('DatePickerError: ' + error);
    });
  }

  private pickEndDate() {
    const picker = new modalDatepicker.ModalDatetimepicker();
    picker.pickDate({
      title: 'Enter end date.',
      theme: 'dark',
      maxDate: new Date(),
      is24HourView: false
    }).then((result) => {
      this.model.enddate = result['day'] + '/' + result['month'] + '/' + result['year'];
    }).catch((error) => {
      console.log('DatePickerError: ' + error);
    });
  }

  opensession1DD(args: EventData) {
    let page = <Page>args.object;
    let dropdown = <DropDown>page.getViewById('session1dd');
    dropdown.open();
  }

  opensession2DD(args: EventData) {
    let page = <Page>args.object;
    let dropdown = <DropDown>page.getViewById('session2dd');
    dropdown.open();
  }

  openleavetypeDD(args: EventData) {
    let page = <Page>args.object;
    let dropdown = <DropDown>page.getViewById('leavetypedd');
    dropdown.open();
  }

  sessionOneIndexChanged(args: SelectedIndexChangedEventData) {
    this.session1index = args.newIndex;
    //this.model.session1 = this.sessions[this.session1index];
  }

  sessionTwoIndexChanged(args: SelectedIndexChangedEventData) {
    this.session2index = args.newIndex;
    //this.model.session2 = this.sessions[this.session2index];
  }

  leaveTypeIndexChanged(args: SelectedIndexChangedEventData) {
    this.leavetypeindex = args.newIndex;
    //this.model.leavetype = this.leavetypes[this.leavetypeindex];
    if (this.leavetypeindex !== 0) {
      this.leaveservice.getavailableleaves("4", this.leavetypeindex.toString())
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

  ondatechange() {
    if ((this.model.startDate != undefined && this.model.startDate != "") || (this.model.endDate != undefined && this.model.endDate != "")) {
      var date2 = new Date(this.model.startDate);
      var date1 = new Date(this.model.endDate);
      var timeDiff = Math.abs(date2.getTime() - date1.getTime());
      let days: number = Math.ceil(timeDiff / (1000 * 3600 * 24));
      this.noOfLeaveDays = days;
      if (this.noOfLeaveDays !== undefined)
        this.model.leaveDays = this.noOfLeaveDays + this.sessioncount;
    }
  }
  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }
}
