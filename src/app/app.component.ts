import { Component, OnInit, ViewChild } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
import { filter } from "rxjs/operators";
import * as app from "tns-core-modules/application";
import { StorageService } from "./services/storage.service";
import { Employee } from "./models/employee.model";
import { AndroidApplication, AndroidActivityBackPressedEventData } from "application";
import * as Toast from "nativescript-toast";

@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
    private _activatedUrl: string;
    private _sideDrawerTransition: DrawerTransitionBase;
    emailId: string;
    name: string;
    userInfo: Employee;
    busyindaicator: boolean = false;

    constructor(private router: Router, private routerExtensions: RouterExtensions, private storageService: StorageService) {
        this.userInfo = this.storageService.getuserInfo();
        if (this.userInfo) {
            this.emailId = this.userInfo.EmailId;
            this.name = this.userInfo.Name;
        }
        // Use the component constructor to inject services.

    }

    ngOnInit(): void {
        this._activatedUrl = "/home";
        this._sideDrawerTransition = new SlideInOnTopTransition();

        this.router.events
            .pipe(filter((event: any) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => this._activatedUrl = event.urlAfterRedirects);

    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    isComponentSelected(url: string): boolean {
        return this._activatedUrl === url;
    }

    onNavItemTap(navItemRoute: string): void {
        this.routerExtensions.navigate([navItemRoute], {
            transition: {
                name: "fade"
            }
        });
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
    }

    public updateuserinfo(username: string) {
        this.name = username;
    }

    onNavItem(navItemRoute: string): void {
        // setTimeout(() => {
        //     this.busyindaicator = true;
        // }, 200);
        this.routerExtensions.navigate(["/login"]);
        //Toast.makeText("You are logged out, Please Login.").show();
        //this.busyindaicator = false;
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
    }
}
