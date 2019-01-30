import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
// import { HeaderComponent } from './header/header.component';
import {NativeScriptFormsModule} from "nativescript-angular/forms";
import { HeaderModule } from './header/header.module';

@NgModule({
  declarations: [],
  imports: [
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    HeaderModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  exports:[HeaderModule]
})
export class SharedModule { }
