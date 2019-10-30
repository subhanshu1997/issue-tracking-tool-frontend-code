import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl,Validators} from '@angular/forms'
import { AppService } from 'src/app/app.service';
import{formatDate} from '@angular/common'
import{Router} from '@angular/router'
import {ToastrService} from 'ngx-toastr'
import {SocketService} from '../../socket.service'
import * as io from 'socket.io-client'

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css']
})
export class IssueComponent implements OnInit {
issueForm=new FormGroup({
  title:new FormControl('',Validators.required),
  assignto:new FormControl(''),
  date:new FormControl(''),
  description:new FormControl('',Validators.required),
  status:new FormControl('')
})
statusItems:String[]=[
  "Resolved","Pending"
]
reporterItems:String[]=[
]
indexItems:any[]=[

]
//private url='http://localhost:3000'
private url="http://api.my-app-dev.tk"
public socket
  constructor(private appService:AppService,private router:Router,private socketService:SocketService,private toastr:ToastrService) {
    let todayDate=formatDate(new Date(),'yyyy-MM-dd','en-US')
    this.issueForm.get('date').setValue(todayDate)
    this.issueForm.get('status').setValue(this.statusItems[0])
    this.issueForm.get('status').setValue(this.reporterItems[0])
   }

  ngOnInit() {
    this.appService.fetchIssuesInit().subscribe(
      data=>{
        console.log(data)
        for(let object of data.data){
          if(this.reporterItems.indexOf(object.firstName+" "+object.lastName)<0){
          this.indexItems.push(object.userId)
          this.reporterItems.push(object.firstName+" "+object.lastName)}
          this.issueForm.get('assignto').setValue(this.reporterItems[0])
          this.issueForm.get('status').setValue(this.statusItems[0])
        }
      }
    )
    this.socket=io(this.url)    
  }

  sendMsg=()=>{
    
  }

  onSubmit=()=>{
    let description=this.issueForm.get('description').value.substring(3)
    description=description.replace(/<[^>]*>/g, '')
    let index=this.reporterItems.indexOf(this.issueForm.get('assignto').value)
    let userId=this.indexItems[index]
    let data={
      title:this.issueForm.get('title').value,
      assignto:userId,
      assignToName:this.issueForm.get('assignto').value,
      date:this.issueForm.get('date').value,
      description:description,
      status:this.issueForm.get('status').value
    }
    console.log(data.description.replace(/<\/?[^>]+(>|$)/g, ""))
    this.appService.reportIssue(data).subscribe(
      data=>{
        console.log(data)
        if(data.message=='Issue Reported Succesfully'){
          let index=this.reporterItems.indexOf(this.issueForm.get('assignto').value)
    let userId=this.indexItems[index]
    this.socket.emit('issue-raised',userId)
          this.toastr.success(data.message)
          // this.socketService.emit(userId)
          // this.socketService.socketEvent()
          this.router.navigate(['/home'])
        }
        else{
          this.toastr.error(data.message)
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
  print=(i)=>{
    console.log(i)
  }
}
