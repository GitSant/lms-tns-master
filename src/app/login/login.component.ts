import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import * as app from "tns-core-modules/application";
import * as Toast from "nativescript-toast";
import { Page } from "tns-core-modules/ui/page/page";
import { inputType, prompt } from "ui/dialogs";
import { User } from "../models/user.model";
import { AuthenticationService } from "../services/authentication.service";
import { StorageService } from "../services/storage.service";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Employee } from "../models/employee.model";
import { AndroidActivityBackPressedEventData } from "tns-core-modules/application";

@Component({
  selector: "Login",
  moduleId: module.id,
  templateUrl: "./login.component.html"
})
export class LoginComponent implements OnInit {
  @ViewChild("password") passwordField: ElementRef;
  @ViewChild("email") emailField: ElementRef;

  user: User;
  userInfo:Employee;
  isAuthenticating = false;
  emailvalidateerror: boolean = false;
  passwordValidateError: boolean = false;
  emailformatvalidationerror: boolean = false;
  // tslint:disable-next-line:max-line-length
  constructor(
    private page: Page,
    private routerExtensions: RouterExtensions,
    private authservice: AuthenticationService,
    private storageService: StorageService
  ) {
    this.user = new User();
    // this.user.email = "saptagiri.k@tekyslab.com";
    // this.user.password = "Tekys@123";
    this.user.email = "";
    this.user.password = "";
    this.userInfo=this.storageService.getuserInfo();
  }

  // tslint:disable-next-line:no-empty
  ngOnInit(): void {
    this.page.actionBarHidden = true;
    app.android.on(app.AndroidApplication.activityBackPressedEvent,(args:AndroidActivityBackPressedEventData)=>
    {
        if(this.userInfo==undefined){
           // Toast.makeText("You are logged out, Please Login.").show();
              args.cancel=true;
        }
        else{
            args.cancel=false;
        }
    })
  
  }
  login() {
    this.validateEmail(this.user.email)
    this.validatePassword(this.user.password)
    this.validateEmailFormat(this.user.email)
    this.isAuthenticating = true;
    if (this.user.email && this.user.password) {
      this.authservice.login(this.user).subscribe(
        (employeeLoginResponse) => {
          if (employeeLoginResponse) {
            let data = JSON.parse(JSON.stringify(employeeLoginResponse));
            this.storageService.setuserInfo(data);
            this.isAuthenticating = false;
            Toast.makeText("Login success!").show();
            this.routerExtensions.navigate(["/leavebalance"], { clearHistory: true });
          }
          else {
            this.isAuthenticating = false;
            Toast.makeText("Invalid Credentials! Login failed.").show();
          }
        },
        (error) => {
          this.isAuthenticating = false;
          Toast.makeText("Oops! Somethind went wrong.").show();
          console.error(error);
        }
      );
    }
  }
  validateform(formvalue: any) {
    var emailvalue = formvalue.email;
    var passwordvalue = formvalue.password;
    if (!this.validateEmail(emailvalue)) {
      return false;
    }
    else if (!this.validatePassword(passwordvalue)) {
      return false;
    }
    else if (!this.validateEmailFormat(emailvalue)) {
      return false;
    }
    else {
      return true;
    }
  }
  validateEmail(emailvalue: string): boolean {
    if (emailvalue) {
      this.emailvalidateerror = false;
      return true;
    }
    else {
      this.emailvalidateerror = true;
      return false;
    }
  }
  validatePassword(passwordvalue: string) {
    if (passwordvalue) {
      this.passwordValidateError = false;
      return true;
    }
    else {
      this.passwordValidateError = true;
      return false;
    }
  }
  validateEmailFormat(emailvalue: string): boolean {
    var regex = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
    if (!regex.test(emailvalue)) {
      this.emailformatvalidationerror = true;
      return false;
    }
    else {
      this.emailformatvalidationerror = false;
      return true;
    }
  }
}

