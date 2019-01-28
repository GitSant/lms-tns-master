import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    { path: "login", loadChildren: "~/app/login/login.module#LoginModule" },
    { path: "applyleave", loadChildren: "~/app/apply-leave/apply-leave.module#ApplyLeaveModule" },
    { path: "leavebalance", loadChildren: "~/app/leave-balance/leave-balance.module#LeaveBalanceModule" },
    { path: "geolocation", loadChildren: "~/app/geo-location/geolocation.module#GeoLocationModule"},
    { path: "geomap", loadChildren: "~/app/geo-map/geo-map.module#GeoMapModule"}
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
