import { Component, OnInit,ViewChild } from '@angular/core';
import {AppService} from '../../app.service'
import {Router} from '@angular/router' 
import {EditIssueComponent} from '../../issue/edit-issue/edit-issue.component'
import{ToastrService} from 'ngx-toastr'
import{SocketService} from '../../socket.service'
import * as io from 'socket.io-client'
import{Sort} from '@angular/material'
import {FormGroup,FormControl,Validators} from '@angular/forms'
import{Subject} from 'rxjs'


@Component({
  selector: 'app-view-all-issue',
  templateUrl: './view-all-issue.component.html',
  styleUrls: ['./view-all-issue.component.css']
})
export class ViewAllIssueComponent implements OnInit {
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
  searchForm=new FormGroup({
    search:new FormControl('',Validators.required)
  })
  private url='http://localhost:3000'
  //private url="http://api.my-app-dev.tk"
  public socket
    constructor(private appService:AppService,private socketService:SocketService,private toastr:ToastrService,private router:Router,private editIssueComponent:EditIssueComponent) { }
    status:boolean=false
    searchBool:boolean=false
    ngOnInit() {
      this.appService.fetchAllIssues().subscribe(
        data=>{
          console.log(data)
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
      this.socket=io(this.url)
      this.socket.on(window.sessionStorage.userId,(data)=>{
        this.toastr.info(data,'',{
          timeOut:5000
        })
      })
    }

    onKey(event: any) { // without type info
      let data={
        identifier:this.searchForm.get('search').value
      }
      this.appService.search(data).subscribe(
        data=>{
          console.log(data)
          this.issuesCollection=data.data
          if(this.issuesCollection.length==0){
            this.toastr.error("No data fetched from search")
          }
          else{
            this.toastr.success("Data fetched from search.Please select issue from dropdown")
          }
        }
      )
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

    onChange($event){
      let index = $event.target.options.selectedIndex
      this.view(this.issuesCollection[index-1])
      }

    view=(i)=>{
      this.router.navigate(['/view-issue'],{queryParams:{"title":i.title}})
    }
  
    delete=(i)=>{
      this.appService.deleteIssue(i).subscribe(
        data=>{
          if(data.message=="Issue Deleted Successfully"){
            // location.reload(true)
            this.ngOnInit()
            this.toastr.success(data.message)
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
