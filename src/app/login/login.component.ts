import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import * as app from "tns-core-modules/application";
import * as Toast from "nativescript-toast";
import { Page } from "tns-core-modules/ui/page/page";
import { inputType, prompt } from "ui/dialogs";
import { User } from "../models/user.model";
import { AuthenticationService } from "../services/authentication.service";
import { StorageService } from "../services/storage.service";

@Component({
  selector: "Login",
  moduleId: module.id,
  templateUrl: "./login.component.html"
})
export class LoginComponent implements OnInit {
  @ViewChild("password") passwordField: ElementRef;
  @ViewChild("email") emailField: ElementRef;

  user: User;
  isAuthenticating = false;
  // tslint:disable-next-line:max-line-length
  constructor(
    private page: Page,
    private routerExtensions: RouterExtensions,
    private authservice: AuthenticationService,
    private abc:StorageService
  ) {
    this.user = new User();
    this.user.email = "";
    this.user.password = "";
  }

  // tslint:disable-next-line:no-empty
  ngOnInit(): void {}

  login() {
    this.isAuthenticating = true;
    this.authservice.login(this.user).subscribe(
      (employeeLoginResponse) => {
        if (employeeLoginResponse) {
           let data=JSON.parse(JSON.stringify(employeeLoginResponse));
           this.abc.setuserInfo(data);
          this.isAuthenticating = false;
          Toast.makeText("Login success!").show();
          this.routerExtensions.navigate(["/leavebalance"], { clearHistory: true });
        }
        else{
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
