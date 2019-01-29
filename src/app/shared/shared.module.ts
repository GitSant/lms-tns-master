import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { HeaderComponent } from './header/header.component';
import {NativeScriptFormsModule} from "nativescript-angular/forms";

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    NativeScriptCommonModule,
    NativeScriptFormsModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  exports:[HeaderComponent]
})
export class SharedModule { }
