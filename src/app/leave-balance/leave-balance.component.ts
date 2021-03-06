import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { HttpClient } from "@angular/common/http"
import { LeaveService } from '../services/leave.service';
import { LeaveBalance } from '../models/leave-balance.model';
import { StorageService } from '../services/storage.service';
import { Employee } from '../models/employee.model';
import * as Toast from "nativescript-toast";
import { EventData, Page } from 'tns-core-modules/ui/page/page';
import { DropDown, SelectedIndexChangedEventData } from 'nativescript-drop-down';
import { ListPicker } from "tns-core-modules/ui/list-picker";
import { ConnectivityService } from '../services/connectivity.service';

@Component({
  selector: 'ns-leave-balance',
  templateUrl: './leave-balance.component.html',
  styleUrls: ['./leave-balance.component.css'],
  moduleId: module.id,
})
export class LeaveBalanceComponent implements OnInit {
  @ViewChild('dd') dropDown: ElementRef;

  currentYear: any = (new Date()).getFullYear().toString();
  allYears: Array<string> = [];
  selectedyear: any;
  employeeId: number;
  userInfo: Employee;
  empLeaveBalanceInfo: LeaveBalance;
  currentYearIndex: number;
  year: string;
  model: any;
  showindicator: boolean = false;
  public dropdownCss: string = "dropdownContentsCss";
  constructor(private http: HttpClient, private connectionService: ConnectivityService, private leaveService: LeaveService, private storageService: StorageService) {
    this.userInfo = this.storageService.getuserInfo();
    if (this.userInfo) {
      this.employeeId = this.userInfo.Id;
    }
  }

  ngOnInit() {
    this.getAllEmpLeaveBalYears();
    this.getEmpLeaveBalance(this.currentYear);
  }
  getAllEmpLeaveBalYears() {
    this.leaveService.getAllYears()
      .subscribe(
        (allyearsResponse) => {
          if (allyearsResponse) {
            this.allYears = JSON.parse(JSON.stringify(allyearsResponse));
            this.selectedyear = this.allYears.findIndex(year => year == this.currentYear);
          }
        },
        (error) => {
          Toast.makeText("Oops! Something went wrong.").show();
          console.error(error);
        }
      );
  }

  getEmpLeaveBalance(year: string) {
    this.showindicator = true;
    this.leaveService.getLeaveBalance(this.employeeId, year)
      .subscribe(
        (empLeaveBalanceResponse) => {
          if (empLeaveBalanceResponse) {
            this.showindicator = false;
            let res = empLeaveBalanceResponse[0];
            this.empLeaveBalanceInfo = res['EmpLeaveBalance'];
          }
        },
        (error) => {
          this.showindicator = false;
          Toast.makeText("Oops! Something went wrong.").show();
          console.error(error);
        }
      );
    this.showindicator = false;
  }

  public openDD(args: EventData) {
    let page = <Page>args.object;
    let dropdown = <DropDown>page.getViewById('yeardd');
    dropdown.open();
  }

  yearIndexChanged(args: SelectedIndexChangedEventData) {
    if (this.connectionService.checkConnection()) {
    let picker = <ListPicker>args.object;
    var index = args.newIndex;
    this.currentYear = this.allYears[picker.selectedIndex];
    this.currentYearIndex = index;
    this.getEmpLeaveBalance(parseInt(this.currentYear).toString());
    }
  }
}
