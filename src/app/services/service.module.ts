import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import {
  SettingsService,
  SidebarService,
  SharedService,
  UsuarioService,
  LoginGuard
} from './service.index';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    UsuarioService,
    SettingsService,
    SidebarService,
    SharedService,
    LoginGuard
  ]
})
export class ServiceModule { }
