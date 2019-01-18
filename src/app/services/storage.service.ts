import { Injectable } from "@angular/core";
import{Employee}from "../models/employee.model"
@Injectable({
    providedIn: "root"
  })
  export class StorageService {
      _userInfo:Employee;

      public setuserInfo(value){
         this._userInfo=value;
      }

      public getuserInfo(){
         return this._userInfo;
      }
  }