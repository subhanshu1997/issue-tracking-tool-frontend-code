import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import{RouterModule,Routes} from '@angular/router'
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { HomeComponent } from './home/home.component'
import {QuillModule} from 'ngx-quill'
import {NgxPaginationModule} from 'ngx-pagination'
import{MatSortModule} from '@angular/material';
import { NotificationComponent } from './notification/notification.component'

@NgModule({
  declarations: [LoginComponent, SignupComponent, HomeComponent, NotificationComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule,
    NgxPaginationModule,
    MatSortModule,
    RouterModule.forChild([
      {path:'sign-up',component:SignupComponent},
      {path:'login',component:LoginComponent},
      {path:'home',component:HomeComponent},
      {path:'notification',component:NotificationComponent}
    ])
  ],
  exports:[
    LoginComponent,HomeComponent,SignupComponent
  ]
})

export class UserModule {
 }
