import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'ns-leave-balance',
  templateUrl: './leave-balance.component.html',
  styleUrls: ['./leave-balance.component.css'],
  moduleId: module.id,
})
export class LeaveBalanceComponent implements OnInit {
  currentYear: any = (new Date()).getFullYear().toString();
  allYears: Array<string> = [];
  selectedyear:any;
  employeeId: number;
  userInfo: Employee;
  empLeaveBalanceInfo: LeaveBalance;
  currentYearIndex: number;
  year: string
  model: any;
  isAuthenticating:boolean=false;
  constructor(private http: HttpClient, private leaveService: LeaveService, private storageService: StorageService) {
    this.userInfo = this.storageService.getuserInfo();
    if(this.userInfo){
    this.employeeId = this.userInfo.Id;
    }
  }

  ngOnInit() {
    this.getAllEmpLeaveBalYears();
    this.getEmpLeaveBalance(this.currentYear);
  }
  getAllEmpLeaveBalYears() {
    this.isAuthenticating=true;
    this.leaveService.getAllYears()
      .subscribe(
        (allyearsResponse) => {
          if (allyearsResponse) {
            this.isAuthenticating=false;
            this.allYears = JSON.parse(JSON.stringify(allyearsResponse));
            this.selectedyear = this.allYears.findIndex(year => year == this.currentYear);
          }
        },
        (error) => {
          this.isAuthenticating=false;
          Toast.makeText("Oops! Something went wrong.").show();
          console.error(error);
        }
      )
  }

  getEmpLeaveBalance(year: string) {
    this.isAuthenticating=true;
    this.leaveService.getLeaveBalance(this.employeeId, year)
      .subscribe(
        (empLeaveBalanceResponse) => {
          if (empLeaveBalanceResponse) {
            let res = empLeaveBalanceResponse[0];    
            this.empLeaveBalanceInfo = res['EmpLeaveBalance']; 
          }
        },
        (error) => {
          this.isAuthenticating=false;
          Toast.makeText("Oops! Something went wrong.").show();
          console.error(error);
        }
      );
      
  }

  public openDD(args: EventData) {
    let page = <Page>args.object;
    let dropdown = <DropDown>page.getViewById('yeardd');
    dropdown.open();
  }

  yearIndexChanged(args: SelectedIndexChangedEventData) {
    let picker = <ListPicker>args.object;
    var index = args.newIndex;

    this.currentYear = this.allYears[picker.selectedIndex];
    this.currentYearIndex = index;
    this.getEmpLeaveBalance(parseInt(this.currentYear).toString());
    console.log(this.empLeaveBalanceInfo);
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }
}
