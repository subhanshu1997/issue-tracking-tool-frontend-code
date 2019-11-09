import { Component, OnInit } from '@angular/core';
import {AppService} from '../../app.service'
import {Router} from '@angular/router' 
import {EditIssueComponent} from '../../issue/edit-issue/edit-issue.component'
import{ToastrService} from 'ngx-toastr'
import{SocketService} from '../../socket.service'
import * as io from 'socket.io-client'
import{Sort} from '@angular/material'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  issuesCollection:any[]=[{assignto: "Name2",
date: "2019-10-15T00:00:00.000Z",
description: "<p>Subhanshu	</p>",
reporter: "Subhanshu Bigasia",
status: "Resolved",
title: "Subhanshu"}]
sample:any[]=[{assign:"Hello"}]
isEmpty:boolean=true
p:number=1
sortedIssues:any[]
private url='http://localhost:3000'
//private url="http://api.my-app-dev.tk"
public socket
  constructor(private appService:AppService,private socketService:SocketService,private toastr:ToastrService,private router:Router,private editIssueComponent:EditIssueComponent) {
    this.socket=io(this.url)  
  }
  status:boolean=false
  ngOnInit() {
    this.appService.fetchIssues().subscribe(
      data=>{
        if(data.message=='Authentication Token Is Missing In Request'){
          this.router.navigate['/login']
          this.toastr.error('Please login first')
        }
        if(data.data.length==0)
        this.isEmpty=true
        else{
          this.isEmpty=false
        this.issuesCollection=data.data
        this.sortedIssues=this.issuesCollection
        this.status=true}
      }
    )
    this.socket.on(window.sessionStorage.userId,(data)=>{
      if(data.action){
      if(data.action=="Comment"){
        this.toastr.info("A comment has been posted on issue with title "+data.title)
      }else if(data.action=="Edit"){
      this.toastr.info("Issue with title "+data.title+" has been edited")}
      else if(data.action=="Delete"){
        this.toastr.info("Issue with title "+data.title+" has been deleted")
      }
    }
    else{
      this.toastr.info("An Issue has been reported to you")
    }
    })
  }


  logout=()=>{
    this.appService.logout().subscribe(
      data=>{
        if(data.message="Logged Out Successfully"){
          window.sessionStorage.clear()
          this.toastr.success(data.message)
          this.router.navigate(['/login'])
        }
        else{
          this.toastr.error(data.message)
        }
      }
    )
  }
  edit=(i)=>{
    this.router.navigate(['/edit-issue'],{queryParams:{"title":i.title}})
  }
  view=(i)=>{
    this.router.navigate(['/view-issue'],{queryParams:{"title":i.title}})
  }

  delete=(i)=>{
    this.appService.deleteIssue(i).subscribe(
      data=>{
        if(data.message=="Issue Deleted Successfully"){
          this.ngOnInit()
          this.toastr.success(data.message)
          this.appService.getWatchList(i.title).subscribe(
            data=>{
              this.socket.emit('delete-issue',data.data)
            }
          )
        }else{
          this.toastr.error(data.message)
        }
      }
    )
  }
  sortData(sort: Sort) {
    const data = this.issuesCollection.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedIssues = data;
      return;
    }

    this.sortedIssues = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'title': return compare(a.title, b.title, isAsc);
        case 'reporter': return compare(a.reporter, b.reporter, isAsc);
        case 'assignto': return compare(a.assignto, b.assignto, isAsc);
        case 'description': return compare(a.description, b.description, isAsc);
        case 'status': return compare(a.status, b.status, isAsc);
        default: return 0;
      }
    });
  }

}
function compare(a: string, b:string, isAsc: boolean) {
  return (a == b ? 0 : (a<b)?-1:1) * (isAsc ? 1 : -1);
}