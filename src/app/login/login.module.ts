import {NgModule,NO_ERRORS_SCHEMA} from '@angular/core';
import{NativeScriptCommonModule} from "nativescript-angular/common";
import {NativeScriptFormsModule} from "nativescript-angular/forms";
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        LoginRoutingModule
    ],
    declarations: [
        LoginComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class LoginModule { }

