import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl,Validators} from '@angular/forms'
import { AppService } from 'src/app/app.service';
import{formatDate} from '@angular/common'
import{Router,ActivatedRoute} from '@angular/router'
import {ToastrService} from 'ngx-toastr'
import {DatePipe} from '@angular/common'
import{SocketService} from '../../socket.service'
import * as io from 'socket.io-client'

@Component({
  selector: 'app-edit-issue',
  templateUrl: './edit-issue.component.html',
  styleUrls: ['./edit-issue.component.css']
})
export class EditIssueComponent implements OnInit {
 private url='http://localhost:3000'
 // private url="http://api.my-app-dev.tk"
  public socket
  editAssign:boolean=false
  issueForm=new FormGroup({
    title:new FormControl('',Validators.required),
    reporter:new FormControl(''),
    date:new FormControl(''),
    description:new FormControl('',Validators.required),
    status:new FormControl('')
  })
  statusItems:String[]=[
    "In-Backlog","In-Test","In-Process","Done"
  ]
  reporterItems:String[]=[
  ]
  indexItems:any[]=[

  ]
  assignto:String=''
  reporter:String=''
  assignToName:String=''
    constructor(private appService:AppService,private socketService:SocketService,private datePipe:DatePipe,private activatedRoute:ActivatedRoute,private router:Router,private toastr:ToastrService) {
      let todayDate=formatDate(new Date(),'yyyy-MM-dd','en-US')
      this.issueForm.get('date').setValue(todayDate)
      this.issueForm.get('status').setValue(this.statusItems[0])
      this.issueForm.get('status').setValue(this.reporterItems[0])
      this.activatedRoute.queryParams.subscribe(
        data=>{
          this.socket=io(this.url) 
          let title=data["title"]
          if(title!=undefined)
          this.fetchIssueData(title)
        }
      )
     }
  
    ngOnInit() {
      this.appService.fetchIssuesInit().subscribe(
        data=>{
          for(let object of data.data){
            this.indexItems.push(object.userId)
            this.reporterItems.push(object.firstName+" "+object.lastName)
            if(this.reporterItems[0]==window.sessionStorage.getItem('name')){
              this.issueForm.get('reporter').setValue(this.reporterItems[1])
            }
            else{
              this.issueForm.get('reporter').setValue(this.reporterItems[0])
            }
          }
        }
      )
    }

    Assign=()=>{
      this.editAssign=!this.editAssign
    }

    fetchIssueData=(title)=>{
      let data={
        title:title
      }
      let fetchIssueObject:any
      this.appService.fetchIssueData(data).subscribe(
        data=>{
          if(data.message=="Issue doesnot exist"){
            this.router.navigate['/home']
            this.toastr.error("Issue does not exist")
          }
          else{
          this.issueForm.get('date').setValue(data.data.date.substring(0,10))
          fetchIssueObject=data.data
          this.issueForm.get('title').setValue(data.data.title)
          this.issueForm.get('reporter').setValue(window.sessionStorage.name)
          this.issueForm.get('description').setValue(data.data.description)
          this.issueForm.get('status').setValue(data.data.status)
          this.assignto=data.data.assignto
          this.reporter=data.data.reporter
          this.assignToName=data.data.assignToName
          }
        }
      )
    }


    onSubmit=()=>{
      let description=this.issueForm.get('description').value.substring(3)
      description=description.replace(/<[^>]*>/g, '')
      let index=this.reporterItems.indexOf(this.issueForm.get('reporter').value)
    let userId=this.indexItems[index]
    let data
    if(this.editAssign==true)
       data={
        title:this.issueForm.get('title').value,
        reporter:window.sessionStorage.getItem('name'),
        assignto:userId,
        assignToName:this.issueForm.get('reporter').value,
        date:this.issueForm.get('date').value,
        description:description,
        status:this.issueForm.get('status').value
      }
      else{
        data={
          title:this.issueForm.get('title').value,
          reporter:this.reporter,
          assignto:this.assignto,
          assignToName:this.assignToName,
          date:this.issueForm.get('date').value,
          description:description,
          status:this.issueForm.get('status').value
        }
      }

      this.appService.editIssue(data).subscribe(
        data=>{
          if(data.message=="Issue not Edited"){
            this.toastr.error(data.message)
            this.router.navigate(['/home'])
          }
          else{
            this.toastr.success("Issue Edited Successfully")
            this.appService.getWatchList(this.issueForm.get('title').value).subscribe(
              data=>{
                this.socket.emit('edit-issue',data.data)
              }
            )
            this.router.navigate(['/home'])
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
    })
    }
    edit=(i)=>{
      let description=i.description.substring(3)
      description=description.substring(0,description.length-4)
      this.issueForm.get('title').setValue(i.title)
      this.issueForm.get('reporter').setValue(i.reporter)
      this.issueForm.get('date').setValue(i.date)
      this.issueForm.get('description').setValue(description)
      this.issueForm.get('status').setValue(i.status)
    }

}
