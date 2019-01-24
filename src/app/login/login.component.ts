import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import * as app from "tns-core-modules/application";
import * as Toast from "nativescript-toast";
import { Page, EventData, isAndroid } from "tns-core-modules/ui/page/page";
import { inputType, prompt } from "ui/dialogs";
import { User } from "../models/user.model";
import { AuthenticationService } from "../services/authentication.service";
import { StorageService } from "../services/storage.service";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Employee } from "../models/employee.model";
import { AndroidActivityBackPressedEventData, getRootView } from "tns-core-modules/application";
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular/side-drawer-directives";
import { AppComponent } from "../app.component";

@Component({
  selector: "Login",
  moduleId: module.id,
  templateUrl: "./login.component.html"
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild("password") passwordField: ElementRef;
  @ViewChild("email") emailField: ElementRef;
  private drawer: RadSideDrawer;

  user: User;
  userInfo: Employee;
  showindicator = false;
  emailvalidateerror: boolean = false;
  passwordValidateError: boolean = false;
  emailformatvalidationerror: boolean = false;
  emailfieldcolor = "lightgray";
  passwordfieldcolor = "lightgray";

  // tslint:disable-next-line:max-line-length
  constructor(
    private page: Page,
    private routerExtensions: RouterExtensions,
    private authservice: AuthenticationService,
    private storageService: StorageService,
    private appComponent: AppComponent
  ) {
    this.user = new User();
    this.user.email = "saptagiri.k@tekyslab.com";
    this.user.password = "Tekys@123";
    // this.user.email = "";
    // this.user.password = "";
    this.userInfo = this.storageService.getuserInfo();
  }

  // tslint:disable-next-line:no-empty
  ngOnInit(): void {
    //this.page.actionBarHidden = true;
    app.android.on(app.AndroidApplication.activityBackPressedEvent, (args: AndroidActivityBackPressedEventData) => {
      if (this.userInfo == undefined) {
        args.cancel = true;
      }
      else {
        args.cancel = false;
      }
    })
  }

  ngAfterViewInit() {
    // use setTimeout otherwise there is no getRootView valid reference
    setTimeout(() => {
      this.drawer = <RadSideDrawer>getRootView();
      this.drawer.gesturesEnabled = false;
    }, 100);
  }

  login() {
    this.validateEmail(this.user.email);
    this.validatePassword(this.user.password);
    setTimeout(() => {
      this.showindicator = true;
    }, 200);
    if (this.user.email && this.user.password) {
      this.authservice.login(this.user).subscribe(
        (employeeLoginResponse) => {
          if (employeeLoginResponse) {
            let data = JSON.parse(JSON.stringify(employeeLoginResponse));
            this.storageService.setuserInfo(data);
            this.appComponent.updateuserinfo(data.Name);
            this.showindicator = false;
            Toast.makeText("Login success!").show();
            this.drawer.gesturesEnabled = true;
            //
            this.routerExtensions.navigate(["/leavebalance"], { clearHistory: true });
          }
          else {
            this.showindicator = false;
            Toast.makeText("Invalid Credentials! Login failed.").show();
          }
        },
        (error) => {
          this.showindicator = false;
          Toast.makeText("Oops! Somethind went wrong.").show();
          console.error(error);
        }
      );
    }
  }

  validatemail(emailvalue: string) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!regex.test(emailvalue)) {
      this.emailformatvalidationerror = true;
      return false;
    } else {
      this.emailformatvalidationerror = false;
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

  validatePassword(passwordvalue: string): boolean {
    if (passwordvalue) {
      this.passwordValidateError = false;
      return true;
    }
    else {
      this.passwordValidateError = true;
      return false;
    }
  }
}

