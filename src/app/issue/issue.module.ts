import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueComponent } from './issue/issue.component';
import{RouterModule,Routes} from '@angular/router'
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {QuillModule} from 'ngx-quill';
import { EditIssueComponent } from './edit-issue/edit-issue.component'
import {DatePipe} from '@angular/common';
import { ViewIssueComponent } from './view-issue/view-issue.component';
import { ViewAllIssueComponent } from './view-all-issue/view-all-issue.component'
import {NgxPaginationModule} from 'ngx-pagination'
import{MatSortModule} from '@angular/material'
import{DataTablesModule} from 'angular-datatables';
// import {HomeComponent} from '../user/home/home.component'
// import {SignupComponent} from '../user/signup/signup.component'
// import {LoginComponent} from '../user/login/login.component'

@NgModule({
  declarations: [IssueComponent, EditIssueComponent, ViewIssueComponent, ViewAllIssueComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,ReactiveFormsModule,
    NgxPaginationModule,MatSortModule,
    DataTablesModule,
    QuillModule.forRoot(),
    RouterModule.forChild([
      {path:'issue',component:IssueComponent},
      {path:'edit-issue',component:EditIssueComponent},
      {path:'view-issue',component:ViewIssueComponent},
      {path:'view-all-issue',component:ViewAllIssueComponent}
    ])
  ],
  providers:[EditIssueComponent,DatePipe]
})
export class IssueModule { }
