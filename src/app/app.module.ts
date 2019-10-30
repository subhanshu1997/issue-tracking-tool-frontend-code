import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {UserModule} from './user/user.module'
 import{IssueModule} from './issue/issue.module'
import { AppComponent } from './app.component';
import{RouterModule,Router} from '@angular/router'
import { LoginComponent } from './user/login/login.component';
import {HttpClientModule} from '@angular/common/http'
import {CookieService} from 'ngx-cookie-service'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    UserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    IssueModule,
    RouterModule.forRoot([
      {path:'',redirectTo:'login',pathMatch:'full'},
      {path:'login',component:LoginComponent,pathMatch:'full'}
      // {path:'*',component:LoginComponent},
      // {path:'**',component:LoginComponent}
    ])
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
