import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef
} from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import * as app from "tns-core-modules/application";
import * as Toast from "nativescript-toast";
import { User } from "../models/user.model";
import { AuthenticationService } from "../services/authentication.service";
import { StorageService } from "../services/storage.service";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Employee } from "../models/employee.model";
import {
  AndroidActivityBackPressedEventData,
  getRootView
} from "tns-core-modules/application";
import { AppComponent } from "../app.component";
import { ConnectivityService } from "../services/connectivity.service";

@Component({
  selector: "Login",
  moduleId: module.id,
  templateUrl: "./login.component.html",
  styleUrls: ['./login.component.css'],
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
  enablebackbutton: boolean;

  // tslint:disable-next-line:max-line-length
  constructor(
    private connectionService: ConnectivityService,
    private routerExtensions: RouterExtensions,
    private authservice: AuthenticationService,
    private storageService: StorageService,
    private appComponent: AppComponent
  ) {
    this.user = new User();
    // this.user.email = "saptagiri.k@tekyslab.com";
    // this.user.password = "Tekys@123";
    this.user.email = "saptagiri.k@tekyslab.com";
    this.user.password = "Tekys@123";
    this.userInfo = this.storageService.getuserInfo();
  }

  // tslint:disable-next-line:no-empty
  ngOnInit(): void {
    // this.page.actionBarHidden = true;
    this.enableOrdisableBackButton();
  }

  ngAfterViewInit() {
    // use setTimeout otherwise there is no getRootView valid reference
    setTimeout(() => {
      this.drawer = <RadSideDrawer>getRootView();
      this.drawer.gesturesEnabled = false;
    }, 100);
  }

  enableOrdisableBackButton() {
    // disabling back button
    app.android.on(
      app.AndroidApplication.activityBackPressedEvent,
      (args: AndroidActivityBackPressedEventData) => {
          args.cancel = (this.userInfo === undefined) ? true : false;
      }
    );
  }

  login() {
    if (this.connectionService.checkConnection()) {
      this.validateEmail(this.user.email);
      this.validatePassword(this.user.password);
      if (this.user.email && this.user.password) {
        this.showindicator = true;
        this.authservice.login(this.user).subscribe(
          (employeeLoginResponse) => {
            if (employeeLoginResponse) {
              const data = JSON.parse(JSON.stringify(employeeLoginResponse));
              this.storageService.setuserInfo(data);
              this.userInfo = this.storageService.getuserInfo();
              this.appComponent.updateuserinfo(data.Name);
              this.showindicator = false;
              Toast.makeText("Login success!").show();
              this.drawer.gesturesEnabled = true;
              this.enableOrdisableBackButton();
              this.routerExtensions.navigate(["/leavebalance"], {
                clearHistory: true
              });
            } else {
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
    } else {
      this.emailvalidateerror = true;

      return false;
    }
  }

  validatePassword(passwordvalue: string): boolean {
    if (passwordvalue) {
      this.passwordValidateError = false;

      return true;
    } else {
      this.passwordValidateError = true;

      return false;
    }
  }
}
